import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Clipboard,
  Share,
  Platform,
  Pressable,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Post } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { useFeedStore } from '../../store/useFeedStore';
import { LikeButton } from '../shared/LikeButton';
import { BouncyPressable } from '../shared/BouncyPressable';
import { isArabicText } from '../../utils/rtl';
import { getRemainingTimeText } from '../../utils/time';
import { useFeedStyles, useSharedStyles, sheetStyles, floatingPositions } from '../../styles';
import * as Haptics from 'expo-haptics';
import i18n from '../../constants/locales';

interface PostDetailSheetProps {
  visible: boolean;
  post: Post | null;
  onClose: () => void;
  onLike: (id: string) => void;
}

export const PostDetailSheet: React.FC<PostDetailSheetProps> = ({
  visible,
  post: initialPost,
  onClose,
  onLike,
}) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const feedStyles = useFeedStyles();
  const sharedStyles = useSharedStyles();

  const post = useFeedStore((state) => {
    if (!initialPost) return null;
    const allPosts = [
      ...(state.posts.recent || []),
      ...(state.posts.trending || []),
      ...(state.myPosts || []),
      ...(state.likedPosts || []),
    ];
    return allPosts.find((p) => p.id === initialPost.id) || initialPost;
  });

  if (!post) return null;

  const isArabic = isArabicText(post.content);
  const expiryText = getRemainingTimeText(post.createdAt);
  const formattedDate = new Date(post.createdAt).toLocaleTimeString(i18n.language?.startsWith('ar') ? 'ar-SA-u-nu-latn' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCopy = () => {
    Clipboard.setString(post.content);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${post.content}\n\n${t('app.share_suffix')}`,
      });
      onClose();
    } catch (err) {
      console.error(t('feed.publish_failed'), err);
    }
  };

  const content = (
    <View
      style={[
        sheetStyles.content,
        { backgroundColor: colors.background.default },
      ]}
    >
      {/* معلومات الترويسة */}
      <View style={sheetStyles.header}>
        <View style={sheetStyles.headerRight}>
          <Text style={[feedStyles.anonymousName, { color: colors.brand.gold }]}>
            {post.anonymousName}
          </Text>
          <Text style={[feedStyles.timeText, { color: colors.text.disabled }]}>
            {formattedDate}
          </Text>
        </View>
      </View>

      {/* منطقة المحتوى */}
      <View style={localStyles.contentContainer}>
        <Text
          style={[
            feedStyles.postContent,
            {
              color: colors.text.primary,
              textAlign: isArabic ? 'right' : 'left',
            },
          ]}
          selectable
        >
          {post.content}
        </Text>
        
        <Text style={[feedStyles.expiryText, { color: colors.text.disabled }]}>
          {expiryText}
        </Text>
      </View>

      {/* فاصل */}
      <View style={[feedStyles.separator, { backgroundColor: colors.border.muted }]} />

      {/* شبكة الإجراءات التفاعلية */}
      <View style={sharedStyles.sheetActionRow}>
        {/* زر الإعجاب بنسخة الورقة */}
        <LikeButton
          isLiked={post.isLiked}
          onPress={() => onLike(post.id)}
          variant="sheet"
        />

        {/* إجراء النسخ */}
        <BouncyPressable style={sheetStyles.actionButton} onPress={handleCopy}>
          <View style={[sharedStyles.iconCircle, { backgroundColor: 'rgba(128, 128, 128, 0.05)' }]}>
            <Ionicons name="copy-outline" size={22} color={colors.text.secondary} />
          </View>
          <Text style={[sharedStyles.actionLabel, { color: colors.text.primary }]}>
            {t('common.copy')}
          </Text>
        </BouncyPressable>

        {/* إجراء المشاركة */}
        <BouncyPressable style={sheetStyles.actionButton} onPress={handleShare}>
          <View style={[sharedStyles.iconCircle, { backgroundColor: 'rgba(128, 128, 128, 0.05)' }]}>
            <Ionicons name="share-social-outline" size={22} color={colors.text.secondary} />
          </View>
          <Text style={[sharedStyles.actionLabel, { color: colors.text.primary }]}>
            {t('common.share')}
          </Text>
        </BouncyPressable>
      </View>
    </View>
  );

  if (Platform.OS === 'ios') {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <View style={[localStyles.iosContainer, { backgroundColor: colors.background.default }]}>
          {content}
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={localStyles.androidFullscreen}>
        <Pressable style={[floatingPositions.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.4)' }]} onPress={onClose} />
        <View style={localStyles.androidSheetContainer}>
          {content}
        </View>
      </View>
    </Modal>
  );
};

const localStyles = StyleSheet.create({
  iosContainer: {
    flex: 1,
  },
  androidFullscreen: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  androidSheetContainer: {
    width: '100%',
  },
  contentContainer: {
    marginVertical: 8,
  },
});
