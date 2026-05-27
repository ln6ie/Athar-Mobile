import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { ThemeMode } from '../store/useThemeStore';

interface ThemeSelectorProps {
  minimal?: boolean;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ minimal = false }) => {
  const { themeMode, setThemeMode, colors, isDark } = useTheme();

  const options: { mode: ThemeMode; label: string }[] = [
    { mode: 'dark', label: 'داكن' },
    { mode: 'system', label: 'تلقائي' },
    { mode: 'light', label: 'الفاتح' },
  ];

  return (
    <View
      style={
        !minimal
          ? [
              styles.container,
              {
                backgroundColor: colors.background.card,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: colors.border.muted,
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isDark ? 0 : 0.04,
                shadowRadius: 12,
                elevation: 2,
              },
            ]
          : [styles.minimalContainer, { borderTopColor: colors.border.muted }]
      }
    >
      <Text style={[styles.title, { color: colors.brand.gold }]}>مظهر التطبيق</Text>
      
      <View style={[styles.segmentContainer, { backgroundColor: isDark ? '#000000' : colors.background.input }]}>
        {options.map((opt) => {
          const isActive = themeMode === opt.mode;
          return (
            <TouchableOpacity
              key={opt.mode}
              style={[
                styles.segmentButton,
                isActive && [
                  styles.activeSegmentButton,
                  {
                    backgroundColor: isDark ? '#2C2C2E' : colors.background.card,
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                    borderWidth: isDark ? 1 : 0.5,
                  }
                ]
              ]}
              onPress={() => setThemeMode(opt.mode)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.segmentText,
                  isActive
                    ? [styles.activeSegmentText, { color: colors.brand.gold }]
                    : { color: colors.text.secondary }
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  minimalContainer: {
    borderTopWidth: 1,
    paddingTop: 16,
    marginTop: 12,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 12,
  },
  segmentContainer: {
    flexDirection: 'row-reverse',
    borderRadius: 24,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeSegmentButton: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
  },
  activeSegmentText: {
    fontWeight: 'bold',
  },
});
