import { api } from '../services/api';
import { Post } from '../types';
import { useAuthStore } from './useAuthStore';
import { useToastStore } from './useToastStore';

export const fetchFeedAction = async (set: any, get: any, reset = false, silent = false) => {
  const { nextCursor, posts, isLoading, isLoadingMore, isRefreshing, isFetchingFeed, activeTab, lastFetchTime } = get();
  
  if (!reset && (isLoading || isLoadingMore || isRefreshing || isFetchingFeed)) return;
  if (reset && (isRefreshing || isFetchingFeed)) return;
  if (!reset && !nextCursor) return;

  // FETCH THROTTLING SPAM SHIELD:
  // If this is a category swap / app init (reset = true AND silent = true)
  // AND we already have cached posts for this category,
  // AND the time elapsed since the last successful fetch is less than 30 seconds (30000ms):
  // We completely abort the network fetch and rely on cached posts (Cache-First).
  // This is only bypassed if the user triggers a manual pull-to-refresh (reset = true AND silent = false) or paginates.
  const now = Date.now();
  const lastFetched = lastFetchTime?.[activeTab] || 0;
  const timeElapsed = now - lastFetched;

  if (reset && silent && posts.length > 0 && timeElapsed < 30000) {
    return;
  }

  set({ isFetchingFeed: true });

  if (silent) {
    set({ error: null });
  } else if (reset) {
    set({ isRefreshing: true, error: null });
  } else if (posts.length > 0) {
    set({ isLoadingMore: true, error: null });
  } else {
    set({ isLoading: true, error: null });
  }

  try {
    const cursorParam = reset ? '' : (nextCursor ? `&cursor=${nextCursor}` : '');
    const response = await api.get(`/posts/feed?sort=${activeTab}${cursorParam}`);
    const { posts: newPosts, nextCursor: newCursor } = response.data;

    const mergedPosts = reset ? newPosts : [...posts, ...newPosts];
    const { blockedUsers } = get();
    const uniquePosts = mergedPosts
      .filter((post: Post, index: number, self: Post[]) => self.findIndex((p: Post) => p.id === post.id) === index)
      .filter((post: Post) => !blockedUsers.includes(post.anonymousName));

    set({
      posts: uniquePosts,
      nextCursor: newCursor || null,
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
      const myPosts = uniquePosts.filter((p: Post) => p.anonymousName === user.anonymousName);
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

    const hasCache = get().posts.length > 0;
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
    set((state: any) => ({
      posts: [newPost, ...state.posts],
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
  
  // 1. Capture the original stable server state before any rapid clicking started
  if (!likeOriginalStates.has(postId)) {
    const post = posts.find((p: Post) => p.id === postId);
    if (post) {
      likeOriginalStates.set(postId, { isLiked: post.isLiked, likesCount: post.likesCount });
    }
  }

  // Helper function to calculate optimistic UI toggle
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

  // 2. Perform absolute instantaneous Optimistic UI Update for maximum user fluid responsiveness
  set((state: any) => ({ 
    posts: state.posts.map(updatePostHelper),
    myPosts: state.myPosts.map(updatePostHelper),
    likedPosts: state.likedPosts.map(updatePostHelper),
  }));

  // 3. Clear any active pending timers to throttle rapid clicks
  if (likeDebounceTimers.has(postId)) {
    clearTimeout(likeDebounceTimers.get(postId)!);
  }

  // 4. Set debounced sync trigger (500ms) to bundle all clicks into one final state sync call
  const timer = setTimeout(async () => {
    likeDebounceTimers.delete(postId);
    
    const currentPost = get().posts.find((p: Post) => p.id === postId);
    const original = likeOriginalStates.get(postId);
    likeOriginalStates.delete(postId); // Clean up original state reference
    
    if (!currentPost || !original) return;
    
    // SPAM SHIELD: If final state matches the original server state (even number of rapid clicks),
    // then net change is exactly 0. Abort network call entirely to save bandwidth & prevent 429s!
    if (currentPost.isLiked === original.isLiked) {
      return;
    }
    
    try {
      // Synchronize with the server
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
          posts: state.posts.map(applyStrictUpdate),
          myPosts: state.myPosts.map(applyStrictUpdate),
          likedPosts: finalLikedPosts,
        };
      });
    } catch (error) {
      console.error('[feedActions] Debounced like sync failed. Rolling back UI.', error);
      
      // Roll back UI to original server state
      const rollbackUpdate = (post: Post) => {
        if (post.id === postId) {
          return { ...post, isLiked: original.isLiked, likesCount: original.likesCount };
        }
        return post;
      };
      
      set((state: any) => ({
        posts: state.posts.map(rollbackUpdate),
        myPosts: state.myPosts.map(rollbackUpdate),
        likedPosts: original.isLiked 
          ? state.likedPosts.map(rollbackUpdate)
          : state.likedPosts.filter((p: Post) => p.id !== postId),
      }));

      // Display our beautiful non-intrusive bottom global Snackbar
      useToastStore.getState().show('عذراً، تعذر الاتصال بالخادم حالياً. يرجى المحاولة لاحقاً');
    }
  }, 500);

  likeDebounceTimers.set(postId, timer);
};

export const deletePostAction = async (set: any, get: any, postId: string) => {
  try {
    await api.delete(`/posts/${postId}`);
    set((state: any) => ({
      posts: state.posts.filter((p: Post) => p.id !== postId),
      myPosts: state.myPosts.filter((p: Post) => p.id !== postId),
      likedPosts: state.likedPosts.filter((p: Post) => p.id !== postId),
    }));
  } catch (error) {
    console.error('[feedActions] deletePost error:', error);
    throw error;
  }
};

export const reportPostAction = async (postId: string) => {
  try {
    await api.post(`/posts/${postId}/report`);
  } catch (error) {
    console.error('[feedActions] reportPost error:', error);
  }
};
