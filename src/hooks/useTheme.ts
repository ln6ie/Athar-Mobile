import { useColorScheme } from 'react-native';
import { useThemeStore, ThemeMode } from '../store/useThemeStore';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/tokens';

export function useTheme() {
  const { themeMode, setThemeMode } = useThemeStore();
  const systemScheme = useColorScheme();

  const isDark = themeMode === 'system' 
    ? systemScheme === 'dark' 
    : themeMode === 'dark';

  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  return {
    colors,
    themeMode,
    setThemeMode,
    isDark,
  };
}
