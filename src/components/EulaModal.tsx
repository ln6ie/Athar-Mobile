import React from 'react';
import { View, Text, StyleSheet, ScrollView, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from './Header';
import { GlassicView } from './GlassicView';
import { useTheme } from '../hooks/useTheme';

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
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

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
      <View style={[styles.container, { backgroundColor: colors.background.default }]}>
        <Header title="شروط الاستخدام واتفاقية EULA" subtitle="" leftText="رجوع" onLeftPress={onClose} />
        
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent, 
            { paddingBottom: Math.max(insets.bottom, 40) + 100 }
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.introText, { color: colors.text.secondary }]}>
            يرجى قراءة شروط اتفاقية ترخيص المستخدم النهائي (EULA) وسياسة قبول المحتوى بعناية. إن استخدامك للتطبيق يعني موافقتك الصريحة والكاملة على هذه الشروط.
          </Text>

          <GlassicView cornerRadius={20} style={styles.card}>
            <Text style={[styles.sectionTitle, { color: colors.brand.gold }]}>1. سياسة خلو التسامح مع الإساءة (Zero-Tolerance)</Text>
            <Text style={[styles.bodyText, { color: colors.text.primary }]}>
              يلتزم تطبيق أثر بسياسة صارمة وخالية من التسامح تماماً (Zero-Tolerance Policy) تجاه أي سلوك مسيء أو محتوى ضار. يمنع منعاً باتاً نشر، أو تداول، أو الترويج لأي من السلوكيات التالية:
            </Text>
            <Text style={[styles.bulletPoint, { color: colors.text.secondary }]}>
              • <Text style={{ fontWeight: 'bold', color: colors.text.primary }}>مضايقة المستخدمين:</Text> يمنع التشهير، الابتزاز، التهديد، أو الإساءة لأي مستخدم بأي شكل من الأشكال.
            </Text>
            <Text style={[styles.bulletPoint, { color: colors.text.secondary }]}>
              • <Text style={{ fontWeight: 'bold', color: colors.text.primary }}>المحتوى المسيء والبذيء:</Text> يحظر تماماً نشر الكلمات البذيئة، الصور أو النصوص الإباحية، أو المحتوى المنافي للآداب العامة.
            </Text>
            <Text style={[styles.bulletPoint, { color: colors.text.secondary }]}>
              • <Text style={{ fontWeight: 'bold', color: colors.text.primary }}>خطابات العنف والكراهية:</Text> يمنع منعاً باتاً نشر خطابات تحض على الكراهية، العنصرية، التمييز، أو الدعوة للعنف والإيذاء.
            </Text>
          </GlassicView>

          <GlassicView cornerRadius={20} style={styles.card}>
            <Text style={[styles.sectionTitle, { color: colors.brand.gold }]}>2. الحظر الفوري والدائم للمستخدمين المسيئين</Text>
            <Text style={[styles.bodyText, { color: colors.text.primary }]}>
              امتثالاً التام لإرشادات متجر التطبيقات من Apple (المادة 1.2) لتنظيم المحتوى الذي ينشئه المستخدمون (UGC):
            </Text>
            <Text style={[styles.bulletPoint, { color: colors.text.secondary }]}>
              • <Text style={{ fontWeight: 'bold', color: colors.text.primary }}>العقوبة الفورية:</Text> أي مستخدم يثبت مخالفته للشروط بنشر محتوى مسيء سيتم حظر حسابه وجهازه بالكامل وبشكل مؤبد ونهائي فوراً ودون أي تحذير مسبق.
            </Text>
            <Text style={[styles.bulletPoint, { color: colors.text.secondary }]}>
              • <Text style={{ fontWeight: 'bold', color: colors.text.primary }}>حذف المحتوى المخالف:</Text> يقوم فريق الإشراف بمراجعة وحذف أي محتوى يتم الإبلاغ عنه وثبوت مخالفته خلال مدة أقصاها 24 ساعة من تاريخ الإبلاغ.
            </Text>
          </GlassicView>

          <GlassicView cornerRadius={20} style={styles.card}>
            <Text style={[styles.sectionTitle, { color: colors.brand.gold }]}>3. آليات التبليغ والحجب النشطة</Text>
            <Text style={[styles.bodyText, { color: colors.text.primary }]}>
              يوفر التطبيق آليات دفاعية نشطة وسهلة الاستخدام للمستخدمين لحمايتهم من المحتوى المسيء:
            </Text>
            <Text style={[styles.bulletPoint, { color: colors.text.secondary }]}>
              • <Text style={{ fontWeight: 'bold', color: colors.text.primary }}>زر الإبلاغ (Report):</Text> يتيح لك الإبلاغ الفوري عن أي منشور مخالف لمراجعته وإزالته بواسطة الإدارة.
            </Text>
            <Text style={[styles.bulletPoint, { color: colors.text.secondary }]}>
              • <Text style={{ fontWeight: 'bold', color: colors.text.primary }}>زر الحجب (Block):</Text> يتيح لك حظر كاتب أي منشور فوراً، وبمجرد الحظر لن تتمكن من رؤية أي منشورات مستقبلية من هذا الكاتب نهائياً، كما لن يتمكن هو من رؤية آثارك.
            </Text>
          </GlassicView>

          {/* Action buttons inside ScrollView to satisfy Apple explicit agreement review */}
          <View style={styles.actionButtonsContainer}>
            <BouncyPressable
              onPress={handleAccept}
              style={[styles.acceptButton, { backgroundColor: colors.brand.gold }]}
            >
              <Text style={styles.acceptButtonText}>أوافق وأقبل الشروط</Text>
            </BouncyPressable>

            <BouncyPressable
              onPress={handleDecline}
              style={[styles.declineButton, { borderColor: colors.feedback.error }]}
            >
              <Text style={[styles.declineButtonText, { color: colors.feedback.error }]}>أرفض الشروط</Text>
            </BouncyPressable>
          </View>

          <Text style={[styles.footerNote, { color: colors.text.disabled }]}>
            آخر تحديث للاتفاقية: مايو 2026
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  introText: {
    fontSize: 12.5,
    lineHeight: 22,
    textAlign: 'right',
    marginBottom: 20,
  },
  card: {
    padding: 20,
    marginBottom: 16,
    borderWidth: 0.6,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 10,
    lineHeight: 20,
  },
  bodyText: {
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'right',
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 11.5,
    lineHeight: 18,
    textAlign: 'right',
    marginBottom: 8,
    paddingRight: 6,
  },
  footerNote: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  actionButtonsContainer: {
    marginTop: 24,
    marginBottom: 12,
    gap: 12,
    width: '100%',
  },
  acceptButton: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  declineButton: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'transparent',
  },
  declineButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
