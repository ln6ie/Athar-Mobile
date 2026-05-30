import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Header } from './Header';
import { Logo } from './Logo';
import { useTheme } from '../hooks/useTheme';
import { GlassicView } from './GlassicView';


interface AboutSubScreenProps {
  onBack: () => void;
}

export const AboutSubScreen: React.FC<AboutSubScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();

  const handleOpenInstagram = () => {
    Linking.openURL('https://instagram.com/elcom.lab').catch((err) =>
      console.error('Failed to open Instagram URL', err)
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.default }]}>
      <Header title="حول التطبيق " subtitle="" leftText="رجوع" onLeftPress={onBack} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Unified Programmatic Concentric Ripple Logo */}
        <View style={styles.iconWrapper}>
          <Logo size={80} />
        </View>
        
        <View style={styles.card}>
          <Text style={[styles.conceptText, { color: colors.text.secondary }]}>
            تطبيق <Text style={[styles.brandText, { color: colors.brand.gold }]}>أثر</Text> هو منصة بسيطة تتيح لك نشر ومشاركة أفكارك، آرائك، أو أي شيء يخطر ببالك بكامل الخصوصية والسرية دون الكشف عن هويتك الحقيقية.
          </Text>
          <Text style={[styles.conceptText, { color: colors.text.secondary }]}>
            يختفي كل منشور تلقائياً ونهائياً من التطبيق ومن خوادمنا بعد مرور 24 ساعة بالضبط على نشره.
          </Text>
        </View>

        <GlassicView cornerRadius={16} style={styles.developerCard}>
          <Text style={[styles.developerTitle, { color: colors.brand.gold }]}>معلومات المطور والدعم</Text>
          <View style={[styles.divider, { backgroundColor: colors.border.muted }]} />
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>المبرمج والمطور:</Text>
            <Text style={[styles.infoValue, { color: colors.text.primary }]}>عبدالله كريم</Text>
          </View>

          <TouchableOpacity style={styles.infoRow} onPress={() => Linking.openURL('mailto:support@athar-app.com').catch(e => console.log(e))} activeOpacity={0.7}>
            <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>بريد الإبلاغ والدعم:</Text>
            <Text style={[styles.infoValue, styles.linkText, { color: colors.brand.gold }]}>elcom.lab.iq@gmail.com</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoRow} onPress={handleOpenInstagram} activeOpacity={0.7}>
            <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>حساب الإنستغرام:</Text>
            <Text style={[styles.infoValue, styles.linkText, { color: colors.brand.gold }]}>@elcom.lab</Text>
          </TouchableOpacity>
        </GlassicView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
    paddingBottom: 60,
  },
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
  conceptText: {
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'right',
    marginBottom: 12,
  },
  developerCard: {
    width: '100%',
    padding: 20,
  },
  developerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    textAlign: 'right',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  linkText: {
    textDecorationLine: 'underline',
  },
});

