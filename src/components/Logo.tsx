import React from 'react';
import { View, StyleSheet } from 'react-native';

interface LogoProps {
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ size = 120 }) => {
  const baseScale = size / 120;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer Ring 3 */}
      <View style={[styles.ring, styles.ringOuter3, { width: size, height: size, borderRadius: size / 2 }]} />

      {/* Outer Ring 2 */}
      <View style={[styles.ring, styles.ringOuter2, { width: size * 0.75, height: size * 0.75, borderRadius: (size * 0.75) / 2 }]} />

      {/* Outer Ring 1 */}
      <View style={[styles.ring, styles.ringOuter1, { width: size * 0.5, height: size * 0.5, borderRadius: (size * 0.5) / 2 }]} />

      {/* Center Core Dot */}
      <View style={[styles.coreDot, { width: size * 0.2, height: size * 0.2, borderRadius: (size * 0.2) / 2 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    borderWidth: 2.5,
    borderColor: '#0055A5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringOuter3: {
    opacity: 0.12,
  },
  ringOuter2: {
    opacity: 0.35,
  },
  ringOuter1: {
    opacity: 0.7,
  },
  coreDot: {
    backgroundColor: '#0055A5',
  },
});
