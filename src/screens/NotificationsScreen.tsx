import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import { useFeedStore } from '../store/useFeedStore';
import { Header } from '../components/shared/Header';
import { AnonymousAvatar } from '../components/shared/AnonymousAvatar';
import { Logo } from '../components/shared/Logo';
import { useTheme } from '../hooks/useTheme';
import { useGlobalStyles, useSharedStyles } from '../styles';
import i18n from '../constants/locales';


interface NotificationsScreenProps {
  onClose: () => void;
}

// شاشة الإشعارات - عرض تنبيهات الإعجاب بالمنشورات
export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const globalStyles = useGlobalStyles();
  const sharedStyles = useSharedStyles();
  const { notifications, isLoadingNotifications, notificationsError, fetchNotifications } = useFeedStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  // تنسيق وقت الإشعار بالعربية
  const formatNotificationTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString(i18n.language?.startsWith('ar') ? 'ar-SA-u-nu-latn' : 'en-US', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const headerHeight = 44;

  return (
    <View style={globalStyles.container}>
      <Header title={t('notifications.title')} subtitle="" leftText={t('common.back')} onLeftPress={onClose} />

      {isLoadingNotifications && notifications.length === 0 ? (
        <View style={sharedStyles.centerContainer}>
          <ActivityIndicator size="large" color={colors.brand.gold} />
          <Text style={[localStyles.stateText, { color: colors.text.secondary }]}>{t('notifications.loading')}</Text>
        </View>
      ) : notificationsError ? (
        <View style={sharedStyles.centerContainer}>
          <View style={[sharedStyles.errorBox, { backgroundColor: colors.background.input, borderRadius: 16, width: '100%' }]}>
            <Text style={[sharedStyles.errorBoxText, { fontSize: 13, lineHeight: 20 }]}>{notificationsError}</Text>
          </View>
          <TouchableOpacity onPress={fetchNotifications} style={sharedStyles.retryButton} activeOpacity={0.8}>
            <Text style={sharedStyles.retryButtonText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      ) : notifications.length === 0 ? (
        <View style={sharedStyles.centerContainer}>
          <View style={localStyles.concentricContainer}>
            <Logo size={90} />
          </View>
          <Text style={sharedStyles.emptyTitle}>{t('notifications.empty')}</Text>
          <Text style={sharedStyles.emptySubtitle}>
          </Text>
        </View>
      ) : (
        <FlashList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[localStyles.notificationCard, { borderBottomColor: 'rgba(66, 133, 244, 0.2)' }]}>
              <AnonymousAvatar size={38} />
              
              <View style={localStyles.contentWrapper}>
                <View style={localStyles.headerRow}>
                  <Text style={[localStyles.likerName, { color: colors.brand.gold }]} numberOfLines={1}>{item.likerName}</Text>
                  <Text style={[localStyles.timeText, { color: colors.text.disabled }]}>
                    {formatNotificationTime(item.createdAt)}
                  </Text>
                </View>
                
                <Text style={[localStyles.actionText, { color: colors.text.secondary }]}>
                  {t('notifications.liked_post')}
                </Text>
                
                <View style={[localStyles.postPreview, { backgroundColor: colors.background.input }]}>
                  <Text style={[localStyles.postPreviewText, { color: colors.text.secondary }]} numberOfLines={2}>
                    {item.post.content}
                  </Text>
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={sharedStyles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingNotifications}
              onRefresh={fetchNotifications}
              tintColor={colors.brand.gold}
              colors={[colors.brand.gold]}
              progressViewOffset={Platform.OS === 'android' ? headerHeight : undefined}
            />
          }
        />
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  stateText: { marginTop: 6, fontSize: 13, fontWeight: '600' },
  concentricContainer: { justifyContent: 'center', alignItems: 'center', height: 90, marginBottom: 20 },
  notificationCard: {
    flexDirection: 'row-reverse',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  contentWrapper: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  likerName: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  timeText: {
    fontSize: 10,
    marginRight: 8,
  },
  actionText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
  },
  postPreview: {
    borderRadius: 10,
    padding: 10,
  },
  postPreviewText: {
    fontSize: 11.5,
    lineHeight: 17,
    textAlign: 'center',
  },
});
