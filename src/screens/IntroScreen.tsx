import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useSharedStyles } from '../styles';

export const IntroScreen: React.FC = () => {
  const { colors } = useTheme();
  const sharedStyles = useSharedStyles();
  const ring1Scale = useRef(new Animated.Value(0.3)).current;
  const ring2Scale = useRef(new Animated.Value(0.3)).current;
  const ring3Scale = useRef(new Animated.Value(0.3)).current;
  const dotScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
    <View style={[sharedStyles.loadingContainer, { backgroundColor: colors.background.default }]}>
      <View style={localStyles.logoContainer}>
        <Animated.View
          style={[
            sharedStyles.ring,
            sharedStyles.ringOuter3,
            {
              width: 140,
              height: 140,
              borderRadius: 70,
              borderWidth: 3,
              transform: [{ scale: ring3Scale }],
              borderColor: colors.brand.gold,
            },
          ]}
        />
        <Animated.View
          style={[
            sharedStyles.ring,
            sharedStyles.ringOuter2,
            {
              width: 105,
              height: 105,
              borderRadius: 52.5,
              borderWidth: 3,
              transform: [{ scale: ring2Scale }],
              borderColor: colors.brand.gold,
            },
          ]}
        />
        <Animated.View
          style={[
            sharedStyles.ring,
            sharedStyles.ringOuter1,
            {
              width: 70,
              height: 70,
              borderRadius: 35,
              borderWidth: 3,
              transform: [{ scale: ring1Scale }],
              borderColor: colors.brand.gold,
            },
          ]}
        />
        <Animated.View
          style={[
            localStyles.coreDot,
            {
              transform: [{ scale: dotScale }],
              backgroundColor: colors.brand.gold,
              shadowColor: colors.brand.gold,
            },
          ]}
        />
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  logoContainer: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
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
