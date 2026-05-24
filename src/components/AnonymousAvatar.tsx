import React from 'react';
import { StyleSheet, View } from 'react-native';

interface AnonymousAvatarProps {
  size?: number;
}

export const AnonymousAvatar: React.FC<AnonymousAvatarProps> = ({ size = 72 }) => {
  const scale = size / 72;

  return (
    <View style={[styles.avatarCircle, { width: size, height: size, borderRadius: size / 2 }]}>
      {/* Concentric Ripple Ring 2 (Outer) */}
      <View
        style={[
          styles.rippleRing,
          {
            width: size * 0.9,
            height: size * 0.9,
            borderRadius: (size * 0.9) / 2,
            opacity: 0.15,
            borderWidth: 2 * scale,
          },
        ]}
      />
      {/* Concentric Ripple Ring 1 (Inner) */}
      <View
        style={[
          styles.rippleRing,
          {
            width: size * 0.72,
            height: size * 0.72,
            borderRadius: (size * 0.72) / 2,
            opacity: 0.35,
            borderWidth: 1.5 * scale,
          },
        ]}
      />
      {/* The mystery/anonymous vector character */}
      <View style={[styles.characterContainer, { transform: [{ scale }] }]}>
        {/* Detective Fedora Hat */}
        <View style={styles.hatCrown} />
        <View style={styles.hatBrim} />
        {/* Mysterious Glasses / Mask */}
        <View style={styles.glassesContainer}>
          <View style={styles.glassLens} />
          <View style={styles.glassesBridge} />
          <View style={styles.glassLens} />
        </View>
        {/* Silhouette Coat / Shoulders */}
        <View style={styles.shoulders} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarCircle: {
    backgroundColor: '#0055A5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0055A5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  rippleRing: {
    position: 'absolute',
    borderColor: '#FFFFFF',
  },
  characterContainer: {
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  hatCrown: {
    width: 24,
    height: 10,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    bottom: 37,
    position: 'absolute',
    opacity: 0.95,
  },
  hatBrim: {
    width: 32,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 1.5,
    bottom: 34,
    position: 'absolute',
    opacity: 0.95,
  },
  glassesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 24,
    position: 'absolute',
  },
  glassLens: {
    width: 10,
    height: 7,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    opacity: 0.9,
  },
  glassesBridge: {
    width: 4,
    height: 2,
    backgroundColor: '#FFFFFF',
    opacity: 0.9,
  },
  shoulders: {
    width: 40,
    height: 16,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    bottom: 4,
    position: 'absolute',
    opacity: 0.85,
  },
});
