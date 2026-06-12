import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';
const GATEWAY_KEY = process.env.EXPO_PUBLIC_GATEWAY_KEY || '';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

// دالة الطلبات العامة المبنية على Fetch
async function request(path: string, options: FetchOptions = {}) {
  const url = `${API_BASE_URL}${path}`;
  const headers = new Headers(options.headers || {});
  const method = options.method || 'GET';
  
  if (['POST', 'PUT', 'PATCH'].includes(method) && options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const token = await SecureStore.getItemAsync('athar_jwt_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  } catch (error) {
    console.error('فشل استرجاع التوكن من التخزين الآمن', error);
  }

  if (GATEWAY_KEY) {
    headers.set('x-athar-gateway-key', GATEWAY_KEY);
  }

  const timeout = options.timeout || 10000;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(id);

    if (response.status === 403) {
      try {
        const { useToastStore } = require('../store/useToastStore');
        useToastStore.getState().show('يرجى تحديث التطبيق إلى أحدث إصدار للمتابعة');
      } catch (e) {
        console.error('فشل عرض رسالة التحديث', e);
      }
    }

    if (response.status === 401) {
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || 'طلب غير صالح');
      (error as any).response = { status: response.status, data: errorData };
      throw error;
    }

    const data = await response.json().catch(() => ({}));
    return { data, status: response.status };
  } catch (error: any) {
    clearTimeout(id);
    throw error;
  }
}

export const api = {
  get: (path: string, options?: FetchOptions) => request(path, { ...options, method: 'GET' }),
  post: (path: string, data: any = {}, options?: FetchOptions) => request(path, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (path: string, data: any = {}, options?: FetchOptions) => request(path, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  patch: (path: string, data: any = {}, options?: FetchOptions) => request(path, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (path: string, options?: FetchOptions) => request(path, { ...options, method: 'DELETE' }),
};
