import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal } from 'react-native';
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
import { AnonymousAvatar } from '../components/AnonymousAvatar';
import { ThemeSelector } from '../components/ThemeSelector';
import { useProfileStyles } from '../styles/ProfileStyles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GlassicView } from '../components/GlassicView';

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
            <View style={styles.profileHeaderCard}>
              <View style={styles.profileMainRow}>
                <View style={{ marginLeft: 16 }}>
                  <AnonymousAvatar size={72} />
                </View>

                <View style={styles.profileInfoColumn}>
                  <Text style={styles.profileName} numberOfLines={1} ellipsizeMode="tail">
                    {anonymousName}
                  </Text>
                  
                  <View style={styles.profileMetaRow}>
                    <View style={styles.inlineStatsBox}>
                      <Text style={styles.statVal}>{myPosts.length}</Text>
                      <Text style={styles.statLabel}>منشور</Text>
                    </View>
                  </View>

                  <Text style={styles.profileEmail}>{userEmail}</Text>
                </View>
              </View>
            </View>
            <View style={styles.optionsCard}>
              <Text style={styles.optionsTitle}>إعدادات الحساب والدعم</Text>
              
              <TouchableOpacity style={styles.optionRow} onPress={() => setActiveSubScreen('change-email')}>
                <Text style={styles.chevron}>‹</Text>
                <View style={styles.optionRightContainer}>
                  <Text style={styles.optionLabel}>تغيير البريد الإلكتروني</Text>
                  <View style={styles.optionIconWrapper}>
                    <Ionicons name="mail" size={20} color={colors.brand.gold} />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionRow} onPress={() => setActiveSubScreen('blocked-users')}>
                <Text style={styles.chevron}>‹</Text>
                <View style={styles.optionRightContainer}>
                  <Text style={styles.optionLabel}>المستخدمون المحظورون</Text>
                  <View style={styles.optionIconWrapper}>
                    <Ionicons name="ban" size={20} color={colors.brand.gold} />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionRow} onPress={() => setActiveSubScreen('support')}>
                <Text style={styles.chevron}>‹</Text>
                <View style={styles.optionRightContainer}>
                  <Text style={styles.optionLabel}>مراسلة الدعم الفني</Text>
                  <View style={styles.optionIconWrapper}>
                    <Ionicons name="chatbubbles" size={20} color={colors.brand.gold} />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionRow} onPress={() => setActiveSubScreen('privacy')}>
                <Text style={styles.chevron}>‹</Text>
                <View style={styles.optionRightContainer}>
                  <Text style={styles.optionLabel}>سياسة الخصوصية</Text>
                  <View style={styles.optionIconWrapper}>
                    <Ionicons name="shield-checkmark" size={20} color={colors.brand.gold} />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionRow} onPress={() => setActiveSubScreen('about')}>
                <Text style={styles.chevron}>‹</Text>
                <View style={styles.optionRightContainer}>
                  <Text style={styles.optionLabel}>عن التطبيق والفكرة</Text>
                  <View style={styles.optionIconWrapper}>
                    <Ionicons name="information-circle" size={20} color={colors.brand.gold} />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionRow} onPress={handleLogout}>
                <Text style={styles.chevronRed}>‹</Text>
                <View style={styles.optionRightContainer}>
                  <Text style={styles.optionLabelRed}>تسجيل الخروج</Text>
                  <View style={styles.optionIconWrapper}>
                    <Ionicons name="log-out" size={20} color="#DC2626" />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.optionRow, styles.lastOptionRow]} onPress={handleDeleteAccount}>
                <Text style={styles.chevronRed}>‹</Text>
                <View style={styles.optionRightContainer}>
                  <Text style={styles.optionLabelRed}>حذف الحساب بشكل نهائي</Text>
                  <View style={styles.optionIconWrapper}>
                    <Ionicons name="trash" size={20} color="#DC2626" />
                  </View>
                </View>
              </TouchableOpacity>

            </View>

            <ThemeSelector />

            <GlassicView
              cornerRadius={20}
              style={styles.tabContainer}
            >
              <TouchableOpacity
                style={[styles.tabToggle, activeTab === 'my-posts' && styles.tabToggleActive]}
                onPress={() => {
                  setActiveTab('my-posts');
                  fetchMyPosts();
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabToggleText, activeTab === 'my-posts' && styles.tabToggleTextActive]}>
                  منشوراتي
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabToggle, activeTab === 'likes' && styles.tabToggleActive]}
                onPress={() => {
                  setActiveTab('likes');
                  fetchLikedPosts();
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabToggleText, activeTab === 'likes' && styles.tabToggleTextActive]}>
                  المفضلة
                </Text>
              </TouchableOpacity>
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


