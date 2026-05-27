import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import { Post, Notification } from '../types';
import { useAuthStore } from './useAuthStore';
import { EncryptionService } from '../services/encryption';

// Safe in-memory storage fallback for environments where AsyncStorage native module is null (e.g. unbuilt Expo clients)
const memoryStorage = new Map<string, string>();

interface FeedState {
  posts: Post[];
  myPosts: Post[];
  likedPosts: Post[];
  nextCursor: string | null;
  isLoading: boolean;
  isLoadingMyPosts: boolean;
  isLoadingLikedPosts: boolean;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  isFetchingFeed: boolean;
  error: string | null;
  myPostsError: string | null;
  likedPostsError: string | null;
  unreadLikesCount: number;
  lastViewedLikesCount: number;
  notifications: Notification[];
  isLoadingNotifications: boolean;
  notificationsError: string | null;
  activeTab: 'recent' | 'trending';
  setActiveTab: (tab: 'recent' | 'trending') => void;
  fetchFeed: (reset?: boolean, silent?: boolean) => Promise<void>;
  createPost: (content: string) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  clearError: () => void;
  markLikesAsRead: () => void;
  fetchNotifications: () => Promise<void>;
  fetchMyPosts: () => Promise<void>;
  fetchLikedPosts: () => Promise<void>;
  initializeFeed: () => Promise<void>;
}

export const useFeedStore = create<FeedState>()(
  persist(
    (set, get) => ({
      posts: [],
      myPosts: [],
      likedPosts: [],
      nextCursor: null,
      isLoading: false,
      isLoadingMyPosts: false,
      isLoadingLikedPosts: false,
      isLoadingMore: false,
      isRefreshing: false,
      isFetchingFeed: false,
      error: null,
      myPostsError: null,
      likedPostsError: null,
      unreadLikesCount: 0,
      lastViewedLikesCount: 0,
      notifications: [],
      isLoadingNotifications: false,
      notificationsError: null,
      activeTab: 'recent',
      setActiveTab: (tab) => set({ activeTab: tab }),

      initializeFeed: async () => {
        // Zustand persist handles hydration automatically from AsyncStorage
        console.log('[useFeedStore] Cache restored dynamically via Zustand persist middleware.');
      },

      fetchFeed: async (reset = false, silent = false) => {
        const { nextCursor, posts, isLoading, isLoadingMore, isRefreshing, isFetchingFeed, activeTab } = get();
        
        // Allow resets (tab changes/pull-to-refresh) to bypass the 'isLoading' block so primed skeleton states don't hang
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
        const { posts, myPosts, likedPosts } = get();

        // 1. Optimistic UI update
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

        const updatedPosts = posts.map(updatePostHelper);
        const updatedMyPosts = myPosts.map(updatePostHelper);
        const updatedLikedPosts = likedPosts.map(updatePostHelper);

        set({ 
          posts: updatedPosts,
          myPosts: updatedMyPosts,
          likedPosts: updatedLikedPosts,
        });

        try {
          // 2. Persist to API
          const response = await api.post(`/posts/${postId}/like`);
          const { liked, likesCount } = response.data;

          const applyStrictUpdate = (post: Post) => {
            if (post.id === postId) {
              return {
                ...post,
                isLiked: liked,
                likesCount: likesCount,
              };
            }
            return post;
          };

          // 3. Update with strict API returned values
          set((state) => {
            const newLikedPosts = state.likedPosts.map(applyStrictUpdate);
            // If the user unliked the post, filter it out from the likedPosts list so it disappears from "Favorites"
            const finalLikedPosts = liked ? newLikedPosts : newLikedPosts.filter(p => p.id !== postId);

            return {
              posts: state.posts.map(applyStrictUpdate),
              myPosts: state.myPosts.map(applyStrictUpdate),
              likedPosts: finalLikedPosts,
            };
          });
        } catch (error) {
          console.error('Failed to toggle like on API, rolling back UI', error);
          // Rollback on error
          set({ 
            posts: previousPosts,
            myPosts: previousMyPosts,
            likedPosts: previousLikedPosts,
          });
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

      fetchMyPosts: async () => {
        set({ isLoadingMyPosts: true, myPostsError: null });
        try {
          const response = await api.get('/posts/my-posts');
          set({
            myPosts: response.data,
            isLoadingMyPosts: false,
          });
        } catch (error: any) {
          const errMsg = error.response?.data?.message || 'تعذر تحميل آثارك النشطة. يرجى المحاولة لاحقاً.';
          set({
            isLoadingMyPosts: false,
            myPostsError: errMsg,
          });
        }
      },

      fetchLikedPosts: async () => {
        set({ isLoadingLikedPosts: true, likedPostsError: null });
        try {
          const response = await api.get('/posts/liked');
          set({
            likedPosts: response.data,
            isLoadingLikedPosts: false,
          });
        } catch (error: any) {
          const errMsg = error.response?.data?.message || 'تعذر تحميل الآثار المفضلة. يرجى المحاولة لاحقاً.';
          set({
            isLoadingLikedPosts: false,
            likedPostsError: errMsg,
          });
        }
      },
    }),
    {
      name: 'athar-feed-storage',
      storage: createJSONStorage(() => ({
        getItem: async (name: string) => {
          try {
            let value: string | null = null;
            try {
              value = await AsyncStorage.getItem(name);
            } catch (storageErr) {
              value = memoryStorage.get(name) || null;
            }
            if (!value) return null;

            const trimmed = value.trim();
            // If it starts with '{', it is plaintext JSON from a previous version.
            // Return it directly so it doesn't fail decryption. It will be encrypted on the next setItem.
            if (trimmed.startsWith('{')) {
              console.log('[useFeedStore] Detected plaintext storage. Upgrading smoothly.');
              return value;
            }

            const decrypted = EncryptionService.decrypt(value);
            // Verify the decrypted content is valid JSON before handing it to Zustand to prevent SyntaxError crashes
            JSON.parse(decrypted);
            return decrypted;
          } catch (e) {
            console.error('[useFeedStore] Failed to decrypt or parse storage for name:', name, e);
            // Clear corrupted/plaintext storage to prevent startup crash loop
            try {
              await AsyncStorage.removeItem(name);
            } catch (clearErr) {
              memoryStorage.delete(name);
            }
            return null;
          }
        },
        setItem: async (name: string, value: string) => {
          try {
            const encryptedValue = EncryptionService.encrypt(value);
            try {
              await AsyncStorage.setItem(name, encryptedValue);
            } catch (storageErr) {
              memoryStorage.set(name, encryptedValue);
            }
          } catch (e) {
            console.error('[useFeedStore] Failed to encrypt or save storage for name:', name, e);
          }
        },
        removeItem: async (name: string) => {
          try {
            await AsyncStorage.removeItem(name);
          } catch (e) {
            memoryStorage.delete(name);
          }
        },
      })),
      partialize: (state) => ({
        posts: state.posts,
        unreadLikesCount: state.unreadLikesCount,
      }),
    }
  )
);
