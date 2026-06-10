import React from 'react';
import { View, Pressable, Platform, Alert, Share } from 'react-native';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MenuView } from '@expo/ui/community/menu';
import { Icon } from '@expo/ui';
import { Post } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/useAuthStore';
import { useFeedStore } from '../../store/useFeedStore';

// أيقونات SF Symbol / Material Symbol للقائمة الأصلية
const likeIcon = Icon.select({ ios: 'hand.thumbsup', android: require('@expo/material-symbols/thumb_up.xml') });
const unlikeIcon = Icon.select({ ios: 'hand.thumbsdown', android: require('@expo/material-symbols/thumb_down.xml') });
const shareIcon = Icon.select({ ios: 'square.and.arrow.up', android: require('@expo/material-symbols/share.xml') });
const trashIcon = Icon.select({ ios: 'trash', android: require('@expo/material-symbols/delete.xml') });
const flagIcon = Icon.select({ ios: 'flag', android: require('@expo/material-symbols/flag.xml') });
const banIcon = Icon.select({ ios: 'xmark.octagon', android: require('@expo/material-symbols/block.xml') });

interface PostOptionsButtonProps {
  post: Post;
  onLike: (id: string) => void;
}

// زر الخيارات - قائمة منسدلة أصلية للـ iOS مع خيارات الإعجاب والمشاركة والحذف
export const PostOptionsButton: React.FC<PostOptionsButtonProps> = ({ post, onLike }) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();

  const currentUser = useAuthStore((state) => state.user);
  const blockUser = useFeedStore((state) => state.blockUser);
  const reportPost = useFeedStore((state) => state.reportPost);
  const deletePost = useFeedStore((state) => state.deletePost);

  const isOwnPost = currentUser?.anonymousName === post.anonymousName;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${post.content}\n\n${t('app.share_suffix')}`,
      });
    } catch (err) {
      console.error(t('feed.publish_failed'), err);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(post.id);
      Alert.alert(t('feed.deleted'), t('feed.deleted_msg'));
    } catch (err) {
      Alert.alert(t('common.error'), t('feed.delete_failed'));
    }
  };

  const handleBlock = () => {
    Alert.alert(
      t('feed.block_user_title'),
      t('feed.block_user_msg', { name: post.anonymousName }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.block'),
          style: 'destructive',
          onPress: async () => {
            try {
              await blockUser(post.anonymousName);
              Alert.alert(t('feed.blocked'), t('feed.blocked_msg'));
            } catch {
              Alert.alert(t('common.error'), t('feed.block_failed'));
            }
          },
        },
      ]
    );
  };

  const submitReport = async (reason: string) => {
    try {
      await reportPost(post.id);
      Alert.alert(t('feed.reported'), t('feed.reported_msg', { reason }));
    } catch {
      Alert.alert(t('common.error'), t('feed.report_failed'));
    }
  };

  const handleReport = () => {
    Alert.alert(
      t('feed.report_title'),
      t('feed.report_message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('feed.report_reason_abuse'),
          style: 'destructive',
          onPress: () => submitReport(t('feed.report_reason_abuse')),
        },
        {
          text: t('feed.report_reason_sexual'),
          style: 'destructive',
          onPress: () => submitReport(t('feed.report_reason_sexual')),
        },
        {
          text: t('feed.report_reason_spam'),
          style: 'destructive',
          onPress: () => submitReport(t('feed.report_reason_spam')),
        },
        {
          text: t('feed.report_reason_misinfo'),
          style: 'destructive',
          onPress: () => submitReport(t('feed.report_reason_misinfo')),
        },
        {
          text: t('feed.report_reason_privacy'),
          style: 'destructive',
          onPress: () => submitReport(t('feed.report_reason_privacy')),
        },
      ]
    );
  };

  // بناء خيارات القائمة حسب ملكية البوست
  const actions = [
    {
      id: 'like',
      title: post.isLiked ? t('feed.context_unlike') : t('feed.context_like'),
      image: post.isLiked ? unlikeIcon : likeIcon,
    },
    {
      id: 'share',
      title: t('feed.context_share'),
      image: shareIcon,
    },
    ...(isOwnPost
      ? [
          {
            id: 'delete',
            title: t('feed.context_delete'),
            image: trashIcon,
            attributes: { destructive: true },
          },
        ]
      : [
          {
            id: 'report',
            title: t('feed.context_report'),
            image: flagIcon,
            attributes: { destructive: true },
          },
          {
            id: 'block',
            title: t('feed.context_block'),
            image: banIcon,
            attributes: { destructive: true },
          },
        ]),
  ];

  // معالجة الضغط على خيار من القائمة
  const handleAction = (eventId: string) => {
    switch (eventId) {
      case 'like':
        onLike(post.id);
        break;
      case 'share':
        handleShare();
        break;
      case 'delete':
        handleDelete();
        break;
      case 'report':
        handleReport();
        break;
      case 'block':
        handleBlock();
        break;
    }
  };

  return (
    <MenuView
      actions={actions}
      onPressAction={(e) => handleAction(e.nativeEvent.event)}
      style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }}
    >
      <Pressable
        style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons name="ellipsis-horizontal" size={16} color={colors.text.secondary} />
      </Pressable>
    </MenuView>
  );
};

interface PostBlockReportButtonsProps {
  post: Post;
}

// أزرار الإبلاغ والحظر - تظهر فقط لمنشورات الآخرين
export const PostBlockReportButtons: React.FC<PostBlockReportButtonsProps> = ({ post }) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();

  const currentUser = useAuthStore((state) => state.user);
  const blockUser = useFeedStore((state) => state.blockUser);
  const reportPost = useFeedStore((state) => state.reportPost);

  const isOwnPost = currentUser?.anonymousName === post.anonymousName;

  if (isOwnPost) return null;

  const handleBlock = () => {
    Alert.alert(
      t('feed.block_user_title'),
      t('feed.block_user_msg', { name: post.anonymousName }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.block'),
          style: 'destructive',
          onPress: async () => {
            try {
              await blockUser(post.anonymousName);
              Alert.alert(t('feed.blocked'), t('feed.blocked_msg'));
            } catch {
              Alert.alert(t('common.error'), t('feed.block_failed'));
            }
          },
        },
      ]
    );
  };

  const submitReport = async (reason: string) => {
    try {
      await reportPost(post.id);
      Alert.alert(t('feed.reported'), t('feed.reported_msg', { reason }));
    } catch {
      Alert.alert(t('common.error'), t('feed.report_failed'));
    }
  };

  const handleReport = () => {
    Alert.alert(
      t('feed.report_title'),
      t('feed.report_message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('feed.report_reason_abuse'),
          style: 'destructive',
          onPress: () => submitReport(t('feed.report_reason_abuse')),
        },
        {
          text: t('feed.report_reason_sexual'),
          style: 'destructive',
          onPress: () => submitReport(t('feed.report_reason_sexual')),
        },
        {
          text: t('feed.report_reason_spam'),
          style: 'destructive',
          onPress: () => submitReport(t('feed.report_reason_spam')),
        },
        {
          text: t('feed.report_reason_misinfo'),
          style: 'destructive',
          onPress: () => submitReport(t('feed.report_reason_misinfo')),
        },
        {
          text: t('feed.report_reason_privacy'),
          style: 'destructive',
          onPress: () => submitReport(t('feed.report_reason_privacy')),
        },
      ]
    );
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          handleBlock();
        }}
        style={({ pressed }) => [
          { padding: 4, borderRadius: 8, marginRight: 10 },
          pressed && { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)' }
        ]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="ban-outline" size={15} color="#DC2626" />
      </Pressable>

      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          handleReport();
        }}
        style={({ pressed }) => [
          { padding: 4, borderRadius: 8 },
          pressed && { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)' }
        ]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="flag-outline" size={15} color={colors.brand.gold} />
      </Pressable>
    </View>
  );
};
