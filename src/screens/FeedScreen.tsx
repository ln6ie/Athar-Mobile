import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Modal, RefreshControl, Platform, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetInfo } from '@react-native-community/netinfo';
import * as Haptics from 'expo-haptics';
import { useFeedStore } from '../store/useFeedStore';
import { useTheme } from '../hooks/useTheme';
import { PostCard } from '../components/feed/PostCard';
import { PostCardSkeleton } from '../components/feed/PostCardSkeleton';
import { PostDetailSheet } from '../components/feed/PostDetailSheet';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { EmptyState, ErrorState } from '../components/shared/StateContainers';
import { useGlobalStyles, useFeedStyles } from '../styles';
import { FlashList } from '@shopify/flash-list';
import { OfflineBanner } from '../components/shared/OfflineBanner';
import { FeedTabsHeader } from '../components/feed/FeedTabsHeader';
import { router } from 'expo-router';
import type { Post } from '../types';

const EMPTY_POSTS: Post[] = [];

// شاشة الخلاصة الرئيسية - عرض المنشورات مع دعم السحب والتنقل بين التبويبات
export const FeedScreen: React.FC = () => {
  const posts = useFeedStore((state) => state.posts[state.activeTab] ?? EMPTY_POSTS);
  const { 
    isLoading, 
    isLoadingMore, 
    isRefreshing, 
    isFetchingFeed,
    error, 
    fetchFeed, 
    toggleLike,
    activeTab,
    setActiveTab,
    unreadLikesCount
  } = useFeedStore();
  
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const globalStyles = useGlobalStyles();
  const feedStyles = useFeedStyles();
  const { isConnected } = useNetInfo();

  const [modalVisible, setModalVisible] = useState(false);
  const [activeDetailPost, setActiveDetailPost] = useState<Post | null>(null);
  const isOffline = isConnected === false;

  // بيانات اللمس للكشف عن السحب الأفقي
  const touchStartX = React.useRef(0);
  const touchStartY = React.useRef(0);
  const touchStartTime = React.useRef(0);

  const handleTouchStart = (e: any) => {
    touchStartX.current = e.nativeEvent.pageX;
    touchStartY.current = e.nativeEvent.pageY;
    touchStartTime.current = Date.now();
  };

  // معالجة انتهاء اللمس - الكشف عن السحب للتنقل بين التبويبات
  const handleTouchEnd = (e: any) => {
    if (modalVisible) return;

    const deltaX = e.nativeEvent.pageX - touchStartX.current;
    const deltaY = e.nativeEvent.pageY - touchStartY.current;
    const timeDelta = Date.now() - touchStartTime.current;

    if (timeDelta < 350 && Math.abs(deltaX) > 90 && Math.abs(deltaX) > 3.5 * Math.abs(deltaY)) {
      if (deltaX < -90) {
        if (activeTab === 'recent') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          handleTabChange('trending');
        } else if (activeTab === 'trending') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push('/profile');
        }
      } else if (deltaX > 90) {
        if (activeTab === 'trending') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          handleTabChange('recent');
        }
      }
    }
  };

  // جلب البيانات عند الاتصال بالإنترنت
  useEffect(() => {
    if (isConnected === true) {
      const hasCache = posts.length > 0;
      fetchFeed(true, hasCache);
    }
  }, [isConnected, activeTab]);

  // تحديث البيانات بالسحب لأسفل
  const handleRefresh = async () => {
    if (isConnected === false) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert(
        t('offline.title'),
        t('offline.browsing_cache')
      );
      useFeedStore.setState({ isRefreshing: false });
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fetchFeed(true);
  };

  // تحميل المزيد من المنشورات عند الوصول لنهاية القائمة
  const handleLoadMore = () => {
    if (isConnected === true) {
      fetchFeed(false);
    }
  };

  // تبديل بين تبويبات الحديثة والرائجة
  const handleTabChange = async (tab: 'recent' | 'trending') => {
    if (activeTab === tab) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
  };

  if (error && posts.length === 0) {
    return <ErrorState message={error} onRetry={() => fetchFeed(true)} />;
  }

  const isSkeletonLoading = (isLoading || isFetchingFeed) && posts.length === 0;
  const dummySkeletons = Array.from({ length: 6 }, (_, i) => ({ id: `skeleton-${i}` }));
  const listData = isSkeletonLoading ? dummySkeletons : posts;

  const topPadding = insets.top + 74 + (isOffline ? 38 : 0);

  return (
    <View 
      style={globalStyles.container}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <FeedTabsHeader
        topOffset={insets.top + 8}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        unreadLikesCount={unreadLikesCount}
        onBellPress={() => setModalVisible(true)}
      />

      {isOffline && <OfflineBanner topOffset={insets.top + 70} />}

      <FlashList
        data={listData}
        keyExtractor={(item) => item.id}
        bounces={true}
        overScrollMode="never"
        contentInsetAdjustmentBehavior="automatic"
        renderItem={({ item }) => {
          if (isSkeletonLoading) {
            return <PostCardSkeleton />;
          }
          return <PostCard post={item as any} onLike={toggleLike} onLongPress={setActiveDetailPost} />;
        }}
        contentContainerStyle={[
          feedStyles.feedListContent,
          Platform.OS === 'android' ? { paddingTop: topPadding } : undefined
        ]}
        contentInset={Platform.OS === 'ios' ? { top: topPadding } : undefined}
        contentOffset={Platform.OS === 'ios' ? { x: 0, y: -topPadding } : undefined}
        automaticallyAdjustContentInsets={false}
        refreshControl={
          isConnected === true ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              progressViewOffset={Platform.OS === 'android' ? insets.top + 60 : undefined}
              tintColor={colors.brand.gold}
              colors={[colors.brand.gold]}
            />
          ) : undefined
        }
        onEndReached={isConnected === true ? handleLoadMore : undefined}
        onEndReachedThreshold={0.2}
        ListEmptyComponent={isSkeletonLoading ? null : <EmptyState />}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={feedStyles.loaderFooter}>
              <ActivityIndicator size="small" color={colors.brand.gold} />
            </View>
          ) : null
        }
      />

      <Modal
        animationType="slide"
        visible={modalVisible}
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <NotificationsScreen onClose={() => setModalVisible(false)} />
      </Modal>

      <PostDetailSheet
        visible={!!activeDetailPost}
        post={activeDetailPost}
        onClose={() => setActiveDetailPost(null)}
        onLike={toggleLike}
      />
    </View>
  );
};
