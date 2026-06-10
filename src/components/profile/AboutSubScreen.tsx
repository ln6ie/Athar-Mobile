// شاشة معلومات عن التطبيق - الإصدار والروابط والوصف
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Application from 'expo-application';
import Constants from 'expo-constants';
import { Header } from '../shared/Header';
import { Logo } from '../shared/Logo';
import { useTheme } from '../../hooks/useTheme';
import { GlassicView } from '../shared/GlassicView';
import { useGlobalStyles, useSharedStyles, divider, textPresets } from '../../styles';

interface AboutSubScreenProps {
  onBack: () => void;
}

export const AboutSubScreen: React.FC<AboutSubScreenProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const globalStyles = useGlobalStyles();
  const sharedStyles = useSharedStyles();

  const currentVersion = Constants.expoConfig?.version || Application.nativeApplicationVersion || '1.0.0';

  const handleOpenInstagram = () => {
    Linking.openURL('https://instagram.com/elcom.lab').catch((err) =>
      console.error(t('feed.publish_failed'), err)
    );
  };

  return (
    <View style={globalStyles.container}>
      <Header title={t('about.title')} subtitle="" leftText={t('common.back')} onLeftPress={onBack} />
      <ScrollView contentContainerStyle={[sharedStyles.scrollContent, { alignItems: 'center' }]} showsVerticalScrollIndicator={false}>
        {/* اللوغو البرمجي ذو الحلقات المركزية */}
        <View style={localStyles.iconWrapper}>
          <Logo size={80} />
        </View>
        
        {/* بطاقة معلومات التطبيق والفكرة الزجاجية الفاخرة */}
        <GlassicView cornerRadius={16} style={[localStyles.developerCard, { marginBottom: 20 }]}>
          <Text style={[sharedStyles.bodyText, { color: colors.text.primary, marginBottom: 10, lineHeight: 20 }]}>
            {t('about.description1', { name: t('app.name') })}
          </Text>
          <Text style={[sharedStyles.bodyText, { color: colors.text.primary, marginBottom: 14, lineHeight: 20 }]}>
            {t('about.description2')}
          </Text>
          
          <View style={[divider.default, { backgroundColor: colors.border.muted }]} />
          
          <View style={[sharedStyles.rowReverse, { marginTop: 6 }]}>
            <Text style={[textPresets.body, { color: colors.text.secondary }]}>{t('about.version_label')}</Text>
            <Text style={[textPresets.body, { fontWeight: 'bold', color: colors.brand.gold }]}>{currentVersion}</Text>
          </View>
        </GlassicView>

        <GlassicView cornerRadius={16} style={localStyles.developerCard}>
          <Text style={[sharedStyles.sectionTitle, { color: colors.brand.gold }]}>{t('about.developer_info')}</Text>
          <View style={[divider.default, { backgroundColor: colors.border.muted }]} />
          
          <View style={[sharedStyles.rowReverse, { marginBottom: 12 }]}>
            <Text style={[textPresets.body, { color: colors.text.secondary }]}>{t('about.developer_label')}</Text>
            <Text style={[textPresets.body, { fontWeight: 'bold', textAlign: 'left', color: colors.text.primary }]}>{t('about.developer_name')}</Text>
          </View>

          <TouchableOpacity style={[sharedStyles.rowReverse, { marginBottom: 12 }]} onPress={() => Linking.openURL('mailto:support@athar-app.com').catch(e => console.log(e))} activeOpacity={0.7}>
            <Text style={[textPresets.body, { color: colors.text.secondary }]}>{t('about.support_email_label')}</Text>
            <Text style={[textPresets.body, localStyles.linkText, { fontWeight: 'bold', textAlign: 'left', color: colors.brand.gold }]}>elcom.lab.iq@gmail.com</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[sharedStyles.rowReverse, { marginBottom: 12 }]} onPress={handleOpenInstagram} activeOpacity={0.7}>
            <Text style={[textPresets.body, { color: colors.text.secondary }]}>{t('about.instagram_label')}</Text>
            <Text style={[textPresets.body, localStyles.linkText, { fontWeight: 'bold', textAlign: 'left', color: colors.brand.gold }]}>@elcom.lab</Text>
          </TouchableOpacity>
        </GlassicView>
      </ScrollView>
    </View>
  );
};

const localStyles = StyleSheet.create({
  iconWrapper: {
    marginBottom: 20,
    marginTop: 10,
  },
  rippleOuterRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rippleInnerDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  card: {
    width: '100%',
    backgroundColor: 'transparent',
    padding: 0,
    marginBottom: 24,
  },
  brandText: {
    fontWeight: 'bold',
  },
  developerCard: {
    width: '100%',
    padding: 20,
  },
  linkText: {
    textDecorationLine: 'underline',
  },
});
