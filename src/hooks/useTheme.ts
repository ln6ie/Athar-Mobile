import { useEffect } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import { useThemeStore, ThemeMode } from '../store/useThemeStore';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/tokens';

export function useTheme() {
  const { themeMode, setThemeMode } = useThemeStore();
  const systemScheme = useColorScheme();

  const isDark = themeMode === 'system' 
    ? systemScheme === 'dark' 
    : themeMode === 'dark';

  useEffect(() => {
    // مزامنة واجهة الألوان للنظام البرمجي لـ iOS/Android ديناميكياً
    // هذا يضمن قيام PlatformColor بحل الألوان الصحيحة دون تعارض في المظهر المجموعي
    if (themeMode === 'system') {
      Appearance.setColorScheme('unspecified');
    } else {
      Appearance.setColorScheme(themeMode);
    }
  }, [themeMode]);

  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  return {
    colors,
    themeMode,
    setThemeMode,
    isDark,
  };
}
