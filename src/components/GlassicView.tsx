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
          backgroundColor: isDark ? 'rgba(12, 24, 48, 0.45)' : 'rgba(230, 242, 255, 0.38)',
          borderColor: isDark ? 'rgba(59, 130, 246, 0.18)' : 'rgba(0, 85, 165, 0.14)',
          borderWidth: 1.2,
        },
        style,
      ]}
    >
      <BlurView
        intensity={80}
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

