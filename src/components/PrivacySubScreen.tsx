import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header } from './Header';
import { useTheme } from '../hooks/useTheme';

interface PrivacySubScreenProps {
  onBack: () => void;
}

export const PrivacySubScreen: React.FC<PrivacySubScreenProps> = ({ onBack }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.default }]}>
      <Header title="سياسة الخصوصية والأمان" subtitle="" leftText="رجوع" onLeftPress={onBack} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.card}>
          <Text style={[styles.sectionTitle, { color: colors.brand.gold }]}>الحماية و الخصوصية </Text>
          <Text style={[styles.description, { color: colors.text.secondary }]}>
            نحن في منصة أثر نضع خصوصيتك وسريتك كأولوية قصوى. لا يتم مشاركة بياناتك الشخصية أو هويتك أو موقعك الجغرافي مع أي جهة خارجية على الإطلاق.
          </Text>

          <View style={styles.bulletItem}>
            <Text style={[styles.bulletSymbol, { color: colors.brand.gold }]}>•</Text>
            <Text style={[styles.bulletText, { color: colors.text.secondary }]}>
              تظهر جميع المنشورات باسم مستعار هندسي ثابت غير قابل للتتبع إلى عنوان بريدك الحقيقي.
            </Text>
          </View>

          <View style={styles.bulletItem}>
            <Text style={[styles.bulletSymbol, { color: colors.brand.gold }]}>•</Text>
            <Text style={[styles.bulletText, { color: colors.text.secondary }]}>
              يتم مسح كافة المنشورات نهائياً وتلقائياً من خوادمنا ومن التطبيق بعد مرور 24 ساعة بالضبط من نشرها.
            </Text>
          </View>

          <View style={styles.bulletItem}>
            <Text style={[styles.bulletSymbol, { color: colors.brand.gold }]}>•</Text>
            <Text style={[styles.bulletText, { color: colors.text.secondary }]}>
              لا نقوم بالاحتفاظ بأي سجلات أو تاريخ للمنشورات بعد زوالها. زوال المنشور يعني زواله نهائياً من خوادم النظام.
            </Text>
          </View>

          <View style={styles.bulletItem}>
            <Text style={[styles.bulletSymbol, { color: colors.brand.gold }]}>•</Text>
            <Text style={[styles.bulletText, { color: colors.text.secondary }]}>
              نستخدم أحدث تقنيات التشفير ورموز التحقق لضمان تأمين جلسة تصفحك وتأمين حسابك.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'transparent',
    padding: 0,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0055A5',
    textAlign: 'right',
    marginBottom: 10,
  },
  description: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 22,
    textAlign: 'right',
    marginBottom: 16,
  },
  bulletItem: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletSymbol: {
    fontSize: 14,
    color: '#0055A5',
    marginLeft: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 20,
    textAlign: 'right',
  },
  infoBox: {
    backgroundColor: 'rgba(0, 85, 165, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 85, 165, 0.1)',
  },
  infoText: {
    fontSize: 12,
    color: '#0055A5',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 18,
  },
});
