// شاشة إدارة المستخدمين المحظورين - عرض وإلغاء الحظر
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import { Header } from '../shared/Header';
import { useTheme } from '../../hooks/useTheme';
import { useFeedStore } from '../../store/useFeedStore';
import { AnonymousAvatar } from '../shared/AnonymousAvatar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useGlobalStyles, useSharedStyles, rowLayouts } from '../../styles';

interface BlockedUsersSubScreenProps {
  onBack: () => void;
}

export const BlockedUsersSubScreen: React.FC<BlockedUsersSubScreenProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const globalStyles = useGlobalStyles();
  const sharedStyles = useSharedStyles();
  const { blockedUsers, unblockUser } = useFeedStore();

  const handleUnblock = async (username: string) => {
    await unblockUser(username);
  };

  return (
    <View style={globalStyles.container}>
      <Header title={t('blocked_users.title')} subtitle="" leftText={t('common.back')} onLeftPress={onBack} />
      
      {blockedUsers.length === 0 ? (
        <View style={sharedStyles.emptyContainer}>
          <Ionicons name="shield-checkmark" size={48} color={colors.brand.gold} style={{ marginBottom: 16 }} />
          <Text style={[sharedStyles.emptyTitle, { color: colors.text.primary }]}>{t('blocked_users.empty_title')}</Text>
          <Text style={[sharedStyles.emptySubtitle, { color: colors.text.secondary }]}>
            {t('blocked_users.empty_desc')}
          </Text>
        </View>
      ) : (
        <FlashList
          data={blockedUsers}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={[rowLayouts.reverse, { paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border.muted }]}>
              <View style={sharedStyles.rowReverse}>
                <AnonymousAvatar size={40} />
                <Text style={[localStyles.username, { color: colors.text.primary }]}>{item}</Text>
              </View>
              
              <TouchableOpacity
                style={[localStyles.unblockButton, { borderColor: colors.feedback.error }]}
                onPress={() => handleUnblock(item)}
                activeOpacity={0.7}
              >
                <Text style={[localStyles.unblockText, { color: colors.feedback.error }]}>{t('blocked_users.unblock')}</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={sharedStyles.scrollContent}
        />
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  username: {
    fontSize: 13,
    fontWeight: 'bold',
    marginRight: 12,
  },
  unblockButton: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  unblockText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});
