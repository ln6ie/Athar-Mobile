import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Animated, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetInfo } from '@react-native-community/netinfo';
import { useFeedStore } from '../store/useFeedStore';
import { useTheme } from '../hooks/useTheme';
import { PostCard } from '../components/PostCard';
import { Header } from '../components/Header';
import { LoadingState, EmptyState, ErrorState } from '../components/StateContainers';
import { useGlobalStyles } from '../styles/globalStyles';
import { TOKENS } from '../constants/tokens';

export const FeedScreen: React.FC = () => {
  const { posts, isLoading, isLoadingMore, isRefreshing, error, fetchFeed, toggleLike } = useFeedStore();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const globalStyles = useGlobalStyles();
  const { isConnected } = useNetInfo();

  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const [headerVisible, setHeaderVisible] = useState(true);

  const isOffline = isConnected === false;

  useEffect(() => {
    // Silent fetch only if connected and online state changes
    if (isConnected !== false) {
      const hasCache = posts.length > 0;
      fetchFeed(true, hasCache);
    }
  }, [isConnected]);

  const handleRefresh = () => {
    if (isConnected !== false) {
      fetchFeed(true);
    }
  };

  const handleLoadMore = () => {
    if (isConnected !== false) {
      fetchFeed(false);
    }
  };

  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const diff = currentOffset - lastScrollY.current;

    if (currentOffset > 80) {
      if (diff > 10 && headerVisible) {
        setHeaderVisible(false);
        Animated.timing(headerTranslateY, {
          toValue: -130, // Hide header by sliding up past safearea
          duration: 250,
          useNativeDriver: true,
        }).start();
      } else if (diff < -15 && !headerVisible) {
        setHeaderVisible(true);
        Animated.timing(headerTranslateY, {
          toValue: 0, // Show header by sliding back down
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    } else if (currentOffset <= 20 && !headerVisible) {
      setHeaderVisible(true);
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }

    lastScrollY.current = currentOffset;
  };

  if (isLoading && posts.length === 0) {
    return <LoadingState />;
  }

  if (error && posts.length === 0) {
    return <ErrorState message={error} onRetry={() => fetchFeed(true)} />;
  }

  return (
    <View style={globalStyles.container}>
      {/* Reusable premium top header enclosed in slide animation view */}
      <Animated.View style={[
        styles.animatedHeader,
        { transform: [{ translateY: headerTranslateY }], backgroundColor: colors.background.default }
      ]}>
        <Header />
        {isOffline && (
          <View style={[styles.offlineBanner, { backgroundColor: 'rgba(212, 175, 55, 0.12)', borderBottomColor: 'rgba(212, 175, 55, 0.2)' }]}>
            <Text style={styles.offlineText}>
              أنت تتصفح في وضع عدم الاتصال
            </Text>
          </View>
        )}
      </Animated.View>


      {/* Cardless Clean List Feed with custom scroll responsive event */}
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
          { paddingTop: insets.top + 56 + (isOffline ? 32 : 0) }
        ]}
        refreshing={isConnected !== false && isRefreshing}
        onRefresh={isConnected !== false ? handleRefresh : undefined}
        onEndReached={isConnected !== false ? handleLoadMore : undefined}
        onEndReachedThreshold={0.2}
        onScroll={handleScroll}
        scrollEventThrottle={16}
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
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#FFFFFF',
  },
  offlineBanner: {
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    width: '100%',
  },
  offlineText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#B8860B',
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


