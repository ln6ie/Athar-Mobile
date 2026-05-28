import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Share, Alert, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Post } from '../types';
import { isArabicText } from '../utils/rtl';
import { useTheme } from '../hooks/useTheme';
import { useAuthStore } from '../store/useAuthStore';
import { useFeedStore } from '../store/useFeedStore';
import { NativeContextMenu } from './NativeContextMenu';
import { getRemainingTimeText } from '../utils/time';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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

  // Reanimated UI Thread Spring Shared Values
  const cardScale = useSharedValue(1);
  const likeScale = useSharedValue(1);

  const currentUser = useAuthStore((state) => state.user);
  const blockUser = useFeedStore((state) => state.blockUser);
  const reportPost = useFeedStore((state) => state.reportPost);
  const deletePost = useFeedStore((state) => state.deletePost);

  const isOwnPost = currentUser?.anonymousName === post.anonymousName;

  // React Native Reanimated: UI Thread Apple Spring Physics Spring Equation
  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: cardScale.value }],
    };
  });

  const likeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: likeScale.value }],
    };
  });

  useEffect(() => {
    if (post.isLiked) {
      likeScale.value = 1.3;
      likeScale.value = withSpring(1, { damping: 10, stiffness: 180 });
    } else {
      likeScale.value = 1;
    }
  }, [post.isLiked]);

  const handlePressIn = () => {
    'worklet';
    cardScale.value = withSpring(0.96, { damping: 15, stiffness: 150, mass: 0.6 });
  };

  const handlePressOut = () => {
    'worklet';
    cardScale.value = withSpring(1, { damping: 15, stiffness: 150, mass: 0.6 });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `أثر: ${post.content}\n\nعبر بالمجهول عبر تطبيق أثر`,
      });
    } catch (err) {
      console.error('Error sharing post', err);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(post.id);
      Alert.alert('تم الحذف', 'تم حذف منشورك بنجاح.');
    } catch (err) {
      Alert.alert('خطأ', 'تعذر حذف المنشور حالياً.');
    }
  };

  const handleReport = async () => {
    try {
      await reportPost(post.id);
      Alert.alert('شكرًا لك', 'تم استلام الإبلاغ بنجاح، وسيتخذ فريق الدعم الإجراء المناسب خلال 24 ساعة.');
    } catch (err) {
      Alert.alert('خطأ', 'تعذر إرسال الإبلاغ حالياً.');
    }
  };

  const handleBlock = () => {
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
  };

  // Define options for SwiftUI and Android context menu
  const menuOptions = [
    {
      label: post.isLiked ? 'إزالة الإعجاب' : 'إعجاب بالمنشور',
      onPress: () => onLike(post.id),
      style: 'default' as const,
    },
    {
      label: 'مشاركة الأثر',
      onPress: handleShare,
      style: 'default' as const,
    },
    ...(isOwnPost
      ? [
          {
            label: 'حذف المنشور فوراً',
            onPress: handleDelete,
            style: 'destructive' as const,
          },
        ]
      : [
          {
            label: 'إبلاغ عن محتوى غير لائق',
            onPress: handleReport,
            style: 'destructive' as const,
          },
          {
            label: `حظر كاتب المنشور (${post.anonymousName})`,
            onPress: handleBlock,
            style: 'destructive' as const,
          },
        ]),
    {
      label: 'إلغاء',
      onPress: () => {},
      style: 'cancel' as const,
    },
  ];

  const expiryText = getRemainingTimeText(post.createdAt);

  return (
    <NativeContextMenu options={menuOptions} title="خيارات الأثر">
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onLike(post.id)}
        style={[
          styles.card, 
          cardAnimatedStyle, 
          { borderBottomColor: colors.border.muted }
        ]}
      >
        {/* Header: Name + Time on right, Menu icon on left */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
            <Text style={[styles.anonymousName, { color: colors.brand.gold, marginLeft: 8 }]}>
              {post.anonymousName}
            </Text>
            <Text style={[styles.timeText, { color: colors.text.disabled }]}>
              {formattedDate}
            </Text>
          </View>
          <View style={{ padding: 4 }}>
            <Ionicons name="ellipsis-horizontal" size={16} color={colors.text.secondary} />
          </View>
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
          <View style={styles.likeContainer}>
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
                likeAnimatedStyle
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
          </View>

          <Text style={[styles.expiryText, { color: colors.text.disabled }]}>
            {expiryText}
          </Text>
        </View>
      </AnimatedPressable>
    </NativeContextMenu>
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
