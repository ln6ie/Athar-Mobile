import { api } from '../services/api';
import { Post } from '../types';
import { useAuthStore } from './useAuthStore';
import { useToastStore } from './useToastStore';

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

    const mergedPosts = reset ? newPosts : [...currentTabPosts, ...newPosts];
    const { blockedUsers } = get();
    const uniquePosts = mergedPosts
      .filter((post: Post, index: number, self: Post[]) => self.findIndex((p: Post) => p.id === post.id) === index)
      .filter((post: Post) => !blockedUsers.includes(post.anonymousName));

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
      const deduped = allPosts.filter((p: Post, i: number, self: Post[]) => self.findIndex((x: Post) => x.id === p.id) === i);
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
    const errMsg = error.response?.data?.message || 'عذراً، تعذر الاتصال بالخادم حالياً. يرجى المحاولة لاحقاً';

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
        [activeTab]: [newPost, ...(state.posts[activeTab] || [])],
      },
      isLoading: false,
    }));
  } catch (error: any) {
    const errMsg = error.response?.data?.message || 'فشل ترك أثرك. يرجى المحاولة لاحقاً.';
    set({ isLoading: false, error: errMsg });
    throw error;
  }
};

const likeDebounceTimers = new Map<string, NodeJS.Timeout>();
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

  set((state: any) => ({ 
    posts: {
      recent: (state.posts.recent || []).map(updatePostHelper),
      trending: (state.posts.trending || []).map(updatePostHelper),
    },
    myPosts: state.myPosts.map(updatePostHelper),
    likedPosts: state.likedPosts.map(updatePostHelper),
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
        const newLikedPosts = state.likedPosts.map(applyStrictUpdate);
        const finalLikedPosts = liked ? newLikedPosts : newLikedPosts.filter((p: Post) => p.id !== postId);
        return {
          posts: {
            recent: (state.posts.recent || []).map(applyStrictUpdate),
            trending: (state.posts.trending || []).map(applyStrictUpdate),
          },
          myPosts: state.myPosts.map(applyStrictUpdate),
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
          recent: (state.posts.recent || []).map(rollbackUpdate),
          trending: (state.posts.trending || []).map(rollbackUpdate),
        },
        myPosts: state.myPosts.map(rollbackUpdate),
        likedPosts: original.isLiked 
          ? state.likedPosts.map(rollbackUpdate)
          : state.likedPosts.filter((p: Post) => p.id !== postId),
      }));

      useToastStore.getState().show('عذراً، تعذر الاتصال بالخادم حالياً. يرجى المحاولة لاحقاً');
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

export const reportPostAction = async (postId: string) => {
  try {
    await api.post(`/posts/${postId}/report`);
  } catch (error) {
    console.log('[feedActions] reportPost error:', error);
  }
};
