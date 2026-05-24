import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import { Post, Notification } from '../types';
import { useAuthStore } from './useAuthStore';

interface FeedState {
  posts: Post[];
  nextCursor: string | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  isFetchingFeed: boolean;
  error: string | null;
  unreadLikesCount: number;
  lastViewedLikesCount: number;
  notifications: Notification[];
  isLoadingNotifications: boolean;
  notificationsError: string | null;
  fetchFeed: (reset?: boolean, silent?: boolean) => Promise<void>;
  createPost: (content: string) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  clearError: () => void;
  markLikesAsRead: () => void;
  fetchNotifications: () => Promise<void>;
  initializeFeed: () => Promise<void>;
}

export const useFeedStore = create<FeedState>()(
  persist(
    (set, get) => ({
      posts: [],
      nextCursor: null,
      isLoading: false,
      isLoadingMore: false,
      isRefreshing: false,
      isFetchingFeed: false,
      error: null,
      unreadLikesCount: 0,
      lastViewedLikesCount: 0,
      notifications: [],
      isLoadingNotifications: false,
      notificationsError: null,

      initializeFeed: async () => {
        // Zustand persist handles hydration automatically from AsyncStorage
        console.log('[useFeedStore] Cache restored dynamically via Zustand persist middleware.');
      },

      fetchFeed: async (reset = false, silent = false) => {
        const { nextCursor, posts, isLoading, isLoadingMore, isRefreshing, isFetchingFeed } = get();
        if (isLoading || isLoadingMore || isRefreshing || isFetchingFeed) return;
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
          const cursorParam = reset ? '' : (nextCursor ? `?cursor=${nextCursor}` : '');
          const response = await api.get(`/posts/feed${cursorParam}`);
          const { posts: newPosts, nextCursor: newCursor } = response.data;

          const mergedPosts = reset ? newPosts : [...posts, ...newPosts];
          const uniquePosts = mergedPosts.filter(
            (post: Post, index: number, self: Post[]) => self.findIndex((p: Post) => p.id === post.id) === index
          );

          set({
            posts: uniquePosts,
            nextCursor: newCursor || null,
            isLoading: false,
            isLoadingMore: false,
            isRefreshing: false,
            isFetchingFeed: false,
          });

          // Calculate unread likes notification dynamically
          const user = useAuthStore.getState().user;
          if (user) {
            const myPosts = uniquePosts.filter((p: Post) => p.anonymousName === user.anonymousName);
            const totalLikes = myPosts.reduce((sum: number, p: Post) => sum + p.likesCount, 0);
            const { lastViewedLikesCount } = get();
            
            if (lastViewedLikesCount === 0) {
              // Initialize viewed count on first successful fetch
              set({ lastViewedLikesCount: totalLikes, unreadLikesCount: 0 });
            } else if (totalLikes > lastViewedLikesCount) {
              set({ unreadLikesCount: totalLikes - lastViewedLikesCount });
            } else {
              // Align viewed count to prevent negative values
              set({ lastViewedLikesCount: totalLikes, unreadLikesCount: 0 });
            }
          }
        } catch (error: any) {
          const errMsg = error.response?.data?.message || 'تعذر تحميل جدار الأثر. يرجى سحب الصفحة للمحاولة مجدداً.';
          if (silent) {
            console.error('[useFeedStore] Silent fetch failed', error);
            set({ isFetchingFeed: false });
          } else {
            set({
              isLoading: false,
              isLoadingMore: false,
              isRefreshing: false,
              isFetchingFeed: false,
              error: errMsg,
            });
          }
        }
      },

      createPost: async (content) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/posts', { content });
          const newPost: Post = {
            ...response.data,
            likesCount: 0,
            isLiked: false,
          };

          // Instantly prepend new trace into state feed
          set((state) => ({
            posts: [newPost, ...state.posts],
            isLoading: false,
          }));
        } catch (error: any) {
          const errMsg = error.response?.data?.message || 'فشل ترك أثرك. يرجى المحاولة لاحقاً.';
          set({ isLoading: false, error: errMsg });
          throw error;
        }
      },

      toggleLike: async (postId) => {
        const { posts } = get();

        // 1. Optimistic UI update
        const previousPosts = [...posts];
        const updatedPosts = posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              isLiked: !post.isLiked,
              likesCount: post.isLiked ? Math.max(0, post.likesCount - 1) : post.likesCount + 1,
            };
          }
          return post;
        });

        set({ posts: updatedPosts });

        try {
          // 2. Persist to API
          const response = await api.post(`/posts/${postId}/like`);
          const { liked, likesCount } = response.data;

          // 3. Update with strict API returned values
          set((state) => ({
            posts: state.posts.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  isLiked: liked,
                  likesCount: likesCount,
                };
              }
              return post;
            }),
          }));
        } catch (error) {
          console.error('Failed to toggle like on API, rolling back UI', error);
          // Rollback on error
          set({ posts: previousPosts });
        }
      },

      clearError: () => set({ error: null }),

      markLikesAsRead: () => {
        const user = useAuthStore.getState().user;
        if (user) {
          const { posts } = get();
          const myPosts = posts.filter((p: Post) => p.anonymousName === user.anonymousName);
          const totalLikes = myPosts.reduce((sum: number, p: Post) => sum + p.likesCount, 0);
          set({ 
            lastViewedLikesCount: totalLikes,
            unreadLikesCount: 0 
          });
        }
      },

      fetchNotifications: async () => {
        set({ isLoadingNotifications: true, notificationsError: null });
        try {
          const response = await api.get('/posts/notifications');
          set({
            notifications: response.data,
            isLoadingNotifications: false,
            unreadLikesCount: 0,
          });

          // Align viewed count as well
          const user = useAuthStore.getState().user;
          if (user) {
            const { posts } = get();
            const myPosts = posts.filter((p: Post) => p.anonymousName === user.anonymousName);
            const totalLikes = myPosts.reduce((sum: number, p: Post) => sum + p.likesCount, 0);
            set({ lastViewedLikesCount: totalLikes });
          }
        } catch (error: any) {
          const errMsg = error.response?.data?.message || 'تعذر تحميل التنبيهات. يرجى المحاولة لاحقاً.';
          set({
            isLoadingNotifications: false,
            notificationsError: errMsg,
          });
        }
      },
    }),
    {
      name: 'athar-feed-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        posts: state.posts,
      }),
    }
  )
);

