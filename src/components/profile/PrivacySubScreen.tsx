// شاشة سياسة الخصوصية - نص قانوني كامل
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useTranslation } from 'react-i18next';
import { Header } from '../shared/Header';
import { useTheme } from '../../hooks/useTheme';
import { useGlobalStyles, useSharedStyles } from '../../styles';

interface PrivacySubScreenProps {
  onBack: () => void;
}

export const PrivacySubScreen: React.FC<PrivacySubScreenProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const globalStyles = useGlobalStyles();
  const sharedStyles = useSharedStyles();

  return (
    <View style={globalStyles.container}>
      <Header title={t('privacy.title')} subtitle="" leftText={t('common.back')} onLeftPress={onBack} />
      <ScrollView contentContainerStyle={sharedStyles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={localStyles.card}>
          <Text style={[sharedStyles.sectionTitle, { color: colors.brand.gold }]}>{t('privacy.section1_title')}</Text>
          <Text style={[sharedStyles.bodyText, { color: colors.text.secondary }]}>
            {t('privacy.section1_text')}
          </Text>

          <View style={sharedStyles.bulletItem}>
            <Text style={[sharedStyles.bulletSymbol, { color: colors.brand.gold }]}>•</Text>
            <Text style={[sharedStyles.bulletText, { color: colors.text.secondary }]}>
              {t('privacy.section2_text')}
            </Text>
          </View>

          <View style={sharedStyles.bulletItem}>
            <Text style={[sharedStyles.bulletSymbol, { color: colors.brand.gold }]}>•</Text>
            <Text style={[sharedStyles.bulletText, { color: colors.text.secondary }]}>
              {t('privacy.section3_text')}
            </Text>
          </View>

          <View style={sharedStyles.bulletItem}>
            <Text style={[sharedStyles.bulletSymbol, { color: colors.brand.gold }]}>•</Text>
            <Text style={[sharedStyles.bulletText, { color: colors.text.secondary }]}>
              {t('privacy.section4_text')}
            </Text>
          </View>

          <View style={sharedStyles.bulletItem}>
            <Text style={[sharedStyles.bulletSymbol, { color: colors.brand.gold }]}>•</Text>
            <Text style={[sharedStyles.bulletText, { color: colors.text.secondary }]}>
              {t('privacy.section5_text')}
            </Text>
          </View>

          {/* زر فتح سياسة الخصوصية الكاملة عبر موقعنا الإلكتروني */}
          <TouchableOpacity
            onPress={() => WebBrowser.openBrowserAsync('https://atharweb.elcomlab.site/privacy')}
            style={{
              marginTop: 24,
              paddingVertical: 14,
              borderRadius: 16,
              backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(0, 85, 165, 0.08)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: colors.brand.gold, textDecorationLine: 'underline' }}>
              {t('privacy.read_full_privacy')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const localStyles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    padding: 0,
    marginBottom: 20,
  },
});
