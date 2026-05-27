import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export const PostCardSkeleton: React.FC = () => {
  const { colors, isDark } = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  // Dynamic background matching theme
  const blockBg = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';

  return (
    <Animated.View style={[styles.card, { borderBottomColor: colors.border.muted, opacity }]}>
      {/* Header: Name + Time */}
      <View style={styles.header}>
        <View style={[styles.nameBlock, { backgroundColor: blockBg }]} />
        <View style={[styles.timeBlock, { backgroundColor: blockBg }]} />
      </View>

      {/* Content lines */}
      <View style={styles.contentContainer}>
        <View style={[styles.contentLine, { width: '85%', backgroundColor: blockBg }]} />
        <View style={[styles.contentLine, { width: '60%', backgroundColor: blockBg }]} />
      </View>

      {/* Footer: Like + Expiry */}
      <View style={styles.footer}>
        <View style={styles.likeContainer}>
          <View style={[styles.rippleOuterRing, { borderColor: colors.border.muted }]} />
          <View style={[styles.likeCountBlock, { backgroundColor: blockBg }]} />
        </View>
        <View style={[styles.expiryBlock, { backgroundColor: blockBg }]} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameBlock: {
    width: 80,
    height: 12,
    borderRadius: 6,
  },
  timeBlock: {
    width: 40,
    height: 10,
    borderRadius: 5,
  },
  contentContainer: {
    marginBottom: 12,
  },
  contentLine: {
    height: 14,
    borderRadius: 7,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rippleOuterRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
  },
  likeCountBlock: {
    width: 20,
    height: 12,
    borderRadius: 6,
    marginLeft: 6,
  },
  expiryBlock: {
    width: 120,
    height: 10,
    borderRadius: 5,
  },
});
