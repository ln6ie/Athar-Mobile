import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';
import { EncryptionService } from '../services/encryption';

const memoryStorage = new Map<string, string>();

export const feedPersistConfig = {
  name: 'athar-feed-storage',
  version: 1,
  migrate: (persistedState: any, version: number) => {
    if (version === 0) {
      if (Array.isArray(persistedState.posts)) {
        persistedState.posts = { recent: persistedState.posts, trending: [] };
      }
      if (typeof persistedState.nextCursor === 'string' || persistedState.nextCursor === null || persistedState.nextCursor === undefined) {
        persistedState.nextCursor = { recent: persistedState.nextCursor ?? null, trending: null };
      }
      delete persistedState.recentPosts;
      delete persistedState.trendingPosts;
      delete persistedState.recentCursor;
      delete persistedState.trendingCursor;
    }
    return persistedState;
  },
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
        // Plaintext fallback for backward compatibility
        if (trimmed.startsWith('{')) {
          console.log('[feedStorage] Detected plaintext storage. Upgrading smoothly.');
          return value;
        }

        const decrypted = EncryptionService.decrypt(value);
        JSON.parse(decrypted);
        return decrypted;
      } catch (e) {
        console.error('[feedStorage] Failed to decrypt or parse storage for name:', name, e);
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
        console.error('[feedStorage] Failed to encrypt or save storage for name:', name, e);
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
  partialize: (state: any) => ({
    posts: state.posts,
    nextCursor: state.nextCursor,
    unreadLikesCount: state.unreadLikesCount,
    blockedUsers: state.blockedUsers,
    lastFetchTime: state.lastFetchTime,
  }),
};
