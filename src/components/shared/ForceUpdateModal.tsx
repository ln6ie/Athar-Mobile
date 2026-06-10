// نافذة التحديث الإجباري - تظهر عند انتهاء صلاحية الإصدار
import React from 'react';
import { View, Text, Modal, TouchableOpacity, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useConfigStore } from '../../store/useConfigStore';
import { useTheme } from '../../hooks/useTheme';
import { useGlobalStyles } from '../../styles';
import { Logo } from './Logo';

export const ForceUpdateModal: React.FC = () => {
  const { t } = useTranslation();
  const { isUpdateRequired, storeUrl } = useConfigStore();
  const { colors } = useTheme();
  const globalStyles = useGlobalStyles();

  const handleUpdate = () => {
    if (storeUrl) {
      Linking.openURL(storeUrl).catch((err) => {
        console.error(t('feed.publish_failed'), err);
      });
    }
  };

  return (
    <Modal
      visible={isUpdateRequired}
      transparent={false}
      animationType="fade"
      hardwareAccelerated
      statusBarTranslucent
      onRequestClose={() => {}}
    >
      <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32, backgroundColor: '#000000' }]}>
        <View style={{ alignItems: 'center', width: '100%' }}>
          <View style={{ marginBottom: 40 }}>
            <Logo size={100} />
          </View>

          <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, lineHeight: 34, color: '#FFFFFF' }}>
            {t('update.title')}
          </Text>

          <Text style={{ fontSize: 14, textAlign: 'center', lineHeight: 24, marginBottom: 40, paddingHorizontal: 8, color: '#A0AEC0' }}>
            {t('update.message')}
          </Text>

          <TouchableOpacity
            onPress={handleUpdate}
            style={[globalStyles.button, { height: 54, borderRadius: 27, shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 }]}
            activeOpacity={0.8}
          >
            <Text style={globalStyles.buttonText}>{t('update.button')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
