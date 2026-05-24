import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export const IntroScreen: React.FC = () => {
  const { colors } = useTheme();
  const ring1Scale = useRef(new Animated.Value(0.3)).current;
  const ring2Scale = useRef(new Animated.Value(0.3)).current;
  const ring3Scale = useRef(new Animated.Value(0.3)).current;
  const dotScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered ripple expand spring animation
    Animated.stagger(150, [
      Animated.spring(dotScale, {
        toValue: 1,
        tension: 40,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.spring(ring1Scale, {
        toValue: 1,
        tension: 20,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(ring2Scale, {
        toValue: 1,
        tension: 15,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(ring3Scale, {
        toValue: 1,
        tension: 10,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.default }]}>
      <View style={styles.logoContainer}>
        {/* Animated Rings and Dot matched to dynamic brand gold */}
        <Animated.View style={[styles.ring, styles.ringOuter3, { transform: [{ scale: ring3Scale }], borderColor: colors.brand.gold }]} />
        <Animated.View style={[styles.ring, styles.ringOuter2, { transform: [{ scale: ring2Scale }], borderColor: colors.brand.gold }]} />
        <Animated.View style={[styles.ring, styles.ringOuter1, { transform: [{ scale: ring1Scale }], borderColor: colors.brand.gold }]} />
        <Animated.View style={[styles.coreDot, { transform: [{ scale: dotScale }], backgroundColor: colors.brand.gold, shadowColor: colors.brand.gold }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    borderWidth: 3,
    borderRadius: 80,
  },
  ringOuter3: {
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.12,
  },
  ringOuter2: {
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.35,
  },
  ringOuter1: {
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.7,
  },
  coreDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
});
