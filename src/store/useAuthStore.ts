// متجر المصادقة - إدارة تسجيل الدخول والتوكن والمستخدم
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import i18n from 'i18next';
import { User } from '../types';
import { registerFcmTokenWithBackend, unregisterFcmToken, initializeNotifications } from '../services/notificationManager';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, code: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  loginWithApple: (identityToken: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
  sendOtpChangeEmail: (newEmail: string) => Promise<void>;
  confirmEmailChange: (code: string) => Promise<{ id: string; email: string; anonymousName: string }>;
  deleteAccount: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  sendOtp: async (email) => {
    console.log('[useAuthStore] sendOtp called for email:', email);
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/send-otp', { email });
      console.log('[useAuthStore] sendOtp API success response:', response.data);
      set({ isLoading: false });
    } catch (error: any) {
      console.error('[useAuthStore] sendOtp API error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      const errMsg = error.response?.data?.message || i18n.t('auth.send_code_failed');
      set({ isLoading: false, error: errMsg });
      throw error;
    }
  },

  verifyOtp: async (email, code) => {
    console.log('[useAuthStore] تم استدعاء التحقق للبريد:', email, 'الرمز:', code);
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/verify-otp', { email, code });
      console.log('[useAuthStore] نجاح التحقق من API:', response.data);
      const { accessToken, user } = response.data;

      // حفظ التوكن بشكل آمن
      await SecureStore.setItemAsync('athar_jwt_token', accessToken);
      await AsyncStorage.setItem('athar_user_data', JSON.stringify(user));

      set({
        token: accessToken,
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      // Register FCM push notification token safely
      initializeNotifications()
        .then((token) => {
          if (token) registerFcmTokenWithBackend().catch(() => {});
        })
        .catch((err) => console.error('[useAuthStore] FCM registration failed', err));
    } catch (error: any) {
      console.error('[useAuthStore] خطأ في التحقق من API:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      const errMsg = error.response?.data?.message || i18n.t('auth.verify_failed');
      set({ isLoading: false, error: errMsg });
      throw error;
    }
  },

  loginWithGoogle: async (idToken) => {
    console.log('[useAuthStore] loginWithGoogle called');
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/google', { idToken });
      console.log('[useAuthStore] Google Login success:', response.data);
      const { accessToken, user } = response.data;

      // Save token securely
      await SecureStore.setItemAsync('athar_jwt_token', accessToken);
      await AsyncStorage.setItem('athar_user_data', JSON.stringify(user));

      set({
        token: accessToken,
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      initializeNotifications()
        .then((token) => {
          if (token) registerFcmTokenWithBackend().catch(() => {});
        })
        .catch(() => {});
    } catch (error: any) {
      console.error('[useAuthStore] Google login error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      const errMsg = error.response?.data?.message || i18n.t('auth.login_failed');
      set({ isLoading: false, error: errMsg });
      throw error;
    }
  },

  loginWithApple: async (identityToken) => {
    console.log('[useAuthStore] loginWithApple called');
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/apple', { identityToken });
      console.log('[useAuthStore] Apple Login success:', response.data);
      const { accessToken, user } = response.data;

      // Save token securely
      await SecureStore.setItemAsync('athar_jwt_token', accessToken);
      await AsyncStorage.setItem('athar_user_data', JSON.stringify(user));

      set({
        token: accessToken,
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      initializeNotifications()
        .then((token) => {
          if (token) registerFcmTokenWithBackend().catch(() => {});
        })
        .catch(() => {});
    } catch (error: any) {
      console.error('[useAuthStore] Apple login error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      const errMsg = error.response?.data?.message || i18n.t('auth.login_failed');
      set({ isLoading: false, error: errMsg });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await unregisterFcmToken();
      await SecureStore.deleteItemAsync('athar_jwt_token');
      await AsyncStorage.removeItem('athar_user_data');

      const { useFeedStore } = require('./useFeedStore');
      useFeedStore.persist.clearStorage();
      useFeedStore.setState({
        posts: { recent: [], trending: [] },
        myPosts: [],
        likedPosts: [],
        blockedUsers: [],
        nextCursor: { recent: null, trending: null },
        lastFetchTime: { recent: 0, trending: 0 },
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
        reports: [],
        isLoadingReports: false,
        reportsError: null,
        activeTab: 'recent',
        isPostModalOpen: false,
      });
    } catch (error) {
      console.error('فشل مسح البيانات من التخزين', error);
    }
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  initialize: async () => {
    console.log('[useAuthStore] Initializing auth session...');
    try {
      const token = await SecureStore.getItemAsync('athar_jwt_token');
      const userDataStr = await AsyncStorage.getItem('athar_user_data');

      if (token && userDataStr) {
        console.log('[useAuthStore] Session found in secure store. Authenticating...');
        set({
          token,
          user: JSON.parse(userDataStr),
          isAuthenticated: true,
        });
      } else {
        console.log('[useAuthStore] No session found.');
      }
    } catch (error) {
      console.error('[useAuthStore] Failed to initialize session from storage', error);
    } finally {
      console.log('[useAuthStore] Initialization complete.');
      set({ isInitialized: true });
    }
  },

  clearError: () => set({ error: null }),

  sendOtpChangeEmail: async (newEmail) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/send-otp-change-email', { email: newEmail });
      set({ isLoading: false });
    } catch (error: any) {
      const errMsg = error.response?.data?.message || i18n.t('change_email.save_failed');
      set({ isLoading: false, error: errMsg });
      throw error;
    }
  },

  confirmEmailChange: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/confirm-email-change', { code });
      const updatedUser = response.data;

      await AsyncStorage.setItem('athar_user_data', JSON.stringify(updatedUser));

      set({
        user: updatedUser,
        isLoading: false,
      });

      return updatedUser;
    } catch (error: any) {
      const errMsg = error.response?.data?.message || i18n.t('change_email.save_failed');
      set({ isLoading: false, error: errMsg });
      throw error;
    }
  },

  deleteAccount: async () => {
    set({ isLoading: true, error: null });
    try {
      await api.delete('/auth/delete-account');

      // مسح التخزين وتسجيل الخروج
      await SecureStore.deleteItemAsync('athar_jwt_token');
      await AsyncStorage.removeItem('athar_user_data');

      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errMsg = error.response?.data?.message || i18n.t('profile.delete_failed');
      set({ isLoading: false, error: errMsg });
      throw error;
    }
  },
}));
