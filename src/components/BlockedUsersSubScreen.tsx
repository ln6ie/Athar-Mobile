import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Header } from './Header';
import { useTheme } from '../hooks/useTheme';
import { useFeedStore } from '../store/useFeedStore';
import { AnonymousAvatar } from './AnonymousAvatar';
import Ionicons from '@expo/vector-icons/Ionicons';

interface BlockedUsersSubScreenProps {
  onBack: () => void;
}

export const BlockedUsersSubScreen: React.FC<BlockedUsersSubScreenProps> = ({ onBack }) => {
  const { colors, isDark } = useTheme();
  const { blockedUsers, unblockUser } = useFeedStore();

  const handleUnblock = async (username: string) => {
    await unblockUser(username);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.default }]}>
      <Header title="المستخدمون المحظورون" subtitle="" leftText="رجوع" onLeftPress={onBack} />
      
      {blockedUsers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconCircle, { borderColor: colors.border.muted }]}>
            <Ionicons name="shield-checkmark" size={32} color={colors.brand.gold} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>لا يوجد مستخدمون محظورون</Text>
          <Text style={[styles.emptyDescription, { color: colors.text.secondary }]}>
            قائمتك خالية من المحظورين حالياً. جميع منشورات المستخدمين تظهر في جدار الأثر الخاص بك.
          </Text>
        </View>
      ) : (
        <FlashList
          data={blockedUsers}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={[styles.blockedRow, { borderBottomColor: colors.border.muted }]}>
              <View style={styles.userInfo}>
                <AnonymousAvatar size={40} />
                <Text style={[styles.username, { color: colors.text.primary }]}>{item}</Text>
              </View>
              
              <TouchableOpacity
                style={[styles.unblockButton, { borderColor: colors.feedback.error }]}
                onPress={() => handleUnblock(item)}
                activeOpacity={0.7}
              >
                <Text style={[styles.unblockText, { color: colors.feedback.error }]}>فك الحظر</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 24 },
  blockedRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  userInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 80,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
