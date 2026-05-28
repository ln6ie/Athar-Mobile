import React, { useState, useEffect } from 'react';
import { View, Text, Alert, Modal, StyleSheet } from 'react-native';
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
import { PostCard } from '../components/PostCard';
import { PostCardSkeleton } from '../components/PostCardSkeleton';
import { globalStyles } from '../styles/globalStyles';
import { ChangeEmailSubScreen } from '../components/ChangeEmailSubScreen';
import { SupportSubScreen } from '../components/SupportSubScreen';
import { AboutSubScreen } from '../components/AboutSubScreen';
import { PrivacySubScreen } from '../components/PrivacySubScreen';
import { BlockedUsersSubScreen } from '../components/BlockedUsersSubScreen';
import { ThemeSelector } from '../components/ThemeSelector';
import { useProfileStyles } from '../styles/ProfileStyles';
import { GlassicView } from '../components/GlassicView';
import { ProfileHeaderCard } from '../components/ProfileHeaderCard';
import { ProfileOptionsCard } from '../components/ProfileOptionsCard';
import { BouncyPressable } from '../components/BouncyPressable';


export const ProfileScreen: React.FC = () => {
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
  
  const [activeSubScreen, setActiveSubScreen] = useState<'main' | 'change-email' | 'support' | 'about' | 'privacy' | 'blocked-users'>('main');
  const [activeTab, setActiveTab] = useState<'my-posts' | 'likes'>('my-posts');
  const insets = useSafeAreaInsets();

  // Dynamic layout measurements for Profile active tab spring slide
  const tabContainerWidth = useSharedValue(0);
  const tabTranslation = useSharedValue(0);

  const updateTabPosition = () => {
    'worklet';
    if (tabContainerWidth.value === 0) return;
    const buttonWidth = (tabContainerWidth.value - 8) / 2; // total padding of 8px (4px on each side)
    // In RTL, "my-posts" is index 0 (right), "likes" is index 1 (left, moving negative buttonWidth)
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
  const anonymousName = user?.anonymousName || 'مستكشف-مجهول-100';

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
      'تأكيد تسجيل الخروج',
      'هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'تسجيل الخروج', style: 'destructive', onPress: logout },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'تأكيد حذف الحساب',
      'هل أنت متأكد من رغبتك في حذف حسابك نهائياً؟ سيتم حذف جميع بياناتك ومنشوراتك بالكامل ولا يمكن التراجع عن هذا الإجراء.',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'نعم، احذف حسابي',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
            } catch (err) {
              Alert.alert('خطأ', 'تعذر حذف الحساب حالياً. يرجى المحاولة لاحقاً.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={[globalStyles.container, { backgroundColor: colors.background.default }]}>
      <FlashList
        data={displayedData}
        keyExtractor={(item) => `profile-${item.id}`}
        onRefresh={() => {
          if (activeTab === 'my-posts') {
            fetchMyPosts();
          } else {
            fetchLikedPosts();
          }
        }}
        refreshing={activeTab === 'my-posts' ? isLoadingMyPosts : isLoadingLikedPosts}
        renderItem={({ item }) => {
          if (isSkeletonLoading) {
            return <PostCardSkeleton />;
          }
          return <PostCard post={item as any} onLike={toggleLike} />;
        }}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: Math.max(insets.top, 24) }
        ]}
        ListHeaderComponent={
          <View>
            {/* Native Dynamic iOS 26 Material Header Card */}
            <ProfileHeaderCard
              anonymousName={anonymousName}
              userEmail={userEmail}
              postsCount={myPosts.length}
            />

            {/* Native Dynamic iOS 26 Material Options Card */}
            <ProfileOptionsCard
              onSubScreenNavigate={(screen) => setActiveSubScreen(screen)}
              onLogout={handleLogout}
              onDeleteAccount={handleDeleteAccount}
            />

            <ThemeSelector />

            {/* Segment Toggle Tab Bar */}
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
                  منشوراتي
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
                  المفضلة
                </Text>
              </BouncyPressable>
            </GlassicView>

          </View>
        }
        ListEmptyComponent={
          isSkeletonLoading ? null : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <View style={styles.emptyIconDot} />
              </View>
              <Text style={styles.emptyTitle}>
                {activeTab === 'my-posts' ? 'لم تنشر أي أثر بعد' : 'لا توجد آثار مفضلة'}
              </Text>
              <Text style={styles.emptyDescription}>
                {activeTab === 'my-posts'
                  ? 'ابدأ بمشاركة خواطرك وأفكارك من خلال زر الإضافة السفلي، ودع أثرك يمر بسلام عبر الفضاء الرقمي.'
                  : 'الأشياء الجميلة تستحق التقدير. تصفح جدار الأثر وقم بالإعجاب بالأفكار التي تلامس قلبك لتظهر هنا في ملفك الشخصي.'}
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
        </Modal>
      )}
    </View>
  );
};
