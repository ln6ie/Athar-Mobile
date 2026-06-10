// إجراءات الخلاصة - جلب وإنشاء وحذف المنشورات والإعجابات
import { api } from '../services/api';
import { Post } from '../types';
import { useAuthStore } from './useAuthStore';
import { useToastStore } from './useToastStore';
import i18n from 'i18next';

// حد أقصى للمنشورات في الذاكرة - تجنب ضغط Heremes GC
const MAX_POSTS_PER_TAB = 100;

/**
 * Reconciles local cache against a fresh server page.
 * Any post that existed locally but is absent from the server response
 * (and whose ID falls within the ID range of the server page) is considered
 * deleted and is stripped from the merged result.
 *
 * For the first page (reset=true) we simply use server data — no cache needed.
 * For subsequent pages we merge and deduplicate normally.
 */
const reconcileWithServer = (cachedPosts: Post[], newPosts: Post[], isReset: boolean): Post[] => {
  if (isReset) {
    // تحديث كامل: بيانات الخادم هي المصدر الموثوق - تجاهل التخزين المحلي
    return newPosts;
  }

  // صفحة تالية: بناء مجموعة المعرفات الجديدة
  const incomingIds = new Set<string>(newPosts.map((p) => p.id));

  // الاحتفاظ بالمنشورات المخبأة غير الموجودة في الصفحة الجديدة
  // إزالة المنشورات المخبأة ذات المعرفات المكررة واستبدالها من الخادم
  const survivingCache = cachedPosts.filter((p) => !incomingIds.has(p.id));

  return [...survivingCache, ...newPosts];
};

const deduplicatePosts = (posts: Post[]): Post[] => {
  const seen = new Map<string, boolean>();
  return posts.filter((post) => {
    if (seen.has(post.id)) return false;
    seen.set(post.id, true);
    return true;
  });
};

export const fetchFeedAction = async (set: any, get: any, reset = false, silent = false) => {
  const { posts, isLoading, isLoadingMore, isRefreshing, isFetchingFeed, activeTab, lastFetchTime, nextCursor } = get();
  
  const currentTabPosts = posts[activeTab] || [];
  const currentTabCursor = nextCursor[activeTab];

  if (!reset && (isLoading || isLoadingMore || isRefreshing || isFetchingFeed)) return;
  if (reset && (isRefreshing || isFetchingFeed)) return;
  if (!reset && !currentTabCursor) return;

  const now = Date.now();
  const lastFetched = lastFetchTime?.[activeTab] || 0;
  const timeElapsed = now - lastFetched;

  if (reset && silent && currentTabPosts.length > 0 && timeElapsed < 30000) {
    return;
  }

  set({ isFetchingFeed: true });

  if (silent) {
    set({ error: null });
  } else if (reset) {
    set({ isRefreshing: true, error: null });
  } else if (currentTabPosts.length > 0) {
    set({ isLoadingMore: true, error: null });
  } else {
    set({ isLoading: true, error: null });
  }

  try {
    const cursorParam = reset ? '' : (currentTabCursor ? `&cursor=${currentTabCursor}` : '');
    const response = await api.get(`/posts/feed?sort=${activeTab}${cursorParam}`);
    const { posts: newPosts, nextCursor: newCursor } = response.data;

    // توفيق ذكي: إزالة المنشورات المخبأة غير الموجودة على الخادم
    const { blockedUsers } = get();
    const reconciledPosts = reconcileWithServer(currentTabPosts, newPosts, reset);
    let uniquePosts = deduplicatePosts(reconciledPosts)
      .filter((post: Post) => !blockedUsers.includes(post.anonymousName));

    uniquePosts = uniquePosts.slice(0, MAX_POSTS_PER_TAB);

    set({
      posts: {
        ...get().posts,
        [activeTab]: uniquePosts,
      },
      nextCursor: {
        ...get().nextCursor,
        [activeTab]: newCursor || null,
      },
      isLoading: false,
      isLoadingMore: false,
      isRefreshing: false,
      isFetchingFeed: false,
      error: null,
      lastFetchTime: {
        ...get().lastFetchTime,
        [activeTab]: Date.now(),
      }
    });

    const user = useAuthStore.getState().user;
    if (user) {
      const allPosts = [...(get().posts.recent || []), ...(get().posts.trending || [])];
      const deduped = deduplicatePosts(allPosts);
      const myPosts = deduped.filter((p: Post) => p.anonymousName === user.anonymousName);
      const totalLikes = myPosts.reduce((sum: number, p: Post) => sum + p.likesCount, 0);
      const { lastViewedLikesCount } = get();
      
      if (lastViewedLikesCount === 0) {
        set({ lastViewedLikesCount: totalLikes, unreadLikesCount: 0 });
      } else if (totalLikes > lastViewedLikesCount) {
        set({ unreadLikesCount: totalLikes - lastViewedLikesCount });
      } else {
        set({ lastViewedLikesCount: totalLikes, unreadLikesCount: 0 });
      }
    }
  } catch (error: any) {
    const isNetworkError = !error.response || error.message === 'Network Error' || error.code === 'ERR_NETWORK';
    console.warn('[feedActions] fetchFeed failed.', isNetworkError, error);

    set({
      isLoading: false,
      isLoadingMore: false,
      isRefreshing: false,
      isFetchingFeed: false,
    });

    const hasCache = (get().posts[activeTab] || []).length > 0;
    const errMsg = error.response?.data?.message || i18n.t('feed.connection_failed');

    if (hasCache) {
      set({ error: null });
      useToastStore.getState().show(errMsg);
    } else {
      set({ error: errMsg });
    }
  }
};

export const createPostAction = async (set: any, get: any, content: string) => {
  set({ isLoading: true, error: null });
  try {
    const response = await api.post('/posts', { content });
    const newPost: Post = {
      ...response.data,
      likesCount: 0,
      isLiked: false,
    };
    const { activeTab } = get();
    set((state: any) => ({
      posts: {
        ...state.posts,
        [activeTab]: [newPost, ...(state.posts[activeTab] || [])].slice(0, MAX_POSTS_PER_TAB),
      },
      isLoading: false,
    }));
  } catch (error: any) {
    const errMsg = error.response?.data?.message || i18n.t('feed.publish_failed');
    set({ isLoading: false, error: errMsg });
    throw error;
  }
};

const likeDebounceTimers = new Map<string, ReturnType<typeof setTimeout>>();
const likeOriginalStates = new Map<string, { isLiked: boolean; likesCount: number }>();

export const toggleLikeAction = async (set: any, get: any, postId: string) => {
  const { posts } = get();
  
  if (!likeOriginalStates.has(postId)) {
    const allPosts = [...(posts.recent || []), ...(posts.trending || [])];
    const post = allPosts.find((p: Post) => p.id === postId);
    if (post) {
      likeOriginalStates.set(postId, { isLiked: post.isLiked, likesCount: post.likesCount });
    }
  }

  const updatePostHelper = (post: Post) => {
    if (post.id === postId) {
      return {
        ...post,
        isLiked: !post.isLiked,
        likesCount: post.isLiked ? Math.max(0, post.likesCount - 1) : post.likesCount + 1,
      };
    }
    return post;
  };

  const mapIfContains = (arr: Post[] | undefined, fn: (p: Post) => Post) =>
    arr && arr.some((p: Post) => p.id === postId) ? arr.map(fn) : (arr || []);

  set((state: any) => ({
    posts: {
      recent: mapIfContains(state.posts.recent, updatePostHelper),
      trending: mapIfContains(state.posts.trending, updatePostHelper),
    },
    myPosts: mapIfContains(state.myPosts, updatePostHelper),
    likedPosts: mapIfContains(state.likedPosts, updatePostHelper),
  }));

  if (likeDebounceTimers.has(postId)) {
    clearTimeout(likeDebounceTimers.get(postId)!);
  }

  const timer = setTimeout(async () => {
    likeDebounceTimers.delete(postId);
    
    const currentPosts = get().posts;
    const allCurrentPosts = [...(currentPosts.recent || []), ...(currentPosts.trending || [])];
    const currentPost = allCurrentPosts.find((p: Post) => p.id === postId);
    const original = likeOriginalStates.get(postId);
    likeOriginalStates.delete(postId);
    
    if (!currentPost || !original) return;
    
    if (currentPost.isLiked === original.isLiked) {
      return;
    }
    
    try {
      const response = await api.post(`/posts/${postId}/like`);
      const { liked, likesCount } = response.data;
      
      const applyStrictUpdate = (post: Post) => {
        if (post.id === postId) {
          return { ...post, isLiked: liked, likesCount };
        }
        return post;
      };
      
      set((state: any) => {
        const newLikedPosts = (state.likedPosts || []).some((p: Post) => p.id === postId)
          ? (state.likedPosts || []).map(applyStrictUpdate)
          : (state.likedPosts || []);
        const finalLikedPosts = liked ? newLikedPosts : newLikedPosts.filter((p: Post) => p.id !== postId);
        return {
          posts: {
            recent: mapIfContains(state.posts.recent, applyStrictUpdate),
            trending: mapIfContains(state.posts.trending, applyStrictUpdate),
          },
          myPosts: mapIfContains(state.myPosts, applyStrictUpdate),
          likedPosts: finalLikedPosts,
        };
      });
    } catch (error) {
      console.log('[feedActions] Debounced like sync failed. Rolling back UI.', error);
      
      const rollbackUpdate = (post: Post) => {
        if (post.id === postId) {
          return { ...post, isLiked: original.isLiked, likesCount: original.likesCount };
        }
        return post;
      };
      
      set((state: any) => ({
        posts: {
          recent: mapIfContains(state.posts.recent, rollbackUpdate),
          trending: mapIfContains(state.posts.trending, rollbackUpdate),
        },
        myPosts: mapIfContains(state.myPosts, rollbackUpdate),
        likedPosts: original.isLiked
          ? mapIfContains(state.likedPosts, rollbackUpdate)
          : (state.likedPosts || []).filter((p: Post) => p.id !== postId),
      }));

      useToastStore.getState().show(i18n.t('feed.connection_failed'));
    }
  }, 500);

  likeDebounceTimers.set(postId, timer);
};

export const deletePostAction = async (set: any, get: any, postId: string) => {
  try {
    await api.delete(`/posts/${postId}`);
    set((state: any) => ({
      posts: {
        recent: (state.posts.recent || []).filter((p: Post) => p.id !== postId),
        trending: (state.posts.trending || []).filter((p: Post) => p.id !== postId),
      },
      myPosts: state.myPosts.filter((p: Post) => p.id !== postId),
      likedPosts: state.likedPosts.filter((p: Post) => p.id !== postId),
    }));
  } catch (error) {
    console.log('[feedActions] deletePost error:', error);
    throw error;
  }
};

export const reportPostAction = async (postId: string, reason?: string) => {
  try {
    await api.post(`/posts/${postId}/report`, { reason });
  } catch (error) {
    console.log('[feedActions] reportPost error:', error);
  }
};
