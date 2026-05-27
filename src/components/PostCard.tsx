import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Animated } from 'react-native';
import { Post } from '../types';
import { isArabicText } from '../utils/rtl';
import { useTheme } from '../hooks/useTheme';

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  const isArabic = isArabicText(post.content);
  const { colors, isDark } = useTheme();
  const formattedDate = new Date(post.createdAt).toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const lastTapRef = useRef<number>(0);
  
  // Animated value for clean and light bounce pulse animation
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (post.isLiked) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [post.isLiked]);

  const handleCardPress = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_PRESS_DELAY) {
      onLike(post.id);
    } else {
      lastTapRef.current = now;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleCardPress}>
      <View style={[styles.card, { borderBottomColor: colors.border.muted }]}>
        {/* Header: Anonymous Name + Time */}
        <View style={styles.header}>
          <Text style={[styles.anonymousName, { color: colors.brand.gold }]}>
            {post.anonymousName}
          </Text>
          <Text style={[styles.timeText, { color: colors.text.disabled }]}>
            {formattedDate}
          </Text>
        </View>

        {/* Post content */}
        <Text
          style={[
            styles.content,
            { textAlign: isArabic ? 'right' : 'left', color: colors.text.primary },
          ]}
        >
          {post.content}
        </Text>

        {/* Footer: Like + Expiry */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => onLike(post.id)}
            style={styles.likeContainer}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.rippleOuterRing,
                post.isLiked
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
                { transform: [{ scale: scaleAnim }] }
              ]}
            >
              <View
                style={[
                  styles.rippleInnerDot,
                  post.isLiked
                    ? { backgroundColor: colors.brand.gold, width: 7, height: 7, borderRadius: 3.5 }
                    : { backgroundColor: colors.text.disabled, width: 3, height: 3, borderRadius: 1.5 },
                ]}
              />
            </Animated.View>
            <Text
              style={[
                styles.likeCountText,
                post.isLiked
                  ? { color: colors.brand.gold, fontWeight: 'bold' }
                  : { color: colors.text.secondary },
              ]}
            >
              {post.likesCount}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.expiryText, { color: colors.text.disabled }]}>
            ينتهي الأثر بعد 24 ساعة
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
  anonymousName: {
    fontWeight: 'bold',
    fontSize: 13,
    lineHeight: 18,
  },
  timeText: {
    fontSize: 10,
    lineHeight: 14,
  },
  content: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: 'normal',
    marginBottom: 12,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  rippleInnerDot: {},
  likeCountText: {
    fontSize: 12,
    marginLeft: 6,
    lineHeight: 18,
  },
  expiryText: {
    fontSize: 10,
    lineHeight: 14,
  },
});
