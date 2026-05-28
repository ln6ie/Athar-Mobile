import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../hooks/useTheme';

interface OfflineBannerProps {
  topOffset: number;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ topOffset }) => {
  const { isDark } = useTheme();

  // Premium amber warning colors that adapt to system theme mode
  const containerBg = isDark 
    ? 'rgba(217, 119, 6, 0.15)'  // Frosted amber tint for dark mode
    : 'rgba(245, 158, 11, 0.08)'; // Muted gold tint for light mode

  const borderColor = isDark
    ? 'rgba(217, 119, 6, 0.25)'
    : 'rgba(245, 158, 11, 0.15)';

  const textColor = isDark ? '#F59E0B' : '#B45309';
  const indicatorColor = isDark ? '#F59E0B' : '#D97706';

  return (
    <View style={[styles.wrapper, { top: topOffset }]}>
      <View style={[styles.offlineBanner, { backgroundColor: containerBg, borderColor: borderColor }]}>
        <BlurView
          intensity={45}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.contentContainer}>
          <View style={[styles.offlineIndicator, { backgroundColor: indicatorColor }]} />
          <Text style={[styles.offlineText, { color: textColor }]}>
            أنت تتصفح في وضع عدم الاتصال بالإنترنت حالياً
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    zIndex: 99,
  },
  offlineBanner: {
    borderRadius: 12,
    borderWidth: 0.8,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  contentContainer: {
    flexDirection: 'row-reverse', // Perfect Arabic RTL layout
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  offlineIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 8, // RTL spacing
  },
  offlineText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
    lineHeight: 18,
    // CRITICAL: NO letterSpacing! letterSpacing breaks/scrambles connected Arabic cursive letters in React Native.
  },
});

