// إجراءات المستخدم - الإشعارات والمنشورات الشخصية والمحظورين
import { api } from '../services/api';
import { Post } from '../types';
import { useAuthStore } from './useAuthStore';
import i18n from 'i18next';

export const fetchNotificationsAction = async (set: any, get: any) => {
  set({ isLoadingNotifications: true, notificationsError: null });
  try {
    const response = await api.get('/posts/notifications?limit=50');
    set({
      notifications: response.data,
      isLoadingNotifications: false,
      unreadLikesCount: 0,
    });

    const user = useAuthStore.getState().user;
    if (user) {
      const { posts } = get();
      const allPosts = [...(posts.recent || []), ...(posts.trending || [])];
      const seen = new Map<string, boolean>();
      const deduped = allPosts.filter((p: Post) => {
        if (seen.has(p.id)) return false;
        seen.set(p.id, true);
        return true;
      });
      const myPosts = deduped.filter((p: Post) => p.anonymousName === user.anonymousName);
      const totalLikes = myPosts.reduce((sum: number, p: Post) => sum + p.likesCount, 0);
      set({ lastViewedLikesCount: totalLikes });
    }
  } catch (error: any) {
    const errMsg = error.response?.data?.message || i18n.t('notifications.loading');
    set({
      isLoadingNotifications: false,
      notificationsError: errMsg,
    });
  }
};

export const fetchMyPostsAction = async (set: any) => {
  set({ isLoadingMyPosts: true, myPostsError: null });
  try {
    const response = await api.get('/posts/my-posts?limit=50');
    set({
      myPosts: response.data,
      isLoadingMyPosts: false,
    });
  } catch (error: any) {
    const errMsg = error.response?.data?.message || i18n.t('fetch_failed');
    set({
      isLoadingMyPosts: false,
      myPostsError: errMsg,
    });
  }
};

export const fetchLikedPostsAction = async (set: any) => {
  set({ isLoadingLikedPosts: true, likedPostsError: null });
  try {
    const response = await api.get('/posts/liked?limit=50');
    set({
      likedPosts: response.data,
      isLoadingLikedPosts: false,
    });
  } catch (error: any) {
    const errMsg = error.response?.data?.message || i18n.t('fetch_failed');
    set({
      isLoadingLikedPosts: false,
      likedPostsError: errMsg,
    });
  }
};

export const blockUserAction = async (set: any, get: any, anonymousName: string) => {
  const { blockedUsers, posts, myPosts, likedPosts } = get();
  if (blockedUsers.includes(anonymousName)) return;

  set({
    blockedUsers: [...blockedUsers, anonymousName],
    posts: {
      recent: (posts.recent || []).filter((p: Post) => p.anonymousName !== anonymousName),
      trending: (posts.trending || []).filter((p: Post) => p.anonymousName !== anonymousName),
    },
    myPosts: myPosts.filter((p: Post) => p.anonymousName !== anonymousName),
    likedPosts: likedPosts.filter((p: Post) => p.anonymousName !== anonymousName),
  });
};

export const unblockUserAction = async (set: any, get: any, anonymousName: string) => {
  const { blockedUsers } = get();
  set({
    blockedUsers: blockedUsers.filter((name: string) => name !== anonymousName),
  });
};

export const fetchMyReportsAction = async (set: any, get: any) => {
  const { reports } = get() || { reports: [] };
  const hasReports = reports && reports.length > 0;

  // إذا كانت البلاغات موجودة في الذاكرة، تحديث صامت في الخلفية
  if (!hasReports) {
    set({ isLoadingReports: true, reportsError: null });
  } else {
    set({ reportsError: null }); // إبقاء البلاغات الحالية مرئية فوراً
  }

  try {
    const response = await api.get('/reports/my?limit=50');
    set({
      reports: response.data,
      isLoadingReports: false,
    });
  } catch (error: any) {
    const errMsg = error.response?.data?.message || i18n.t('fetch_failed');
    set({
      isLoadingReports: false,
      reportsError: errMsg,
    });
  }
};
