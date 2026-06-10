import React, { useState, useEffect } from 'react';
import { View, Text, Alert, Modal, StyleSheet, RefreshControl, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/useAuthStore';
import { useFeedStore } from '../store/useFeedStore';
import { useTheme } from '../hooks/useTheme';
import { PostCard } from '../components/feed/PostCard';
import { PostCardSkeleton } from '../components/feed/PostCardSkeleton';
import { PostDetailSheet } from '../components/feed/PostDetailSheet';
import { Post } from '../types';
import { globalStyles } from '../styles/globalStyles';
import { ChangeEmailSubScreen } from '../components/profile/ChangeEmailSubScreen';
import { SupportSubScreen } from '../components/profile/SupportSubScreen';
import { AboutSubScreen } from '../components/profile/AboutSubScreen';
import { PrivacySubScreen } from '../components/profile/PrivacySubScreen';
import { BlockedUsersSubScreen } from '../components/profile/BlockedUsersSubScreen';
import { MyReportsSubScreen } from '../components/profile/MyReportsSubScreen';
import { ThemeSubScreen } from '../components/profile/ThemeSubScreen';
import { useProfileStyles } from '../styles/ProfileStyles';
import { GlassicView } from '../components/shared/GlassicView';
import { ProfileHeaderCard } from '../components/profile/ProfileHeaderCard';
import { ProfileOptionsCard } from '../components/profile/ProfileOptionsCard';
import { UserInfoModal } from '../components/profile/UserInfoModal';
import { BouncyPressable } from '../components/shared/BouncyPressable';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';


// شاشة الملف الشخصي - عرض المنشورات والإعدادات والتنقل بين الشاشات الفرعية
export const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, deleteAccount } = useAuthStore();
  const { 
    myPosts, 
    likedPosts, 
    toggleLike, 
    isLoadingMyPosts, 
    isLoadingLikedPosts, 
    fetchMyPosts, 
    fetchLikedPosts 
  } = useFeedStore();
  
  const { colors } = useTheme();
  const styles = useProfileStyles();
  
  // الشاشة الفرعية النشطة (البريد، الدعم، الخصوصية، إلخ)
  const [activeSubScreen, setActiveSubScreen] = useState<'main' | 'change-email' | 'support' | 'about' | 'privacy' | 'blocked-users' | 'reports' | 'theme'>('main');
  const [activeTab, setActiveTab] = useState<'my-posts' | 'likes'>('my-posts');
  const [userInfoVisible, setUserInfoVisible] = useState(false);
  const [activeDetailPost, setActiveDetailPost] = useState<Post | null>(null);
  const insets = useSafeAreaInsets();
  const topPadding = insets.top;

  // كشف السحب الأفقي للعودة لشاشة الخلاصة
  const touchStartX = React.useRef(0);
  const touchStartY = React.useRef(0);
  const touchStartTime = React.useRef(0);

  const handleTouchStart = (e: any) => {
    touchStartX.current = e.nativeEvent.pageX;
    touchStartY.current = e.nativeEvent.pageY;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e: any) => {
    if (activeSubScreen !== 'main') return; // منع السحب داخل الشاشات الفرعية

    const deltaX = e.nativeEvent.pageX - touchStartX.current;
    const deltaY = e.nativeEvent.pageY - touchStartY.current;
    const timeDelta = Date.now() - touchStartTime.current;

    // معايير دقيقة لتصنيف السحب:
    // 1. وقت قصير (<350ms) لضمان أنها نبشة سريعة
    // 2. مسافة أفقية كافية (>90px)
    // 3. الحركة الأفقية 3.5x أضعاف الرأسية لتجاهل التمرير
    if (timeDelta < 350 && Math.abs(deltaX) > 90 && Math.abs(deltaX) > 3.5 * Math.abs(deltaY)) {
      if (deltaX > 90) {
        // سحب لليمين: الانتقال لشاشة الخلاصة
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push('/feed');
      }
    }
  };

  // تأثير السلايدر للتبديل بين التبويبات
  const tabContainerWidth = useSharedValue(0);
  const tabTranslation = useSharedValue(activeTab === 'my-posts' ? 0 : -150);

  // تحديث موضع السلايدر عند تبديل التبويب
  const updateTabPosition = () => {
    'worklet';
    if (tabContainerWidth.value <= 0) return;
    const buttonWidth = (tabContainerWidth.value - 8) / 2; // هامش 8px (4px لكل جانب)
    // RTL: "my-posts" الفهرس 0 (يمين)، "likes" الفهرس 1 (يسار)
    tabTranslation.value = withSpring(
      activeTab === 'my-posts' ? 0 : -buttonWidth,
      { damping: 15, stiffness: 150, mass: 0.6 }
    );
  };

  useEffect(() => {
    updateTabPosition();
  }, [activeTab]);

  const onTabContainerLayout = (e: any) => {
    tabContainerWidth.value = e.nativeEvent.layout.width;
    updateTabPosition();
  };

  const tabSliderAnimatedStyle = useAnimatedStyle(() => {
    const buttonWidth = tabContainerWidth.value > 0 ? (tabContainerWidth.value - 8) / 2 : 150;
    return {
      width: buttonWidth,
      transform: [{ translateX: tabTranslation.value }],
    };
  });

  const userEmail = user?.email || 'user@athar.app';
  const anonymousName = user?.anonymousName || t('profile.anonymous_fallback');

  useEffect(() => {
    fetchMyPosts();
    fetchLikedPosts();
  }, []);

  const displayedPosts = activeTab === 'my-posts' ? myPosts : likedPosts;
  const isSkeletonLoading = activeTab === 'my-posts' 
    ? isLoadingMyPosts && myPosts.length === 0 
    : isLoadingLikedPosts && likedPosts.length === 0;

  const dummySkeletons = Array.from({ length: 3 }, (_, i) => ({ id: `profile-skeleton-${i}` }));
  const displayedData = isSkeletonLoading ? dummySkeletons : displayedPosts;

  const handleLogout = () => {
    Alert.alert(
      t('profile.logout_confirm_title'),
      t('profile.logout_confirm_msg'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('profile.logout_button'), style: 'destructive', onPress: logout },
      ],
      { cancelable: true }
    );
  };

  // تأكيد حذف الحساب نهائياً
  const handleDeleteAccount = () => {
    Alert.alert(
      t('profile.delete_confirm_title'),
      t('profile.delete_confirm_msg'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.delete_confirm_button'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
            } catch (err) {
              Alert.alert(t('common.error'), t('profile.delete_failed'));
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View 
      style={[globalStyles.container, { backgroundColor: colors.background.default }]}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <FlashList
        data={displayedData}
        keyExtractor={(item) => `profile-${item.id}`}
        refreshControl={
          <RefreshControl
            refreshing={activeTab === 'my-posts' ? isLoadingMyPosts : isLoadingLikedPosts}
            onRefresh={() => {
              if (activeTab === 'my-posts') {
                fetchMyPosts();
              } else {
                fetchLikedPosts();
              }
            }}
            tintColor={colors.brand.gold}
            colors={[colors.brand.gold]}
            progressViewOffset={Platform.OS === 'android' ? insets.top + 60 : undefined}
          />
        }
        renderItem={({ item }) => {
          if (isSkeletonLoading) {
            return (
              <View style={{ paddingHorizontal: 12 }}>
                <PostCardSkeleton />
              </View>
            );
          }
          return (
            <View style={{ paddingHorizontal: 12 }}>
              <PostCard post={item as any} onLike={toggleLike} onLongPress={setActiveDetailPost} />
            </View>
          );
        }}
        contentContainerStyle={{
          paddingTop: Platform.OS === 'android' ? topPadding : 0,
          paddingBottom: 140,
          paddingHorizontal: 0,
        }}
        contentInset={Platform.OS === 'ios' ? { top: topPadding } : undefined}
        contentOffset={Platform.OS === 'ios' ? { x: 0, y: -topPadding } : undefined}
        automaticallyAdjustContentInsets={false}
        ListHeaderComponent={
          <View>
            {/* بطاقة رأس الملف الشخصي */}
            <ProfileHeaderCard
              anonymousName={anonymousName}
              userEmail={userEmail}
              postsCount={myPosts.length}
              onPress={() => setUserInfoVisible(true)}
            />

            <View style={{ paddingHorizontal: 24 }}>
              {/* بطاقة خيارات الملف الشخصي */}
              <ProfileOptionsCard
                onSubScreenNavigate={(screen) => setActiveSubScreen(screen)}
                onLogout={handleLogout}
                onDeleteAccount={handleDeleteAccount}
              />

              {/* شريط تبديل التبويبات منشوراتي/المفضلة */}
              <GlassicView
                cornerRadius={24}
                style={styles.tabContainer}
              >
                <View
                  style={[StyleSheet.absoluteFill, { flexDirection: 'row-reverse', padding: 4 }]}
                  onLayout={onTabContainerLayout}
                  pointerEvents="box-none"
                >
                  <Animated.View
                    style={[
                      styles.tabToggleActive,
                      {
                        position: 'absolute',
                        right: 4,
                        top: 4,
                        height: 36,
                        zIndex: 1,
                      },
                      tabSliderAnimatedStyle,
                    ]}
                  />
                </View>

                <BouncyPressable
                  style={[styles.tabToggle, { zIndex: 2 }]}
                  onPress={() => {
                    setActiveTab('my-posts');
                    fetchMyPosts();
                  }}
                >
                  <Text style={[styles.tabToggleText, activeTab === 'my-posts' && styles.tabToggleTextActive]}>
                    {t('profile.my_posts')}
                  </Text>
                </BouncyPressable>

                <BouncyPressable
                  style={[styles.tabToggle, { zIndex: 2 }]}
                  onPress={() => {
                    setActiveTab('likes');
                    fetchLikedPosts();
                  }}
                >
                  <Text style={[styles.tabToggleText, activeTab === 'likes' && styles.tabToggleTextActive]}>
                    {t('profile.favorites')}
                  </Text>
                </BouncyPressable>
              </GlassicView>
            </View>

          </View>
        }
        ListEmptyComponent={
          isSkeletonLoading ? null : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <View style={styles.emptyIconDot} />
              </View>
              <Text style={styles.emptyTitle}>
                {activeTab === 'my-posts' ? t('profile.empty_posts') : t('profile.empty_favorites')}
              </Text>
              <Text style={styles.emptyDescription}>
                {activeTab === 'my-posts'
                  ? t('profile.empty_posts_hint')
                  : t('profile.empty_favorites_hint')}
              </Text>
            </View>
          )
        }
      />

      {activeSubScreen !== 'main' && (
        <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setActiveSubScreen('main')}>
          {activeSubScreen === 'change-email' && <ChangeEmailSubScreen currentEmail={userEmail} onBack={() => setActiveSubScreen('main')} />}
          {activeSubScreen === 'support' && <SupportSubScreen currentEmail={userEmail} onBack={() => setActiveSubScreen('main')} />}
          {activeSubScreen === 'privacy' && <PrivacySubScreen onBack={() => setActiveSubScreen('main')} />}
          {activeSubScreen === 'about' && <AboutSubScreen onBack={() => setActiveSubScreen('main')} />}
          {activeSubScreen === 'blocked-users' && <BlockedUsersSubScreen onBack={() => setActiveSubScreen('main')} />}
          {activeSubScreen === 'reports' && <MyReportsSubScreen onBack={() => setActiveSubScreen('main')} />}
          {activeSubScreen === 'theme' && <ThemeSubScreen onBack={() => setActiveSubScreen('main')} />}
        </Modal>
      )}

      {/* شاشة معلومات المستخدم المنبثقة */}
      <UserInfoModal
        visible={userInfoVisible}
        onClose={() => setUserInfoVisible(false)}
        anonymousName={anonymousName}
        userEmail={userEmail}
        postsCount={myPosts.length}
      />

      <PostDetailSheet
        visible={!!activeDetailPost}
        post={activeDetailPost}
        onClose={() => setActiveDetailPost(null)}
        onLike={toggleLike}
      />
    </View>
  );
};
