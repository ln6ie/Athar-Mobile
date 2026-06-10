// نافذة الاتفاقية القانونية - EULA مع أزرار الموافقة والرفض
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from './Header';
import { GlassicView } from './GlassicView';
import { useTheme } from '../../hooks/useTheme';
import { useGlobalStyles, useSharedStyles, glassCards, textPresets } from '../../styles';

import { BouncyPressable } from './BouncyPressable';

interface EulaModalProps {
  visible: boolean;
  onClose: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
}

export const EulaModal: React.FC<EulaModalProps> = ({
  visible,
  onClose,
  onAccept,
  onDecline
}) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const globalStyles = useGlobalStyles();
  const sharedStyles = useSharedStyles();

  const handleAccept = () => {
    if (onAccept) {
      onAccept();
    }
    onClose();
  };

  const handleDecline = () => {
    if (onDecline) {
      onDecline();
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={globalStyles.container}>
        <Header title={t('eula.title')} subtitle="" leftText={t('common.back')} onLeftPress={onClose} />

        <ScrollView
          contentContainerStyle={[
            sharedStyles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 40) + 100 }
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[localStyles.introText, { color: colors.text.secondary }]}>
            {t('eula.intro')}
          </Text>

          <GlassicView cornerRadius={20} style={glassCards.default}>
            <Text style={sharedStyles.sectionTitle}>{t('eula.section1_title')}</Text>
            <Text style={sharedStyles.bodyText}>
              {t('eula.section1_intro')}
            </Text>
            <Text style={[textPresets.small, { marginBottom: 8, paddingRight: 6, color: colors.text.secondary }]}>
              • <Text style={{ fontWeight: 'bold', color: colors.text.primary }}>{t('eula.section1_bullet1')}</Text>
            </Text>
            <Text style={[textPresets.small, { marginBottom: 8, paddingRight: 6, color: colors.text.secondary }]}>
              • <Text style={{ fontWeight: 'bold', color: colors.text.primary }}>{t('eula.section1_bullet2')}</Text>
            </Text>
            <Text style={[textPresets.small, { marginBottom: 8, paddingRight: 6, color: colors.text.secondary }]}>
              • <Text style={{ fontWeight: 'bold', color: colors.text.primary }}>{t('eula.section1_bullet3')}</Text>
            </Text>
          </GlassicView>

          <GlassicView cornerRadius={20} style={glassCards.default}>
            <Text style={sharedStyles.sectionTitle}>{t('eula.section2_title')}</Text>
            <Text style={sharedStyles.bodyText}>
              {t('eula.section2_intro')}
            </Text>
            <Text style={[textPresets.small, { marginBottom: 8, paddingRight: 6, color: colors.text.secondary }]}>
              • <Text style={{ fontWeight: 'bold', color: colors.text.primary }}>{t('eula.section2_bullet1')}</Text>
            </Text>
            <Text style={[textPresets.small, { marginBottom: 8, paddingRight: 6, color: colors.text.secondary }]}>
              • <Text style={{ fontWeight: 'bold', color: colors.text.primary }}>{t('eula.section2_bullet2')}</Text>
            </Text>
          </GlassicView>

          <GlassicView cornerRadius={20} style={glassCards.default}>
            <Text style={sharedStyles.sectionTitle}>{t('eula.section3_title')}</Text>
            <Text style={sharedStyles.bodyText}>
              {t('eula.section3_intro')}
            </Text>
            <Text style={[textPresets.small, { marginBottom: 8, paddingRight: 6, color: colors.text.secondary }]}>
              • <Text style={{ fontWeight: 'bold', color: colors.text.primary }}>{t('eula.section3_bullet1')}</Text>
            </Text>
            <Text style={[textPresets.small, { marginBottom: 8, paddingRight: 6, color: colors.text.secondary }]}>
              • <Text style={{ fontWeight: 'bold', color: colors.text.primary }}>{t('eula.section3_bullet2')}</Text>
            </Text>
          </GlassicView>

          {/* أزرار الإجراءات داخل ScrollView لتلبية متطلبات مراجعة Apple */}
          <View style={localStyles.actionButtonsContainer}>
            <BouncyPressable
              onPress={handleAccept}
              style={[sharedStyles.confirmButton, { height: 48, borderRadius: 24 }]}
            >
              <Text style={sharedStyles.confirmButtonText}>{t('eula.accept')}</Text>
            </BouncyPressable>

            <BouncyPressable
              onPress={handleDecline}
              style={[sharedStyles.declineButton, { borderColor: colors.feedback.error }]}
            >
              <Text style={[sharedStyles.declineButtonText, { color: colors.feedback.error }]}>{t('eula.decline')}</Text>
            </BouncyPressable>
          </View>

          <Text style={[textPresets.caption, { textAlign: 'center', marginTop: 20, marginBottom: 10, color: colors.text.disabled }]}>
            {t('eula.updated')}
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
};

const localStyles = StyleSheet.create({
  introText: {
    fontSize: 12.5,
    lineHeight: 22,
    textAlign: 'right',
    marginBottom: 20,
  },
  actionButtonsContainer: {
    marginTop: 24,
    marginBottom: 12,
    gap: 12,
    width: '100%',
  },
});
