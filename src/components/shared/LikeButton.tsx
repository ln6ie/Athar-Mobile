import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { useSharedStyles, sheetStyles } from '../../styles';

interface LikeButtonProps {
  isLiked: boolean;
  likesCount?: number;
  onPress: () => void;
  variant: 'card' | 'sheet';
}

// زر الإعجاب - يدعم شكل البطاقة والشيت مع أنيميشن للدوران
export const LikeButton: React.FC<LikeButtonProps> = ({
  isLiked,
  likesCount,
  onPress,
  variant,
}) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const sharedStyles = useSharedStyles();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  useEffect(() => {
    if (isLiked) {
      scale.value = withSequence(
        withTiming(1.25, { duration: 100 }),
        withSpring(1, { damping: 12, stiffness: 180 })
      );
    } else {
      scale.value = withTiming(1, { duration: 100 });
    }
  }, [isLiked]);

  const renderGoldLikeIcon = () => (
    <View
      style={[
        localStyles.rippleOuterRing,
        isLiked
          ? {
              borderColor: colors.brand.gold,
              backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF',
              borderWidth: isDark ? 1 : 0.5,
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 2,
            }
          : { borderColor: colors.border.muted },
      ]}
    >
      <View
        style={[
          localStyles.rippleInnerDot,
          isLiked
            ? { backgroundColor: colors.brand.gold, width: 7, height: 7, borderRadius: 3.5 }
            : { backgroundColor: colors.text.disabled, width: 3, height: 3, borderRadius: 1.5 },
        ]}
      />
    </View>
  );

  if (variant === 'card') {
    return (
      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          onPress();
        }}
        style={localStyles.cardContainer}
      >
        <Animated.View style={animatedStyle}>
          {renderGoldLikeIcon()}
        </Animated.View>

        {likesCount !== undefined && (
          <Text
            style={[
              localStyles.likeCountText,
              isLiked
                ? { color: colors.brand.gold, fontWeight: 'bold' }
                : { color: colors.text.secondary },
            ]}
          >
            {likesCount}
          </Text>
        )}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={(e) => {
        e.stopPropagation();
        onPress();
      }}
      style={sheetStyles.actionButton}
    >
      <Animated.View style={animatedStyle}>
        <View
          style={[
            sharedStyles.iconCircle,
            {
              backgroundColor: 'rgba(128, 128, 128, 0.05)',
            },
          ]}
        >
          {renderGoldLikeIcon()}
        </View>
      </Animated.View>
      <Text
        style={[
          sharedStyles.actionLabel,
          { color: isLiked ? colors.brand.gold : colors.text.primary },
        ]}
      >
        {isLiked ? t('common.like') : t('common.liked')}
      </Text>
    </Pressable>
  );
};

const localStyles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rippleOuterRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rippleInnerDot: {},
  likeCountText: {
    fontSize: 12,
    marginLeft: 6,
    lineHeight: 18,
  },
});
