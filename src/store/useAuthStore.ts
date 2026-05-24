import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { api } from '../services/api';
import { User } from '../types';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
  changeEmail: (newEmail: string) => Promise<void>;
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
      const errMsg = error.response?.data?.message || 'تعذر إرسال رمز التحقق. يرجى المحاولة لاحقاً.';
      set({ isLoading: false, error: errMsg });
      throw error;
    }
  },

  verifyOtp: async (email, code) => {
    console.log('[useAuthStore] verifyOtp called for email:', email, 'code:', code);
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/verify-otp', { email, code });
      console.log('[useAuthStore] verifyOtp API success response:', response.data);
      const { accessToken, user } = response.data;

      // Save token securely
      await SecureStore.setItemAsync('athar_jwt_token', accessToken);
      await SecureStore.setItemAsync('athar_user_data', JSON.stringify(user));

      set({
        token: accessToken,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      console.error('[useAuthStore] verifyOtp API error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      const errMsg = error.response?.data?.message || 'رمز التحقق غير صحيح. يرجى إعادة المحاولة.';
      set({ isLoading: false, error: errMsg });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await SecureStore.deleteItemAsync('athar_jwt_token');
      await SecureStore.deleteItemAsync('athar_user_data');
    } catch (error) {
      console.error('Failed to clear credentials from storage', error);
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
      const userDataStr = await SecureStore.getItemAsync('athar_user_data');

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

  changeEmail: async (newEmail) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/change-email', { email: newEmail });
      const updatedUser = response.data;
      
      // Save updated user data
      await SecureStore.setItemAsync('athar_user_data', JSON.stringify(updatedUser));
      
      set({
        user: updatedUser,
        isLoading: false,
      });
    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'تعذر تغيير البريد الإلكتروني. يرجى المحاولة لاحقاً.';
      set({ isLoading: false, error: errMsg });
      throw error;
    }
  },

  deleteAccount: async () => {
    set({ isLoading: true, error: null });
    try {
      await api.delete('/auth/delete-account');
      
      // Clear storage and logout
      await SecureStore.deleteItemAsync('athar_jwt_token');
      await SecureStore.deleteItemAsync('athar_user_data');
      
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'تعذر حذف الحساب. يرجى المحاولة لاحقاً.';
      set({ isLoading: false, error: errMsg });
      throw error;
    }
  },
}));
