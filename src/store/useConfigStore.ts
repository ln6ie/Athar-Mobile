import { create } from 'zustand';
import { Platform } from 'react-native';
import * as Application from 'expo-application';
import Constants from 'expo-constants';
import { api } from '../services/api';

interface ConfigState {
  isUpdateRequired: boolean;
  storeUrl: string;
  checkAppVersion: () => Promise<void>;
}

// Semantic versioning comparison: returns true if current < minimum
const isVersionOlder = (current: any, minimum: any): boolean => {
  if (typeof current !== 'string' || typeof minimum !== 'string') {
    return false;
  }
  const currentParts = current.split('.').map(num => parseInt(num, 10) || 0);
  const minParts = minimum.split('.').map(num => parseInt(num, 10) || 0);

  for (let i = 0; i < Math.max(currentParts.length, minParts.length); i++) {
    const cur = currentParts[i] || 0;
    const min = minParts[i] || 0;
    if (cur < min) return true;
    if (cur > min) return false;
  }
  return false;
};

export const useConfigStore = create<ConfigState>((set) => ({
  isUpdateRequired: false,
  storeUrl: '',

  checkAppVersion: async () => {
    try {
      const currentVersion = Constants.expoConfig?.version || Application.nativeApplicationVersion || '1.0.0';
      console.log('[useConfigStore] Checking app version. Local:', currentVersion);
      
      const response = await api.get('/config/version');
      const { minAndroidVersion, minIosVersion, storeUrlAndroid, storeUrlIos } = response?.data || {};

      const minVersion = (Platform.OS === 'ios' ? minIosVersion : minAndroidVersion) || '1.0.0';
      const targetStoreUrl = (Platform.OS === 'ios' ? storeUrlIos : storeUrlAndroid) || '';

      console.log('[useConfigStore] Version comparison. Local:', currentVersion, 'Min required:', minVersion);

      if (isVersionOlder(currentVersion, minVersion)) {
        console.log('[useConfigStore] Update required! Show modal.');
        set({
          isUpdateRequired: true,
          storeUrl: targetStoreUrl,
        });
      } else {
        console.log('[useConfigStore] App is up to date.');
        set({
          isUpdateRequired: false,
          storeUrl: '',
        });
      }
    } catch (error) {
      // Fail silently to avoid breaking startup, as per requirements ("بشكل صامت")
      console.error('[useConfigStore] Version check failed silently:', error);
    }
  },
}));
