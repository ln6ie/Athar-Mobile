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
    <View style={[styles.container, { borderRadius: cornerRadius }, style]}>
      <BlurView
        intensity={75}
        tint={isDark ? 'dark' : 'light'}
        style={[StyleSheet.absoluteFill, { borderRadius: cornerRadius }]}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'inherit' as any,
    alignItems: 'inherit' as any,
    justifyContent: 'inherit' as any,
  },
});

