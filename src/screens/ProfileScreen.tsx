import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/useAuthStore';
import { useFeedStore } from '../store/useFeedStore';
import { useTheme } from '../hooks/useTheme';
import { PostCard } from '../components/PostCard';
import { globalStyles } from '../styles/globalStyles';
import { ChangeEmailSubScreen } from '../components/ChangeEmailSubScreen';
import { SupportSubScreen } from '../components/SupportSubScreen';
import { AboutSubScreen } from '../components/AboutSubScreen';
import { PrivacySubScreen } from '../components/PrivacySubScreen';
import { AnonymousAvatar } from '../components/AnonymousAvatar';
import { ThemeSelector } from '../components/ThemeSelector';
import { useProfileStyles } from '../styles/ProfileStyles';

export const ProfileScreen: React.FC = () => {
  const { user, logout, deleteAccount } = useAuthStore();
  const { posts, toggleLike } = useFeedStore();
  const { colors } = useTheme();
  const styles = useProfileStyles();
  const [activeSubScreen, setActiveSubScreen] = useState<'main' | 'change-email' | 'support' | 'about' | 'privacy'>('main');
  const [activeTab, setActiveTab] = useState<'my-posts' | 'likes'>('my-posts');
  const insets = useSafeAreaInsets();

  const userEmail = user?.email || 'user@athar.app';
  const anonymousName = user?.anonymousName || 'مستكشف-مجهول-100';

  const myPosts = posts.filter((post) => post.anonymousName === anonymousName);
  const likedPosts = posts.filter((post) => post.isLiked);
  const displayedPosts = activeTab === 'my-posts' ? myPosts : likedPosts;
  const userTitle = likedPosts.length >= 5 ? 'مكتشف أثر نشط' : 'مستكشف أثر جديد';

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
      <FlatList
        data={displayedPosts}
        keyExtractor={(item) => `profile-${item.id}`}
        renderItem={({ item }) => (
          <PostCard post={item} onLike={toggleLike} />
        )}
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
                  <Text style={styles.profileName}>{anonymousName}</Text>
                  
                  <View style={styles.profileMetaRow}>
                    <Text style={styles.profileTitle}>{userTitle}</Text>
                    
                    <View style={styles.inlineStatsBox}>
                      <Text style={styles.statVal}>{myPosts.length}</Text>
                      <Text style={styles.statLabel}>أثر منشور</Text>
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
                    <View style={styles.emailIconBody} />
                    <View style={styles.emailIconFlapLeft} />
                    <View style={styles.emailIconFlapRight} />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionRow} onPress={() => setActiveSubScreen('support')}>
                <Text style={styles.chevron}>‹</Text>
                <View style={styles.optionRightContainer}>
                  <Text style={styles.optionLabel}>مراسلة الدعم الفني</Text>
                  <View style={styles.optionIconWrapper}>
                    <View style={styles.supportIconBubble}>
                      <View style={styles.supportIconTail} />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionRow} onPress={() => setActiveSubScreen('privacy')}>
                <Text style={styles.chevron}>‹</Text>
                <View style={styles.optionRightContainer}>
                  <Text style={styles.optionLabel}>سياسة الخصوصية</Text>
                  <View style={styles.optionIconWrapper}>
                    <View style={styles.shieldIconContainer}>
                      <View style={styles.shieldIconShape} />
                      <View style={styles.shieldIconLine} />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionRow} onPress={() => setActiveSubScreen('about')}>
                <Text style={styles.chevron}>‹</Text>
                <View style={styles.optionRightContainer}>
                  <Text style={styles.optionLabel}>عن التطبيق والفكرة</Text>
                  <View style={styles.optionIconWrapper}>
                    <View style={styles.infoIconCircle}>
                      <View style={styles.infoIconDot} />
                      <View style={styles.infoIconLine} />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionRow} onPress={handleLogout}>
                <Text style={styles.chevronRed}>‹</Text>
                <View style={styles.optionRightContainer}>
                  <Text style={styles.optionLabelRed}>تسجيل الخروج</Text>
                  <View style={styles.optionIconWrapper}>
                    <View style={styles.logoutIconContainer}>
                      <View style={styles.logoutIconDoor} />
                      <View style={styles.logoutIconArrowStem} />
                      <View style={styles.logoutIconArrowHeadTop} />
                      <View style={styles.logoutIconArrowHeadBottom} />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionRow} onPress={handleDeleteAccount}>
                <Text style={styles.chevronRed}>‹</Text>
                <View style={styles.optionRightContainer}>
                  <Text style={styles.optionLabelRed}>حذف الحساب بشكل نهائي</Text>
                  <View style={styles.optionIconWrapper}>
                    <View style={styles.deleteIconContainer}>
                      <View style={styles.deleteIconLid} />
                      <View style={styles.deleteIconCan} />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              <ThemeSelector minimal />
            </View>

            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tabToggle, activeTab === 'my-posts' && styles.tabToggleActive]}
                onPress={() => setActiveTab('my-posts')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabToggleText, activeTab === 'my-posts' && styles.tabToggleTextActive]}>
                  آثاري
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabToggle, activeTab === 'likes' && styles.tabToggleActive]}
                onPress={() => setActiveTab('likes')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabToggleText, activeTab === 'likes' && styles.tabToggleTextActive]}>
                  المفضلة
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        ListEmptyComponent={
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
        }
      />

      {activeSubScreen !== 'main' && (
        <Modal visible animationType="slide" presentationStyle="fullScreen" statusBarTranslucent onRequestClose={() => setActiveSubScreen('main')}>
          {activeSubScreen === 'change-email' && <ChangeEmailSubScreen currentEmail={userEmail} onBack={() => setActiveSubScreen('main')} />}
          {activeSubScreen === 'support' && <SupportSubScreen currentEmail={userEmail} onBack={() => setActiveSubScreen('main')} />}
          {activeSubScreen === 'privacy' && <PrivacySubScreen onBack={() => setActiveSubScreen('main')} />}
          {activeSubScreen === 'about' && <AboutSubScreen onBack={() => setActiveSubScreen('main')} />}
        </Modal>
      )}
    </View>
  );
};


