import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Post, Notification } from '../types';
import { useAuthStore } from './useAuthStore';
import { feedPersistConfig } from './feedStorage';
import {
  fetchFeedAction,
  createPostAction,
  toggleLikeAction,
  deletePostAction,
  reportPostAction,
} from './feedActions';
import {
  fetchNotificationsAction,
  fetchMyPostsAction,
  fetchLikedPostsAction,
  blockUserAction,
  unblockUserAction,
} from './userActions';

interface FeedState {
  posts: Post[];
  myPosts: Post[];
  likedPosts: Post[];
  blockedUsers: string[];
  nextCursor: string | null;
  recentPosts: Post[];
  trendingPosts: Post[];
  recentCursor: string | null;
  trendingCursor: string | null;
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
  blockUser: (anonymousName: string) => Promise<void>;
  unblockUser: (anonymousName: string) => Promise<void>;
  reportPost: (postId: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  initializeFeed: () => Promise<void>;
}

export const useFeedStore = create<FeedState>()(
  persist(
    (set, get) => ({
      posts: [],
      myPosts: [],
      likedPosts: [],
      blockedUsers: [],
      nextCursor: null,
      recentPosts: [],
      trendingPosts: [],
      recentCursor: null,
      trendingCursor: null,
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
      
      setActiveTab: (tab) => {
        const { posts, nextCursor, activeTab, recentPosts, recentCursor, trendingPosts, trendingCursor } = get();
        
        // 1. Save current active tab's posts and cursor to cache
        const cacheSave = activeTab === 'recent'
          ? { recentPosts: posts, recentCursor: nextCursor }
          : { trendingPosts: posts, trendingCursor: nextCursor };
        
        // 2. Load target tab's posts and cursor from cache
        const targetLoad = tab === 'recent'
          ? { posts: recentPosts, nextCursor: recentCursor }
          : { posts: trendingPosts, nextCursor: trendingCursor };

        set({
          activeTab: tab,
          ...cacheSave,
          ...targetLoad,
        });
      },

      initializeFeed: async () => {
        console.log('[useFeedStore] Offline cache restored successfully via Zustand persist.');
      },

      fetchFeed: async (reset = false, silent = false) => {
        await fetchFeedAction(set, get, reset, silent);
      },

      createPost: async (content) => {
        await createPostAction(set, get, content);
      },

      toggleLike: async (postId) => {
        await toggleLikeAction(set, get, postId);
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
        await fetchNotificationsAction(set, get);
      },

      fetchMyPosts: async () => {
        await fetchMyPostsAction(set);
      },

      fetchLikedPosts: async () => {
        await fetchLikedPostsAction(set);
      },

      blockUser: async (anonymousName) => {
        await blockUserAction(set, get, anonymousName);
      },

      unblockUser: async (anonymousName) => {
        await unblockUserAction(set, get, anonymousName);
      },

      reportPost: async (postId) => {
        await reportPostAction(postId);
      },

      deletePost: async (postId) => {
        await deletePostAction(set, get, postId);
      },
    }),
    feedPersistConfig as any
  )
);
