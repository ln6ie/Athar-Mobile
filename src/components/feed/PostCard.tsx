import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { PostOptionsButton, PostBlockReportButtons } from './PostActions';
import { LikeButton } from '../shared/LikeButton';
import { Post } from '../../types';
import { isArabicText } from '../../utils/rtl';
import { useTheme } from '../../hooks/useTheme';
import { getRemainingTimeText } from '../../utils/time';
import { useFeedStyles } from '../../styles';
import i18n from '../../constants/locales';

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
  onLongPress: (post: Post) => void;
}

// بطاقة البوست - عرض المنشور مع الاسم المجهول والوقت والنص وأزرار الإجراءات
const PostCardInner: React.FC<PostCardProps> = ({ post, onLike, onLongPress }) => {
  const isArabic = isArabicText(post.content);
  const { colors, isDark } = useTheme();
  const feedStyles = useFeedStyles();
  
  const formattedDate = new Date(post.createdAt).toLocaleTimeString(i18n.language?.startsWith('ar') ? 'ar-SA-u-nu-latn' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const expiryText = getRemainingTimeText(post.createdAt);

  return (
    <View style={feedStyles.card}>
      <Pressable
        onLongPress={() => onLongPress(post)}
        delayLongPress={350}
        style={{ width: '100%' }}
      >
        <View style={feedStyles.cardHeader}>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
            <Text style={[feedStyles.anonymousName, { marginLeft: 8 }]}>
              {post.anonymousName}
            </Text>
            <Text style={feedStyles.timeText}>
              {formattedDate}
            </Text>
          </View>
          <View style={feedStyles.headerLeft}>
            <PostOptionsButton post={post} onLike={onLike} />
          </View>
        </View>

        <Text
          style={[
            feedStyles.content,
            { textAlign: isArabic ? 'right' : 'left' },
          ]}
        >
          {post.content}
        </Text>
      </Pressable>

      <View style={[feedStyles.footer, { paddingTop: 8 }]}>
        <View style={feedStyles.likeActionsContainer}>
          <LikeButton
            isLiked={post.isLiked}
            likesCount={post.likesCount}
            onPress={() => onLike(post.id)}
            variant="card"
          />
          <View style={{ marginLeft: 16 }}>
            <PostBlockReportButtons post={post} />
          </View>
        </View>

        <Text style={feedStyles.expiryText}>
          {expiryText}
        </Text>
      </View>
    </View>
  );
};

export const PostCard = React.memo(PostCardInner, (prev, next) => {
  return (
    prev.post.id === next.post.id &&
    prev.post.likesCount === next.post.likesCount &&
    prev.post.isLiked === next.post.isLiked &&
    prev.post.content === next.post.content
  );
});
