import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native';
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
    <View style={[styles.card, { borderBottomColor: colors.border.muted }]}>
      <TouchableWithoutFeedback onPress={handleCardPress}>
        <View>
          {/* Header with Anonymous Name and time */}
          <View style={styles.header}>
            <Text style={[styles.anonymousName, { color: colors.brand.gold }]}>
              {post.anonymousName}
            </Text>
            <Text style={[styles.timeText, { color: colors.text.disabled }]}>
              {formattedDate}
            </Text>
          </View>

          {/* Main post text content - Clean, black, minimal */}
          <Text 
            style={[
              styles.content,
              { textAlign: isArabic ? 'right' : 'left', color: colors.text.primary }
            ]}
          >
            {post.content}
          </Text>
        </View>
      </TouchableWithoutFeedback>

      {/* Bottom like counter - Clean and minimal */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => onLike(post.id)}
          style={styles.likeContainer}
          activeOpacity={0.7}
        >
          {/* Custom concentric trace ripple indicator */}
          <View style={[
            styles.rippleOuterRing,
            post.isLiked 
              ? { borderColor: colors.brand.gold, backgroundColor: isDark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(0, 85, 165, 0.08)' } 
              : { borderColor: colors.border.muted }
          ]}>
            <View style={[
              styles.rippleInnerDot,
              post.isLiked 
                ? { backgroundColor: colors.brand.gold, width: 7, height: 7, borderRadius: 3.5 } 
                : { backgroundColor: colors.text.disabled, width: 3, height: 3, borderRadius: 1.5 }
            ]} />
          </View>
          <Text style={[
            styles.likeCountText,
            post.isLiked 
              ? { color: colors.brand.gold, fontWeight: 'bold' } 
              : { color: colors.text.secondary }
          ]}>
            {post.likesCount}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.expiryText, { color: colors.text.disabled }]}>
          ينتهي الأثر بعد 24 ساعة
        </Text>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    paddingVertical: 18,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  anonymousName: {
    color: '#0055A5',
    fontWeight: 'bold',
    fontSize: 13,
    lineHeight: 18,
  },
  timeText: {
    color: '#9CA3AF',
    fontSize: 10,
    lineHeight: 14,
  },
  content: {
    color: '#000000',
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
  rippleOuterRingActive: {
    borderColor: '#0055A5',
    backgroundColor: 'rgba(0, 85, 165, 0.1)',
  },
  rippleOuterRingInactive: {
    borderColor: '#E5E7EB',
    backgroundColor: 'transparent',
  },
  rippleInnerDot: {
    // Base style if needed, but active/inactive have complete dimensions
  },
  rippleInnerDotActive: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#0055A5',
  },
  rippleInnerDotInactive: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#9CA3AF',
  },
  likeCountText: {
    fontSize: 12,
    marginLeft: 6,
    lineHeight: 18,
  },
  likeCountTextActive: {
    color: '#0055A5',
    fontWeight: 'bold',
  },
  likeCountTextInactive: {
    color: '#6B7280',
  },
  expiryText: {
    color: '#9CA3AF',
    fontSize: 10,
    lineHeight: 14,
  },
});
