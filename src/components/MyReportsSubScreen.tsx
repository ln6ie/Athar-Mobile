import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Header } from './Header';
import { useTheme } from '../hooks/useTheme';
import { useFeedStore } from '../store/useFeedStore';
import { GlassicView } from './GlassicView';
import { BouncyPressable } from './BouncyPressable';
import { SymbolView } from './SymbolView';

interface MyReportsSubScreenProps {
  onBack: () => void;
}

export const MyReportsSubScreen: React.FC<MyReportsSubScreenProps> = ({ onBack }) => {
  const { colors, isDark } = useTheme();
  const reports = useFeedStore((state) => state.reports);
  const isLoading = useFeedStore((state) => state.isLoadingReports);
  const error = useFeedStore((state) => state.reportsError);
  const fetchMyReports = useFeedStore((state) => state.fetchMyReports);

  useEffect(() => {
    fetchMyReports();
  }, []);

  const getStatusBadge = (status: 'pending' | 'resolved' | 'rejected') => {
    switch (status) {
      case 'resolved':
        return {
          text: 'تم الإجراء (حذف)',
          bg: isDark ? 'rgba(16, 185, 129, 0.15)' : '#E6F4EA',
          color: colors.feedback.success,
          icon: 'checkmark.circle.fill'
        };
      case 'rejected':
        return {
          text: 'سليم (مرفوض البلاغ)',
          bg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FCE8E6',
          color: colors.feedback.error,
          icon: 'multiply.circle.fill'
        };
      default:
        return {
          text: 'قيد المراجعة',
          bg: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FEF7E0',
          color: colors.brand.gold,
          icon: 'clock.fill'
        };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.default }]}>
      <Header title="سجل البلاغات والشكاوى" subtitle="" leftText="رجوع" onLeftPress={onBack} />
      
      {isLoading ? (
        <View style={styles.centerAll}>
          <ActivityIndicator size="large" color={colors.brand.gold} />
        </View>
      ) : error ? (
        <View style={styles.centerAll}>
          <Text style={[styles.errorText, { color: colors.feedback.error }]}>{error}</Text>
          <BouncyPressable
            onPress={fetchMyReports}
            style={[styles.retryButton, { backgroundColor: colors.brand.gold }]}
          >
            <Text style={styles.retryText}>إعادة المحاولة</Text>
          </BouncyPressable>
        </View>
      ) : reports.length === 0 ? (
        <View style={styles.centerAll}>
          <View style={[styles.emptyIconContainer, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,0.02)' }]}>
            <SymbolView
              name={{ ios: 'checkmark.shield.fill', android: 'security' }}
              size={48}
              tintColor={colors.brand.gold}
            />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>بيئتك آمنة ونظيفة!</Text>
          <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
            لم تقم بالإبلاغ عن أي منشورات، أو أن كل منشورات الفيد العامة متوافقة مع معايير السلامة.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[styles.topDescription, { color: colors.text.secondary }]}>
            شفافية تامة: هنا تتابع حالة كافة منشورات الفيد التي قمت بالإبلاغ عنها لعدم ملاءمتها، مع إفادة الدعم الفني الفورية.
          </Text>

          {reports.map((report) => {
            const badge = getStatusBadge(report.status);
            return (
              <GlassicView key={report.id} cornerRadius={20} style={styles.reportCard}>
                {/* Top header row inside card */}
                <View style={styles.cardHeader}>
                  <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                    <SymbolView
                      name={{ ios: badge.icon, android: 'info' }}
                      size={12}
                      tintColor={badge.color}
                    />
                    <Text style={[styles.badgeText, { color: badge.color }]}>{badge.text}</Text>
                  </View>
                  
                  <Text style={[styles.reportDate, { color: colors.text.disabled }]}>
                    {new Date(report.createdAt).toLocaleDateString('ar-EG', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>

                {/* Sub details: Reporter target */}
                <View style={styles.metaRow}>
                  <Text style={[styles.metaLabel, { color: colors.text.secondary }]}>الكاتب الأصلي للمنشور:</Text>
                  <Text style={[styles.metaValue, { color: colors.brand.gold }]}>{report.postAuthor}</Text>
                </View>

                <View style={styles.metaRow}>
                  <Text style={[styles.metaLabel, { color: colors.text.secondary }]}>سبب البلاغ:</Text>
                  <Text style={[styles.metaValue, { color: colors.text.primary }]}>{report.reason}</Text>
                </View>

                {/* Post content quoted */}
                <View style={[styles.postQuoteContainer, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0,0,0,0.02)' }]}>
                  <Text style={[styles.quoteLabel, { color: colors.text.disabled }]}>المنشور الذي تم الإبلاغ عنه:</Text>
                  <Text style={[styles.quoteText, { color: colors.text.primary }]}>{report.postContent}</Text>
                </View>

                {/* Admin Note if resolved or rejected */}
                {report.adminNote && (
                  <View style={[styles.adminNoteBox, { borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
                    <Text style={[styles.adminNoteLabel, { color: colors.brand.gold }]}>إفادة الإشراف والدعم الفني:</Text>
                    <Text style={[styles.adminNoteText, { color: colors.text.secondary }]}>{report.adminNote}</Text>
                  </View>
                )}
              </GlassicView>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerAll: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 60,
  },
  topDescription: {
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  reportCard: {
    padding: 18,
    marginBottom: 16,
    borderWidth: 0.6,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  statusBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  reportDate: {
    fontSize: 10,
  },
  metaRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 11.5,
  },
  metaValue: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  postQuoteContainer: {
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 8,
    alignItems: 'flex-end',
  },
  quoteLabel: {
    fontSize: 9.5,
    marginBottom: 4,
  },
  quoteText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'right',
  },
  adminNoteBox: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: 'flex-end',
  },
  adminNoteLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  adminNoteText: {
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'right',
  },
});
