import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GlassicViewProps } from './GlassicView.types';
import { useTheme } from '../hooks/useTheme';
import { BlurView } from 'expo-blur';

// Safe dynamic fallbacks for Expo Go and standard builds without expo-glass-effect compiled in
let GlassView: any = View;
let isGlassEffectAPIAvailable = () => false;
let isLiquidGlassAvailable = () => false;

try {
  const GlassEffectModule = require('expo-glass-effect');
  GlassView = GlassEffectModule.GlassView || View;
  isGlassEffectAPIAvailable = GlassEffectModule.isGlassEffectAPIAvailable || (() => false);
  isLiquidGlassAvailable = GlassEffectModule.isLiquidGlassAvailable || (() => false);
} catch (e) {
  console.warn('[GlassicView] expo-glass-effect is not available, falling back to expo-blur.', e);
}

export const GlassicView: React.FC<GlassicViewProps> = ({
  children,
  style,
  cornerRadius = 24,
  glassEffectStyle = 'regular',
  isInteractive = false,
  tintColor,
}) => {
  const { isDark } = useTheme();

  // التحقق المزدوج: هل النظام يدعم Liquid Glass؟ وهل الـ API يعمل؟
  const canUseGlass =
    isLiquidGlassAvailable() && isGlassEffectAPIAvailable();

  // iOS < 26 أو أي جهاز لا يدعم UIGlassEffect (مثل Expo Go) → تأثير بلور زجاجي أنيق وحقيقي باستخدام expo-blur
  if (!canUseGlass) {
    return (
      <View
        style={[
          styles.fallbackContainer,
          {
            borderRadius: cornerRadius,
            // Low opacity overlays let the blur shine through natively
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
  }

  // iOS 26+: UIGlassEffect حقيقي من Apple
  return (
    <View style={[styles.container, style]}>
      <GlassView
        style={[StyleSheet.absoluteFill, { borderRadius: cornerRadius }]}
        glassEffectStyle={glassEffectStyle}
        isInteractive={isInteractive}
        tintColor={tintColor}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    // overflow MUST NOT be 'hidden' — UIGlassEffect needs to see what's behind
    // the surface to compute the refraction/blur correctly.
  },
  fallbackContainer: {
    position: 'relative',
    borderWidth: 1,
    overflow: 'hidden',
  },
});

