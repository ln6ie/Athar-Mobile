import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header } from './Header';
import { useTheme } from '../hooks/useTheme';

interface AboutSubScreenProps {
  onBack: () => void;
}

export const AboutSubScreen: React.FC<AboutSubScreenProps> = ({ onBack }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.default }]}>
      <Header title="حول تطبيق أثر" subtitle="" leftText="رجوع" onLeftPress={onBack} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Static Large Concentric Ripple Icon */}
        <View style={styles.iconWrapper}>
          <View style={[styles.rippleOuterRing, { borderColor: colors.brand.gold, backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(0, 85, 165, 0.06)' }]}>
            <View style={[styles.rippleInnerDot, { backgroundColor: colors.brand.gold }]} />
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={[styles.conceptText, { color: colors.text.secondary }]}>
            تطبيق <Text style={[styles.brandText, { color: colors.brand.gold }]}>أثر</Text> هو منصة وجدانية راقية تتيح للمستخدمين تدوين ونشر خواطرهم ورسائلهم للعالم بكامل الخصوصية والسرية دون الكشف عن هويتهم الحقيقية.
          </Text>
          <Text style={[styles.conceptText, { color: colors.text.secondary }]}>
            يترك كل مستخدم أثراً فريداً (تموجاً) يختفي تماماً وتزول بصمته من جدار الأثر العام بعد مرور 24 ساعة، تاركاً ذكرى ملهمة تعبر الفضاء الرقمي بهدوء وسكينة.
          </Text>
        </View>

        <View style={[styles.developerCard, { backgroundColor: colors.background.card, borderColor: colors.border.muted }]}>
          <Text style={[styles.developerTitle, { color: colors.brand.gold }]}>معلومات المطور</Text>
          <View style={[styles.divider, { backgroundColor: colors.border.muted }]} />
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.text.disabled }]}>المبرمج المطور:</Text>
            <Text style={[styles.infoValue, { color: colors.text.primary }]}>عبدالله كريم</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.text.disabled }]}>حساب الإنستغرام:</Text>
            <Text style={[styles.infoValue, styles.linkText, { color: colors.brand.gold }]}>elcom.lab</Text>
          </View>
        </View>
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
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
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

