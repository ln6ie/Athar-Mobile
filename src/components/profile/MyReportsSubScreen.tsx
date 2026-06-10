// شاشة سجل البلاغات - عرض حالة كل بلاغ مقدم
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Header } from '../shared/Header';
import { useTheme } from '../../hooks/useTheme';
import { useFeedStore } from '../../store/useFeedStore';
import { GlassicView } from '../shared/GlassicView';
import { BouncyPressable } from '../shared/BouncyPressable';
import { SymbolView } from '../shared/SymbolView';
import { useGlobalStyles, useSharedStyles, emptyStates, glassCards, rowLayouts, badges, textPresets, infoBoxes } from '../../styles';
import i18n from '../../constants/locales';

interface MyReportsSubScreenProps {
  onBack: () => void;
}

export const MyReportsSubScreen: React.FC<MyReportsSubScreenProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const globalStyles = useGlobalStyles();
  const sharedStyles = useSharedStyles();
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
          text: t('reports.status_resolved'),
          bg: isDark ? 'rgba(16, 185, 129, 0.15)' : '#E6F4EA',
          color: colors.feedback.success,
          icon: 'checkmark.circle.fill'
        };
      case 'rejected':
        return {
          text: t('reports.status_rejected'),
          bg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FCE8E6',
          color: colors.feedback.error,
          icon: 'multiply.circle.fill'
        };
      default:
        return {
          text: t('reports.status_pending'),
          bg: 'transparent',
          color: colors.brand.gold,
          icon: 'clock.fill'
        };
    }
  };

  return (
    <View style={globalStyles.container}>
      <Header title={t('reports.title')} subtitle="" leftText={t('common.back')} onLeftPress={onBack} />

      {isLoading ? (
        <View style={sharedStyles.centerAll}>
          <ActivityIndicator size="large" color={colors.brand.gold} />
        </View>
      ) : error ? (
        <View style={sharedStyles.centerAll}>
          <Text style={sharedStyles.errorText}>{error}</Text>
          <BouncyPressable
            onPress={fetchMyReports}
            style={[sharedStyles.retryButton, { backgroundColor: colors.brand.gold }]}
          >
            <Text style={sharedStyles.retryButtonText}>{t('common.retry')}</Text>
          </BouncyPressable>
        </View>
      ) : reports.length === 0 ? (
        <View style={sharedStyles.centerAll}>
          <View style={[emptyStates.iconContainer, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,0.02)' }]}>
            <SymbolView
              name={{ ios: 'checkmark.shield.fill', android: 'security' }}
              size={48}
              tintColor={colors.brand.gold}
            />
          </View>
          <Text style={sharedStyles.emptyTitle}>{t('reports.empty_title')}</Text>
          <Text style={sharedStyles.emptySubtitle}>
            {t('reports.empty_desc')}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={sharedStyles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[sharedStyles.description, { color: colors.text.secondary }]}>
              {t('reports.description')}
          </Text>

          {reports.map((report) => {
            const badge = getStatusBadge(report.status);
            return (
              <GlassicView key={report.id} cornerRadius={20} style={glassCards.padded}>
                {/* صف الترويسة العلوي داخل البطاقة */}
                <View style={[rowLayouts.reverse, { marginBottom: 14 }]}>
                  <View style={[badges.default, { backgroundColor: badge.bg }]}>
                    <SymbolView
                      name={{ ios: badge.icon, android: 'info' }}
                      size={12}
                      tintColor={badge.color}
                    />
                    <Text style={[sharedStyles.badgeText, { color: badge.color }]}>{badge.text}</Text>
                  </View>

                  <Text style={[localStyles.reportDate, { color: colors.text.disabled }]}>
                    {new Date(report.createdAt).toLocaleDateString(i18n.language?.startsWith('ar') ? 'ar-SA-u-nu-latn' : 'en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>

                {/* التفاصيل الفرعية: المستهدف */}
                <View style={sharedStyles.rowReverse}>
                  <Text style={[textPresets.metaLabel, { color: colors.text.secondary }]}>{t('reports.author_label')}</Text>
                  <Text style={[textPresets.metaValue, { color: colors.brand.gold }]}>{report.postAuthor}</Text>
                </View>

                <View style={{ alignItems: 'flex-end', marginTop: 6, marginBottom: 4 }}>
                  <Text style={[textPresets.metaLabel, { color: colors.text.secondary, marginBottom: 2 }]}>{t('reports.reason_label')}</Text>
                  <Text style={[textPresets.metaValue, { color: colors.text.primary, textAlign: 'right' }]}>{report.reason}</Text>
                </View>

                {/* محتوى المنشور المقتبس */}
                <View style={[infoBoxes.quote, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0,0,0,0.02)' }]}>
                  <Text style={[localStyles.quoteLabel, { color: colors.text.disabled }]}>{t('reports.content_label')}</Text>
                  <Text style={[localStyles.quoteText, { color: colors.text.primary }]}>{report.postContent}</Text>
                </View>

                {/* ملاحظة الإدارة في حالة القبول أو الرفض */}
                {report.adminNote && (
                  <View style={[localStyles.adminNoteBox, { borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
                    <Text style={[textPresets.caption, { fontWeight: 'bold', marginBottom: 4, color: colors.brand.gold }]}>{t('reports.admin_note_label')}</Text>
                    <Text style={[textPresets.small, { color: colors.text.secondary }]}>{report.adminNote}</Text>
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

const localStyles = StyleSheet.create({
  reportDate: {
    fontSize: 10,
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
});
