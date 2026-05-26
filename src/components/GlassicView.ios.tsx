import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from 'expo-glass-effect';
import { GlassicViewProps } from './GlassicView.types';
import { useTheme } from '../hooks/useTheme';

export const GlassicView: React.FC<GlassicViewProps> = ({
  children,
  style,
  cornerRadius = 24,
  glassEffectStyle = 'regular',
  isInteractive = false,
  tintColor,
}) => {
  // التحقق المزدوج: هل النظام يدعم Liquid Glass؟ وهل الـ API يعمل؟
  const canUseGlass =
    isLiquidGlassAvailable() && isGlassEffectAPIAvailable();

  const { isDark } = useTheme();

  // iOS < 26 أو أي جهاز لا يدعم UIGlassEffect (مثل Expo Go) → View عادي بخلفية زجاجية محاكية متناسقة للحفاظ على الحواف
  if (!canUseGlass) {
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
  }

  // iOS 26+: UIGlassEffect حقيقي من Apple
  // Architecture: GlassView كـ absolute background + View للـ children فوقه
  // السبب: GlassView هو surface layer، والـ children تُوضع كـ overlay
  return (
    <View style={[styles.container, style]}>
      <GlassView
        style={[StyleSheet.absoluteFill, { borderRadius: cornerRadius }]}
        glassEffectStyle={glassEffectStyle}
        isInteractive={isInteractive}
        tintColor={tintColor}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    // overflow MUST NOT be 'hidden' — UIGlassEffect needs to see what's behind
    // the surface to compute the refraction/blur correctly.
  },
  content: {
    // Absolute fill ensures children always fill the container
    // regardless of whether the parent uses height or flex.
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'inherit' as any,
    alignItems: 'inherit' as any,
    justifyContent: 'inherit' as any,
  },
  fallbackContainer: {
    borderWidth: 1,
    overflow: 'hidden',
  },
});
