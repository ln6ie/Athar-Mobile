// نافذة الإشعارات - عرض الإعجابات الجديدة
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { TOKENS } from '../../constants/tokens';
import { useFeedStore } from '../../store/useFeedStore';
import { BellIcon } from '../feed/BellIcon';
import { useTheme } from '../../hooks/useTheme';
import { useSharedStyles, createRings, textPresets } from '../../styles';
import { useTranslation } from 'react-i18next';

const rings = createRings(80);

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const sharedStyles = useSharedStyles();
  const { unreadLikesCount, markLikesAsRead } = useFeedStore();

  const handleClose = () => {
    markLikesAsRead();
    onClose();
  };

  const isMuted = unreadLikesCount === 0;

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={handleClose}>
      <View style={sharedStyles.modalOverlay}>
        <View style={[sharedStyles.modalContent, { backgroundColor: colors.background.default, borderColor: colors.border.muted, borderWidth: 1 }]}>
          <Text style={[sharedStyles.modalTitle, { color: colors.text.primary }]}>{t('notifications.modal_title')}</Text>

          <View style={localStyles.modalBody}>
            <View style={localStyles.concentricContainer}>
              <View style={[
                rings.ring3,
                { borderColor: isDark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(0, 85, 165, 0.12)' },
                isMuted && { borderColor: isDark ? 'rgba(71, 85, 105, 0.15)' : 'rgba(156, 163, 175, 0.15)' }
              ]} />
              <View style={[
                rings.ring2,
                { borderColor: isDark ? 'rgba(59, 130, 246, 0.35)' : 'rgba(0, 85, 165, 0.35)' },
                isMuted && { borderColor: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(156, 163, 175, 0.3)' }
              ]} />
              <View style={[
                rings.ring1,
                { borderColor: isDark ? 'rgba(59, 130, 246, 0.7)' : 'rgba(0, 85, 165, 0.7)' },
                isMuted && { borderColor: isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(156, 163, 175, 0.5)' }
              ]} />
              <View style={[
                rings.core,
                { backgroundColor: colors.brand.gold },
                isMuted && { backgroundColor: colors.text.disabled }
              ]}>
                <BellIcon color="#FFFFFF" />
              </View>
            </View>

            {!isMuted ? (
              <View style={localStyles.notifContainer}>
                <Text style={[textPresets.subtitle, { fontSize: 14, fontWeight: 'bold', textAlign: 'center', lineHeight: 22, marginBottom: 8, color: colors.brand.gold }]}>
                  {t('notifications.likes_text' + (unreadLikesCount === 1 ? '' : '_plural'), { count: unreadLikesCount })}
                </Text>
                <Text style={[textPresets.small, { textAlign: 'center', lineHeight: 16, paddingHorizontal: 10, color: colors.text.secondary }]}>
                  {t('notifications.likes_hint')}
                </Text>
              </View>
            ) : (
              <View style={localStyles.notifContainer}>
                <Text style={[textPresets.subtitle, { fontSize: 14, fontWeight: 'bold', textAlign: 'center', lineHeight: 22, marginBottom: 8, color: colors.text.secondary }]}>
                  {t('notifications.empty')}
                </Text>
                <Text style={[textPresets.small, { textAlign: 'center', lineHeight: 16, paddingHorizontal: 10, color: colors.text.secondary }]}>
                  {t('notifications.empty_desc')}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity onPress={handleClose} style={sharedStyles.confirmButton} activeOpacity={0.8}>
            <Text style={sharedStyles.confirmButtonText}>{t('common.awesome')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const localStyles = StyleSheet.create({
  modalBody: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  concentricContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  notifContainer: {
    alignItems: 'center',
    width: '100%',
  },
});
