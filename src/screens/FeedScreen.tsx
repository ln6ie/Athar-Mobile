import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetInfo } from '@react-native-community/netinfo';
import * as Haptics from 'expo-haptics';
import { useFeedStore } from '../store/useFeedStore';
import { useTheme } from '../hooks/useTheme';
import { PostCard } from '../components/PostCard';
import { LoadingState, EmptyState, ErrorState } from '../components/StateContainers';
import { useGlobalStyles } from '../styles/globalStyles';
import { TOKENS } from '../constants/tokens';

export const FeedScreen: React.FC = () => {
  const { 
    posts, 
    isLoading, 
    isLoadingMore, 
    isRefreshing, 
    error, 
    fetchFeed, 
    toggleLike,
    activeTab,
    setActiveTab
  } = useFeedStore();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const globalStyles = useGlobalStyles();
  const { isConnected } = useNetInfo();

  const isOffline = isConnected === false;

  useEffect(() => {
    // Initial fetch when tab changes or connection status resolves
    if (isConnected !== false) {
      const hasCache = posts.length > 0;
      fetchFeed(true, hasCache);
    }
  }, [isConnected, activeTab]);

  const handleRefresh = async () => {
    if (isConnected !== false) {
      // Light haptic vibration on refresh trigger
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      fetchFeed(true);
    }
  };

  const handleLoadMore = () => {
    if (isConnected !== false) {
      fetchFeed(false);
    }
  };

  const handleTabChange = async (tab: 'recent' | 'trending') => {
    if (activeTab === tab) return;
    
    // 1. Light haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // 2. Set active tab in Zustand
    setActiveTab(tab);
    
    // 3. Clear posts to prevent screen flash / showing old posts
    useFeedStore.setState({ posts: [], nextCursor: null });
  };

  if (isLoading && posts.length === 0) {
    return <LoadingState />;
  }

  if (error && posts.length === 0) {
    return <ErrorState message={error} onRetry={() => fetchFeed(true)} />;
  }

  const tabWrapperBg = colors.background.input;
  const activeTabBg = colors.background.default;
  const tabTextColor = colors.text.secondary;
  const activeTabTextColor = colors.brand.gold;
  const borderColor = colors.border.muted;

  return (
    <View style={globalStyles.container}>
      {/* Floating Top Tabs Container */}
      <View style={[
        styles.tabsContainer,
        { 
          paddingTop: Math.max(insets.top, 10), 
          backgroundColor: colors.background.default,
          borderBottomColor: borderColor 
        }
      ]}>
        <View style={[styles.tabsWrapper, { backgroundColor: tabWrapperBg }]}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'trending' && [styles.activeTabButton, { backgroundColor: activeTabBg }]]}
            onPress={() => handleTabChange('trending')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, { color: tabTextColor }, activeTab === 'trending' && [styles.activeTabText, { color: activeTabTextColor }]]}>
              الرائجة
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'recent' && [styles.activeTabButton, { backgroundColor: activeTabBg }]]}
            onPress={() => handleTabChange('recent')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, { color: tabTextColor }, activeTab === 'recent' && [styles.activeTabText, { color: activeTabTextColor }]]}>
              الحديثة
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Offline Banner below the floating tabs */}
      {isOffline && (
        <View style={[styles.offlineBanner, { top: insets.top + 62 }]}>
          <View style={styles.offlineIndicator} />
          <Text style={styles.offlineText}>
            أنت تتصفح في وضع عدم الاتصال بالإنترنت حالياً
          </Text>
        </View>
      )}

      {/* Cardless Clean List Feed */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard 
            post={item} 
            onLike={toggleLike} 
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: insets.top + 62 + (isOffline ? 38 : 0) }
        ]}
        refreshing={isConnected !== false && isRefreshing}
        onRefresh={isConnected !== false ? handleRefresh : undefined}
        onEndReached={isConnected !== false ? handleLoadMore : undefined}
        onEndReachedThreshold={0.2}
        ListEmptyComponent={<EmptyState />}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.loaderFooter}>
              <ActivityIndicator size="small" color={TOKENS.colors.brand.gold} />
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 12,
    zIndex: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    borderBottomWidth: 1,
  },
  tabsWrapper: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 4,
    flex: 1,
  },
  tabButton: {
    flex: 1,
    height: 38,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabButton: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3.5,
    elevation: 2,
  },
  tabText: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  activeTabText: {
    fontWeight: '700',
  },
  offlineBanner: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 38,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF3C7', // Tailwind amber-100
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A', // Tailwind amber-200
    paddingHorizontal: 16,
    zIndex: 9,
  },
  offlineIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D97706', // Tailwind amber-600
    marginHorizontal: 8,
  },
  offlineText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#92400E', // Tailwind amber-800
    letterSpacing: 0.3,
  },
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


