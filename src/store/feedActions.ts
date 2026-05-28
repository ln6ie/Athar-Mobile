import { api } from '../services/api';
import { Post } from '../types';
import { useAuthStore } from './useAuthStore';

export const fetchFeedAction = async (set: any, get: any, reset = false, silent = false) => {
  const { nextCursor, posts, isLoading, isLoadingMore, isRefreshing, isFetchingFeed, activeTab } = get();
  
  if (!reset && (isLoading || isLoadingMore || isRefreshing || isFetchingFeed)) return;
  if (reset && (isRefreshing || isFetchingFeed)) return;
  if (!reset && !nextCursor) return;

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

    if (isNetworkError && get().posts.length > 0) {
      set({ error: null });
    } else {
      const errMsg = error.response?.data?.message || 'تعذر تحميل جدار الأثر. يرجى سحب الصفحة للمحاولة مجدداً.';
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

export const toggleLikeAction = async (set: any, get: any, postId: string) => {
  const { posts, myPosts, likedPosts } = get();
  const previousPosts = [...posts];
  const previousMyPosts = [...myPosts];
  const previousLikedPosts = [...likedPosts];

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

  set({ 
    posts: posts.map(updatePostHelper),
    myPosts: myPosts.map(updatePostHelper),
    likedPosts: likedPosts.map(updatePostHelper),
  });

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
        posts: state.posts.map(applyStrictUpdate),
        myPosts: state.myPosts.map(applyStrictUpdate),
        likedPosts: finalLikedPosts,
      };
    });
  } catch (error) {
    console.error('Failed to toggle like on API, rolling back UI', error);
    set({ 
      posts: previousPosts,
      myPosts: previousMyPosts,
      likedPosts: previousLikedPosts,
    });
  }
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
