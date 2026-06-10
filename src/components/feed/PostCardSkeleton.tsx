// هيكل عظمي متحرك لبطاقة المنشور - عرض أثناء التحميل
import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useFeedStyles } from '../../styles';

export const PostCardSkeleton: React.FC = () => {
  const { colors, isDark } = useTheme();
  const feedStyles = useFeedStyles();
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

  const blockBg = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';

  return (
    <Animated.View style={[feedStyles.skeletonCard, { opacity }]}>
      <View style={feedStyles.skeletonHeader}>
        <View style={[feedStyles.skeletonNameBlock, { backgroundColor: blockBg }]} />
        <View style={[feedStyles.skeletonTimeBlock, { backgroundColor: blockBg }]} />
      </View>

      <View style={feedStyles.skeletonContentContainer}>
        <View style={[feedStyles.skeletonContentLine, { width: '85%', backgroundColor: blockBg }]} />
        <View style={[feedStyles.skeletonContentLine, { width: '60%', backgroundColor: blockBg }]} />
      </View>

      <View style={feedStyles.skeletonFooter}>
        <View style={feedStyles.skeletonLikeContainer}>
          <View style={feedStyles.skeletonRippleOuterRing} />
          <View style={[feedStyles.skeletonLikeCountBlock, { backgroundColor: blockBg }]} />
        </View>
        <View style={[feedStyles.skeletonExpiryBlock, { backgroundColor: blockBg }]} />
      </View>
    </Animated.View>
  );
};
