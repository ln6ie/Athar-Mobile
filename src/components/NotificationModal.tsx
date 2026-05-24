import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { TOKENS } from '../constants/tokens';
import { useFeedStore } from '../store/useFeedStore';
import { BellIcon } from './BellIcon';
import { useTheme } from '../hooks/useTheme';

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ visible, onClose }) => {
  const { colors, isDark } = useTheme();
  const { unreadLikesCount, markLikesAsRead } = useFeedStore();

  const handleClose = () => {
    markLikesAsRead();
    onClose();
  };

  const isMuted = unreadLikesCount === 0;

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background.default, borderColor: colors.border.muted, borderWidth: 1 }]}>
          <Text style={[styles.modalTitle, { color: colors.text.primary }]}>تنبيهات الأثر</Text>
          
          <View style={styles.modalBody}>
            <View style={styles.concentricContainer}>
              <View style={[
                styles.ringOuter3, 
                { borderColor: isDark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(0, 85, 165, 0.12)' },
                isMuted && { borderColor: isDark ? 'rgba(71, 85, 105, 0.15)' : 'rgba(156, 163, 175, 0.15)' }
              ]}>
                <View style={[
                  styles.ringOuter2, 
                  { borderColor: isDark ? 'rgba(59, 130, 246, 0.35)' : 'rgba(0, 85, 165, 0.35)' },
                  isMuted && { borderColor: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(156, 163, 175, 0.3)' }
                ]}>
                  <View style={[
                    styles.ringOuter1, 
                    { borderColor: isDark ? 'rgba(59, 130, 246, 0.7)' : 'rgba(0, 85, 165, 0.7)' },
                    isMuted && { borderColor: isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(156, 163, 175, 0.5)' }
                  ]}>
                    <View style={[
                      styles.bellCore, 
                      { backgroundColor: colors.brand.gold },
                      isMuted && { backgroundColor: colors.text.disabled }
                    ]}>
                      <BellIcon color="#FFFFFF" />
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {!isMuted ? (
              <View style={styles.notifContainer}>
                <Text style={[styles.notifAlertText, { color: colors.brand.gold }]}>
                  حصلت منشوراتك المجهولة على {unreadLikesCount} {unreadLikesCount === 1 ? 'إعجاب جديد' : 'إعجابات جديدة'}!
                </Text>
                <Text style={[styles.notifSubText, { color: colors.text.secondary }]}>
                  تفاعل الآخرون مع الأثر الذي تركته. استمر في نشر الإلهام وكتابة منشورات مميزة.
                </Text>
              </View>
            ) : (
              <View style={styles.notifContainer}>
                <Text style={[styles.notifAlertText, { color: colors.text.secondary }]}>
                  لا توجد تنبيهات جديدة حالياً
                </Text>
                <Text style={[styles.notifSubText, { color: colors.text.secondary }]}>
                  أثرك هادئ حالياً. شارك منشورات وأفكار ملهمة في الصفحة الرئيسية ليتفاعل معها الجميع!
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity onPress={handleClose} style={[styles.confirmButton, { backgroundColor: colors.brand.gold }]} activeOpacity={0.8}>
            <Text style={styles.confirmButtonText}>رائع</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: TOKENS.borderRadius.xl,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalBody: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  concentricContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    marginBottom: 16,
  },
  ringOuter3: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringOuter2: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringOuter1: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellCore: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifContainer: {
    alignItems: 'center',
    width: '100%',
  },
  notifAlertText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  notifSubText: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 10,
  },
  confirmButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: TOKENS.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

