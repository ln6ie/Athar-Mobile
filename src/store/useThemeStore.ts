// متجر المظهر - تبديل بين الوضع الداكن والفاتح والتلقائي
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeState {
  themeMode: ThemeMode;
  isInitialized: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  initializeTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  themeMode: 'system',
  isInitialized: false,

  setThemeMode: async (mode: ThemeMode) => {
    try {
      await SecureStore.setItemAsync('athar_theme_mode', mode);
    } catch (err) {
      console.error('[useThemeStore] Failed to save theme mode', err);
    }
    set({ themeMode: mode });
  },

  initializeTheme: async () => {
    try {
      const savedMode = await SecureStore.getItemAsync('athar_theme_mode');
      if (savedMode) {
        set({ themeMode: savedMode as ThemeMode, isInitialized: true });
      } else {
        set({ themeMode: 'system', isInitialized: true });
      }
    } catch (err) {
      console.error('[useThemeStore] Failed to load theme mode', err);
      set({ themeMode: 'system', isInitialized: true });
    }
  },
}));
