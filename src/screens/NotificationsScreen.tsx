import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFeedStore } from '../store/useFeedStore';
import { AnonymousAvatar } from '../components/AnonymousAvatar';
import { TOKENS } from '../constants/tokens';
import { useTheme } from '../hooks/useTheme';
import { Logo } from '../components/Logo';
import { GlassicView } from '../components/GlassicView';
import { BouncyPressable } from '../components/BouncyPressable';
import { SymbolView } from 'expo-symbols';


interface NotificationsScreenProps {
  onClose: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onClose }) => {
  const { colors } = useTheme();
  const { notifications, isLoadingNotifications, notificationsError, fetchNotifications } = useFeedStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatNotificationTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.default }]}>
      {/* Local custom sub-header styled exactly like the unified Header */}
      <View style={[styles.localHeaderContainer, { 
        paddingTop: Math.max(insets.top, 10), 
        backgroundColor: colors.background.default, 
      }]}>
        <View style={styles.localHeader}>
          {/* Left Side: Native iOS Circular Glass Close Button (Perfect for Arabic RTL) */}
          <View style={styles.leftContainer}>
            <GlassicView
              cornerRadius={14}
              style={styles.circularCloseButton}
            >
              <BouncyPressable
                onPress={onClose}
                style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
              >
                <SymbolView
                  name={{ ios: 'xmark', android: 'close' }}
                  size={11}
                  tintColor={colors.text.secondary}
                />
              </BouncyPressable>
            </GlassicView>
          </View>
          
          {/* Center: Title */}
          <View style={styles.titleContainer}>
            <Text style={[styles.titleText, { color: colors.text.primary }]}>الاشعارات والتنبيهات</Text>
          </View>
          
          {/* Right Side: Empty placeholder */}
          <View style={styles.rightContainer}>
            <View style={styles.placeholder} />
          </View>
        </View>
      </View>

      {isLoadingNotifications && notifications.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.brand.gold} />
          <Text style={[styles.stateText, { color: colors.text.secondary }]}>جاري تحميل التنبيهات...</Text>
        </View>
      ) : notificationsError ? (
        <View style={styles.centerContainer}>
          <View style={[styles.errorCard, { backgroundColor: colors.background.input, borderColor: colors.feedback.error }]}>
            <Text style={[styles.errorText, { color: colors.feedback.error }]}>{notificationsError}</Text>
          </View>
          <TouchableOpacity onPress={fetchNotifications} style={[styles.retryButton, { backgroundColor: colors.brand.gold }]} activeOpacity={0.8}>
            <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.centerContainer}>
          <View style={styles.concentricContainer}>
            <Logo size={90} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>لا توجد تنبيهات جديدة</Text>
          <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
          </Text>
        </View>
      ) : (
        <FlashList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.notificationCard, { borderBottomColor: colors.border.muted }]}>
              <View style={styles.avatarWrapper}>
                <AnonymousAvatar size={42} />
              </View>
              
              <View style={styles.contentWrapper}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.likerName, { color: colors.brand.gold }]}>{item.likerName}</Text>
                  <Text style={[styles.timeText, { color: colors.text.disabled }]}>
                    {formatNotificationTime(item.createdAt)}
                  </Text>
                </View>
                
                <Text style={[styles.notificationText, { color: colors.text.secondary }]}>أعجب بالأثر الذي تركته:</Text>
                
                <View style={[styles.postContentBox, { backgroundColor: colors.background.input, borderColor: colors.border.muted }]}>
                  <Text style={[styles.postContentText, { color: colors.text.primary }]} numberOfLines={2}>
                    {item.post.content}
                  </Text>
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          onRefresh={fetchNotifications}
          refreshing={isLoadingNotifications}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  stateText: { marginTop: 16, fontSize: 13, fontWeight: 'bold' },
  errorCard: { borderWidth: 1, borderRadius: TOKENS.borderRadius.lg, padding: 16, marginBottom: 20, width: '100%' },
  errorText: { fontSize: 13, textAlign: 'center', lineHeight: 20, fontWeight: '600' },
  retryButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: TOKENS.borderRadius.lg },
  retryButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  concentricContainer: { justifyContent: 'center', alignItems: 'center', height: 90, marginBottom: 20 },
  ringOuter3: { width: 90, height: 90, borderRadius: 45, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  ringOuter2: { width: 72, height: 72, borderRadius: 36, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  ringOuter1: { width: 54, height: 54, borderRadius: 27, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  coreMuted: { width: 36, height: 36, borderRadius: 18 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  emptySubtitle: { fontSize: 12, textAlign: 'center', lineHeight: 18, paddingHorizontal: 24 },
  listContent: { padding: 24, paddingBottom: 60 },
  notificationCard: { flexDirection: 'row-reverse', paddingVertical: 16, borderBottomWidth: 1 },
  avatarWrapper: { marginLeft: 12 },
  contentWrapper: { flex: 1, alignItems: 'flex-end' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 4 },
  likerName: { fontWeight: 'bold', fontSize: 13, lineHeight: 18 },
  timeText: { fontSize: 10, lineHeight: 14 },
  notificationText: { fontSize: 12, lineHeight: 18, marginBottom: 8, textAlign: 'right' },
  postContentBox: { borderRadius: TOKENS.borderRadius.sm, padding: 10, width: '100%', borderWidth: 1 },
  postContentText: { fontSize: 12, lineHeight: 18, textAlign: 'right' },
  
  localHeaderContainer: {
    borderBottomWidth: 0,
  },
  localHeader: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    paddingTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circularCloseButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftContainer: { width: 60, alignItems: 'flex-start', justifyContent: 'center' },
  rightContainer: { width: 60, alignItems: 'flex-end', justifyContent: 'center' },
  placeholder: { width: 28, height: 28 },
  titleContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 22,
    textAlign: 'center',
  },

});


