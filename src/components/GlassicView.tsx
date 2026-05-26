import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GlassicViewProps } from './GlassicView.types';
import { useTheme } from '../hooks/useTheme';

// Android / Web: View عادي مع خلفية زجاجية محاكية متناسقة
export const GlassicView: React.FC<GlassicViewProps> = ({
  children,
  style,
  cornerRadius = 24,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.fallbackContainer,
        {
          borderRadius: cornerRadius,
          backgroundColor: isDark ? 'rgba(19, 26, 44, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  fallbackContainer: {
    borderWidth: 1,
    overflow: 'hidden',
  },
});

