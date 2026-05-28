import { api } from '../services/api';
import { Post } from '../types';
import { useAuthStore } from './useAuthStore';

export const fetchNotificationsAction = async (set: any, get: any) => {
  set({ isLoadingNotifications: true, notificationsError: null });
  try {
    const response = await api.get('/posts/notifications');
    set({
      notifications: response.data,
      isLoadingNotifications: false,
      unreadLikesCount: 0,
    });

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
};

export const fetchMyPostsAction = async (set: any) => {
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
};

export const fetchLikedPostsAction = async (set: any) => {
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
};

export const blockUserAction = async (set: any, get: any, anonymousName: string) => {
  const { blockedUsers, posts, myPosts, likedPosts } = get();
  if (blockedUsers.includes(anonymousName)) return;

  set({
    blockedUsers: [...blockedUsers, anonymousName],
    posts: posts.filter((p: Post) => p.anonymousName !== anonymousName),
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
