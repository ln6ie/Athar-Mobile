import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { GlassicViewProps } from './GlassicView.types';
import { useTheme } from '../hooks/useTheme';

// أندرويد / ويب: تأثير بلور زجاجي حقيقي باستخدام expo-blur
export const GlassicView: React.FC<GlassicViewProps> = ({
  children,
  style,
  cornerRadius = 24,
}) => {
  const { isDark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: cornerRadius,
          // Low opacity overlays let the blur shine through natively on Android
          backgroundColor: isDark ? 'rgba(20, 20, 25, 0.35)' : 'rgba(255, 255, 255, 0.35)',
          // High-end white-tinted borders mimic native glass refraction
          borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.45)',
          borderWidth: 1.2,
        },
        style,
      ]}
    >
      <BlurView
        intensity={65}
        tint={isDark ? 'dark' : 'light'}
        style={[StyleSheet.absoluteFill, { borderRadius: cornerRadius }]}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
});

