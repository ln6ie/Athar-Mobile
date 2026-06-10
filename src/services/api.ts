// خدمة الاتصال بالخادم - دوال الطلبات الآمنة
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';
const GATEWAY_KEY = process.env.EXPO_PUBLIC_GATEWAY_KEY || '';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// إضافة توكن JWT و Gateway Key تلقائياً إلى رؤوس الطلبات
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('athar_jwt_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('فشل استرجاع التوكن من التخزين الآمن', error);
    }

    if (GATEWAY_KEY && config.headers) {
      config.headers['x-athar-gateway-key'] = GATEWAY_KEY;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403) {
      try {
        const { useToastStore } = require('../store/useToastStore');
        useToastStore.getState().show('يرجى تحديث التطبيق إلى أحدث إصدار للمتابعة');
      } catch (e) {
        console.error('فشل عرض رسالة التحديث', e);
      }
    }

    if (error.response?.status === 401) {
      try {
        const { useAuthStore } = require('../store/useAuthStore');
        const store = useAuthStore.getState();
        if (store.isAuthenticated) {
          await store.logout();
        }
      } catch (e) {
        console.error('فشل معالجة انتهاء الجلسة', e);
      }
    }
    return Promise.reject(error);
  }
);
