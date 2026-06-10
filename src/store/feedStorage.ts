// إعدادات تخزين الخلاصة المحلي - تشفير وحد أقصى للمنشورات
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

// حد أقصى للمنشورات المحفوظة - تجنب استنزاف الذاكرة عند التشغيل
const MAX_PERSISTED_POSTS = 25;

/**
 * Smart storage cleaner: removes stale keys from previous versions
 * that may have stored encrypted blobs or large data sets.
 */
export const cleanLegacyStorage = async (): Promise<void> => {
  try {
    const legacyKeys = ['athar-feed-storage'];
    const allKeys = await AsyncStorage.getAllKeys();

    // مسح المفاتيح ذات البيانات الأكبر من 512KB
    const keysToInspect = allKeys.filter((k) => legacyKeys.includes(k));
    for (const key of keysToInspect) {
      try {
        const raw = await AsyncStorage.getItem(key);
        if (!raw) continue;

        // إذا كان مشفراً (غير JSON) أو كبيراً جداً، امسحه
        const trimmed = raw.trim();
        const isEncrypted = !trimmed.startsWith('{');
        const isOversized = raw.length > 512 * 1024; // 512 كيلوبايت

        if (isEncrypted || isOversized) {
          await AsyncStorage.removeItem(key);
          console.log('[feedStorage] Wiped legacy/oversized storage key:', key);
          return;
        }

        // التحقق من عدم تطابق الإصدار
        const parsed = JSON.parse(raw);
        if (parsed?.version !== 2) {
          await AsyncStorage.removeItem(key);
          console.log('[feedStorage] Wiped outdated storage version for key:', key);
        }
      } catch {
        await AsyncStorage.removeItem(key).catch(() => null);
      }
    }
  } catch (e) {
    console.warn('[feedStorage] cleanLegacyStorage failed silently:', e);
  }
};

export const feedPersistConfig = {
  name: 'athar-feed-storage',
  version: 2,
  migrate: (persistedState: any, version: number) => {
    // أي إصدار سابق يُمسح ويبدأ من حالة نظيفة
    if (version < 2) {
      console.log('[feedStorage] Migration: wiping state from version', version);
      return {
        posts: { recent: [], trending: [] },
        nextCursor: { recent: null, trending: null },
        blockedUsers: [],
        unreadLikesCount: 0,
        lastFetchTime: { recent: 0, trending: 0 },
        reports: [],
      };
    }
    return persistedState;
  },
  storage: createJSONStorage(() => AsyncStorage),
  partialize: (state: any) => ({
    // حفظ آخر N منشور فقط لكل تبويب
    posts: {
      recent: (state.posts?.recent || []).slice(0, MAX_PERSISTED_POSTS),
      trending: (state.posts?.trending || []).slice(0, MAX_PERSISTED_POSTS),
    },
    nextCursor: state.nextCursor,
    blockedUsers: state.blockedUsers,
    unreadLikesCount: state.unreadLikesCount,
    lastFetchTime: state.lastFetchTime,
    // حفظ آخر 20 بلاغ فقط
    reports: (state.reports || []).slice(0, 20),
  }),
};
