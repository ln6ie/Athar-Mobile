import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Modal, RefreshControl, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetInfo } from '@react-native-community/netinfo';
import * as Haptics from 'expo-haptics';
import { useFeedStore } from '../store/useFeedStore';
import { useTheme } from '../hooks/useTheme';
import { PostCard } from '../components/PostCard';
import { PostCardSkeleton } from '../components/PostCardSkeleton';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { EmptyState, ErrorState } from '../components/StateContainers';
import { useGlobalStyles } from '../styles/globalStyles';
import { FlashList } from '@shopify/flash-list';
import { OfflineBanner } from '../components/OfflineBanner';
import { FeedTabsHeader } from '../components/FeedTabsHeader';
import { router } from 'expo-router';

export const FeedScreen: React.FC = () => {
  const { 
    posts, 
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
  const { colors } = useTheme();
  const globalStyles = useGlobalStyles();
  const { isConnected } = useNetInfo();

  const [modalVisible, setModalVisible] = useState(false);
  const isOffline = isConnected === false;

  // Swipe gesture detection (Optimized for RTL default behavior, completely insulated from vertical list scrolling)
  const touchStartX = React.useRef(0);
  const touchStartY = React.useRef(0);
  const touchStartTime = React.useRef(0);

  const handleTouchStart = (e: any) => {
    touchStartX.current = e.nativeEvent.pageX;
    touchStartY.current = e.nativeEvent.pageY;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e: any) => {
    if (modalVisible) return; // Prevent navigation when notification sheet is open

    const deltaX = e.nativeEvent.pageX - touchStartX.current;
    const deltaY = e.nativeEvent.pageY - touchStartY.current;
    const timeDelta = Date.now() - touchStartTime.current;

    // Strict parameters for high-precision swipe classification:
    // 1. Time must be short (< 350ms) to ensure it's a fast flick, not a drag or scroll.
    // 2. Horizontal distance must exceed the threshold (> 90px).
    // 3. The horizontal movement must be at least 3.5x the vertical drift to completely ignore vertical scrolling.
    if (timeDelta < 350 && Math.abs(deltaX) > 90 && Math.abs(deltaX) > 3.5 * Math.abs(deltaY)) {
      if (deltaX < -90) {
        // Swipe Left (finger moves right-to-left): Move to the left tab (Trending) or screen (Profile)
        if (activeTab === 'recent') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          handleTabChange('trending');
        } else if (activeTab === 'trending') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push('/profile');
        }
      } else if (deltaX > 90) {
        // Swipe Right (finger moves left-to-right): Move to the right tab (Recent)
        if (activeTab === 'trending') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          handleTabChange('recent');
        }
      }
    }
  };

  useEffect(() => {
    // Stale-While-Revalidate: render cached posts instantly. Only trigger fetch if online.
    if (isConnected === true) {
      const hasCache = posts.length > 0;
      fetchFeed(true, hasCache);
    }
  }, [isConnected, activeTab]);

  const handleRefresh = async () => {
    if (isConnected === false) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert(
        'وضع عدم الاتصال بالإنترنت',
        'أنت تتصفح الكاش المحلي حالياً. يرجى الاتصال بالإنترنت لتحديث جدار الأثر.'
      );
      useFeedStore.setState({ isRefreshing: false });
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fetchFeed(true);
  };

  const handleLoadMore = () => {
    if (isConnected === true) {
      fetchFeed(false);
    }
  };

  const handleTabChange = async (tab: 'recent' | 'trending') => {
    if (activeTab === tab) return;

    if (isConnected === false) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert(
        'وضع عدم الاتصال بالإنترنت',
        'لا يمكن تبديل الفئات أو تحديث المنشورات أثناء انقطاع الاتصال بالإنترنت.'
      );
      return;
    }
    
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
      {/* Floating Top Header Row */}
      <FeedTabsHeader
        topOffset={insets.top + 8}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        unreadLikesCount={unreadLikesCount}
        onBellPress={() => setModalVisible(true)}
      />

      {/* Offline Banner below the floating tabs */}
      {isOffline && <OfflineBanner topOffset={insets.top + 70} />}

      {/* Cardless Clean List Feed with iOS Rubber-Banding and System Blurring */}
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
          return <PostCard post={item as any} onLike={toggleLike} />;
        }}
        contentContainerStyle={[
          styles.listContent,
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
            <View style={styles.loaderFooter}>
              <ActivityIndicator size="small" color={colors.brand.gold} />
            </View>
          ) : null
        }
      />

      {/* Notification Screen Overlay */}
      <Modal
        animationType="slide"
        visible={modalVisible}
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <NotificationsScreen onClose={() => setModalVisible(false)} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 140,
  },
  loaderFooter: {
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
