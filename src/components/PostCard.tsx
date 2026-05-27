import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Animated, Alert } from 'react-native';
import { Post } from '../types';
import { isArabicText } from '../utils/rtl';
import { useTheme } from '../hooks/useTheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuthStore } from '../store/useAuthStore';
import { useFeedStore } from '../store/useFeedStore';

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

  const currentUser = useAuthStore((state) => state.user);
  const blockUser = useFeedStore((state) => state.blockUser);
  const reportPost = useFeedStore((state) => state.reportPost);
  const deletePost = useFeedStore((state) => state.deletePost);

  const isOwnPost = currentUser?.anonymousName === post.anonymousName;

  const handleMenuPress = () => {
    if (isOwnPost) {
      Alert.alert(
        'خيارات المنشور',
        'هل ترغب في حذف هذا الأثر نهائياً وفوراً؟',
        [
          { text: 'إلغاء', style: 'cancel' },
          {
            text: 'حذف المنشور فوراً',
            style: 'destructive',
            onPress: async () => {
              try {
                await deletePost(post.id);
                Alert.alert('تم', 'تم حذف منشورك بنجاح.');
              } catch (err) {
                Alert.alert('خطأ', 'تعذر حذف المنشور حالياً.');
              }
            }
          }
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert(
        'خيارات المنشور',
        'الرجاء اختيار أحد الإجراءات التالية للمساعدة في الحفاظ على مجتمع آمن:',
        [
          { text: 'إلغاء', style: 'cancel' },
          {
            text: 'إبلاغ عن محتوى غير لائق',
            style: 'destructive',
            onPress: async () => {
              try {
                await reportPost(post.id);
                Alert.alert('شكرًا لك', 'تم استلام الإبلاغ بنجاح، وسيتخذ فريق الدعم الإجراء المناسب خلال 24 ساعة.');
              } catch (err) {
                Alert.alert('خطأ', 'تعذر إرسال الإبلاغ حالياً.');
              }
            }
          },
          {
            text: 'حظر هذا الكاتب',
            style: 'destructive',
            onPress: () => {
              Alert.alert(
                'تأكيد الحظر',
                `هل أنت متأكد من رغبتك في حظر ${post.anonymousName}؟ لن تظهر لك أي منشورات منه مجدداً.`,
                [
                  { text: 'إلغاء', style: 'cancel' },
                  {
                    text: 'نعم، حظره',
                    style: 'destructive',
                    onPress: async () => {
                      await blockUser(post.anonymousName);
                      Alert.alert('تم الحظر', 'تم حظر المستخدم بنجاح ولن تظهر لك أي من مشاركاته.');
                    }
                  }
                ]
              );
            }
          }
        ],
        { cancelable: true }
      );
    }
  };

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

  const getRemainingTimeText = (createdAtStr: string): string => {
    const createdAt = new Date(createdAtStr).getTime();
    const expiresAt = createdAt + 24 * 60 * 60 * 1000; // 24 hours
    const now = Date.now();
    const diffMs = expiresAt - now;

    if (diffMs <= 0) {
      return 'انتهى المنشور';
    }

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const remainingMinutes = diffMinutes % 60;

    if (diffHours > 0) {
      if (diffHours === 1) {
        return remainingMinutes > 0 
          ? `ينتهي بعد ساعة و ${remainingMinutes} دقيقة`
          : 'ينتهي بعد ساعة';
      }
      if (diffHours === 2) {
        return remainingMinutes > 0 
          ? `ينتهي بعد ساعتين و ${remainingMinutes} دقيقة`
          : 'ينتهي بعد ساعتين';
      }
      if (diffHours >= 3 && diffHours <= 10) {
        return remainingMinutes > 0
          ? `ينتهي بعد ${diffHours} ساعات و ${remainingMinutes} دقيقة`
          : `ينتهي بعد ${diffHours} ساعات`;
      }
      return remainingMinutes > 0
        ? `ينتهي بعد ${diffHours} ساعة و ${remainingMinutes} دقيقة`
        : `ينتهي بعد ${diffHours} ساعة`;
    } else {
      if (diffMinutes === 1) {
        return 'ينتهي بعد دقيقة';
      }
      if (diffMinutes === 2) {
        return 'ينتهي بعد دقيقتين';
      }
      if (diffMinutes >= 3 && diffMinutes <= 10) {
        return `ينتهي  بعد ${diffMinutes} دقائق`;
      }
      return `ينتهي بعد ${diffMinutes} دقيقة`;
    }
  };

  const expiryText = getRemainingTimeText(post.createdAt);

  return (
    <TouchableWithoutFeedback onPress={handleCardPress}>
      <View style={[styles.card, { borderBottomColor: colors.border.muted }]}>
        {/* Header: Name + Time on right, Menu on left */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
            <Text style={[styles.anonymousName, { color: colors.brand.gold, marginLeft: 8 }]}>
              {post.anonymousName}
            </Text>
            <Text style={[styles.timeText, { color: colors.text.disabled }]}>
              {formattedDate}
            </Text>
          </View>
          <TouchableOpacity onPress={handleMenuPress} style={{ padding: 4 }} activeOpacity={0.6}>
            <Ionicons name="ellipsis-horizontal" size={16} color={colors.text.secondary} />
          </TouchableOpacity>
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
            {expiryText}
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
    flexDirection: 'row-reverse',
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
