// أنماط مشتركة بين جميع الشاشات - بطاقات وحاويات وحالات
import { StyleSheet, Platform } from 'react-native';
import { TOKENS, LIGHT_COLORS } from '../constants/tokens';
import { useTheme } from '../hooks/useTheme';

export const getSharedStyles = (colors: typeof LIGHT_COLORS, isDark: boolean = false) =>
  StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 12,
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 20,
      color: colors.text.secondary,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 48,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 8,
      lineHeight: 24,
      color: colors.text.primary,
    },
    emptySubtitle: {
      fontSize: 12,
      textAlign: 'center',
      lineHeight: 18,
      color: colors.text.secondary,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
      backgroundColor: colors.background.default,
    },
    errorText: {
      fontSize: 13,
      textAlign: 'center',
      marginBottom: 16,
      lineHeight: 20,
      fontWeight: '600',
      color: colors.feedback.error,
    },
    retryButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: TOKENS.borderRadius.lg,
      backgroundColor: colors.brand.gold,
    },
    retryButtonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 13,
    },
    card: {
      borderRadius: TOKENS.borderRadius.md,
      padding: 16,
      marginBottom: 16,
    },
    errorBox: {
      borderWidth: 1,
      borderRadius: TOKENS.borderRadius.sm,
      padding: 16,
      marginBottom: 20,
      backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : '#FEF2F2',
      borderColor: colors.feedback.error,
    },
    errorBoxText: {
      fontSize: 12,
      textAlign: 'center',
      lineHeight: 18,
      color: colors.feedback.error,
    },
    successBox: {
      borderWidth: 1,
      borderRadius: TOKENS.borderRadius.sm,
      padding: 16,
      marginBottom: 20,
      backgroundColor: isDark ? 'rgba(16,185,129,0.1)' : '#F0FDF4',
      borderColor: colors.feedback.success,
    },
    successBoxText: {
      fontSize: 12,
      textAlign: 'center',
      lineHeight: 18,
      color: colors.feedback.success,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'right',
      marginBottom: 10,
      lineHeight: 20,
      color: colors.brand.gold,
    },
    bodyText: {
      fontSize: 12,
      lineHeight: 20,
      textAlign: 'right',
      marginBottom: 12,
      color: colors.text.primary,
    },
    description: {
      fontSize: 12,
      lineHeight: 20,
      textAlign: 'center',
      marginBottom: 24,
      color: colors.text.secondary,
    },
    scrollContent: {
      padding: 24,
      paddingBottom: 60,
    },
    confirmButton: {
      width: '100%',
      paddingVertical: 14,
      borderRadius: TOKENS.borderRadius.lg,
      backgroundColor: colors.brand.gold,
      justifyContent: 'center',
      alignItems: 'center',
    },
    confirmButtonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 14,
    },
    circularCloseButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.brand.gold,
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: colors.brand.gold,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.18,
          shadowRadius: 4,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    centerAll: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    listContent: {
      padding: 24,
      paddingBottom: 60,
    },
    rowReverse: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    badgeContainer: {
      position: 'absolute',
      top: -2,
      right: -2,
      backgroundColor: colors.feedback.error,
      minWidth: 14,
      height: 14,
      borderRadius: 7,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 2,
      borderWidth: 1,
      borderColor: '#FFFFFF',
    },
    badgeText: {
      color: '#FFFFFF',
      fontSize: 8,
      fontWeight: 'bold',
      lineHeight: 10,
    },
    offlineBanner: {
      borderRadius: 12,
      borderWidth: 0.8,
      overflow: 'hidden',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 2,
    },
    offlineContent: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    offlineIndicator: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginLeft: 8,
    },
    offlineText: {
      fontSize: 12,
      fontWeight: '700',
      textAlign: 'right',
      lineHeight: 18,
    },
    wrapperAbsolute: {
      position: 'absolute',
      left: 0,
      right: 0,
    },
    bellButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },

    // حقول الإدخال
    formLabel: {
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 8,
      textAlign: 'right',
      color: colors.text.primary,
    },
    formInput: {
      width: '100%',
      height: 48,
      borderWidth: 0.6,
      borderRadius: TOKENS.borderRadius.full,
      paddingHorizontal: 16,
      fontSize: 13,
      textAlign: 'right',
      marginBottom: 20,
      backgroundColor: colors.background.input,
      color: colors.text.primary,
    },
    formTextArea: {
      height: 120,
      paddingTop: 12,
      paddingBottom: 12,
    },

    // أنماط النوافذ المنبثقة
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      borderRadius: TOKENS.borderRadius.xl,
      padding: 24,
      width: '85%',
      alignItems: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },

    // نمط رأس الشيت - مشترك بين PostModal و NotificationsScreen
    sheetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingBottom: 8,
      paddingTop: 4,
    },
    sheetHeaderLeft: {
      width: 60,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    sheetHeaderRight: {
      width: 60,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    sheetHeaderTitle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sheetTitleText: {
      fontSize: 16,
      fontWeight: 'bold',
      lineHeight: 22,
      textAlign: 'center',
    },

    // أزرار الإجراءات (مشترك مع LikeButton و PostDetailSheet)
    iconCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 6,
    },
    actionLabel: {
      fontSize: 12,
      fontWeight: '600',
    },
    sheetActionRow: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginTop: 4,
    },

    // أنماط النقاط (مشترك مع PrivacySubScreen و EulaModal)
    bulletItem: {
      flexDirection: 'row-reverse',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    bulletSymbol: {
      fontSize: 14,
      marginLeft: 8,
    },
    bulletText: {
      flex: 1,
      fontSize: 12,
      lineHeight: 20,
      textAlign: 'right',
    },

    // زر الإلغاء المحدد
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

    // أنماط الحلقات - مشتركة بين Logo و IntroScreen و NotificationModal
    ring: {
      position: 'absolute',
      borderWidth: 2.5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    ringOuter3: {
      opacity: 0.12,
    },
    ringOuter2: {
      opacity: 0.35,
    },
    ringOuter1: {
      opacity: 0.7,
    },
  });

export const useSharedStyles = () => {
  const { colors, isDark } = useTheme();
  return getSharedStyles(colors, isDark);
};

export const sharedStyles = getSharedStyles(LIGHT_COLORS, false);
