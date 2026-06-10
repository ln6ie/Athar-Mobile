// أنماط شاشة الخلاصة - بطاقات المنشورات والتبويبات
import { StyleSheet, Platform } from 'react-native';
import { TOKENS, LIGHT_COLORS } from '../constants/tokens';
import { useTheme } from '../hooks/useTheme';

export const getFeedStyles = (colors: typeof LIGHT_COLORS, isDark: boolean = false) =>
  StyleSheet.create({
    card: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border.muted,
    },
    cardHeader: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    anonymousName: {
      fontWeight: 'bold',
      fontSize: 13,
      lineHeight: 18,
      color: colors.brand.gold,
    },
    timeText: {
      fontSize: 10,
      lineHeight: 14,
      color: colors.text.disabled,
    },
    content: {
      fontSize: 15,
      lineHeight: 23,
      fontWeight: 'normal',
      marginBottom: 12,
      color: colors.text.primary,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    likeActionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    expiryText: {
      fontSize: 10,
      lineHeight: 14,
      color: colors.text.disabled,
    },
    skeletonCard: {
      paddingHorizontal: 6,
      paddingVertical: 6,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border.muted,
    },
    skeletonHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    skeletonNameBlock: {
      width: 80,
      height: 12,
      borderRadius: 6,
    },
    skeletonTimeBlock: {
      width: 40,
      height: 10,
      borderRadius: 5,
    },
    skeletonContentContainer: {
      marginBottom: 12,
    },
    skeletonContentLine: {
      height: 14,
      borderRadius: 7,
      marginBottom: 8,
    },
    skeletonFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    skeletonLikeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    skeletonRippleOuterRing: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 1.5,
      borderColor: colors.border.muted,
    },
    skeletonLikeCountBlock: {
      width: 20,
      height: 12,
      borderRadius: 6,
      marginLeft: 6,
    },
    skeletonExpiryBlock: {
      width: 120,
      height: 10,
      borderRadius: 5,
    },
    topHeaderRow: {
      position: 'absolute',
      left: 16,
      right: 16,
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    centeredTabsCard: {
      width: 170,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      padding: 3,
    },
    tabsWrapper: {
      flexDirection: 'row-reverse',
      flex: 1,
      borderRadius: 20,
      position: 'relative',
      padding: 3,
    },
    tabButton: {
      flex: 1,
      height: 38,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2,
    },
    activeSlider: {
      position: 'absolute',
      right: 3,
      top: 3,
      height: 32,
      borderRadius: 16,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 3.5,
      elevation: 2,
      zIndex: 1,
    },
    tabText: {
      fontSize: 13.5,
      fontWeight: '600',
      color: colors.text.secondary,
    },
    activeTabText: {
      fontWeight: '700',
      color: '#FFFFFF',
    },
    sideNotificationButton: {
      position: 'absolute',
      left: 0,
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    feedListContent: {
      paddingHorizontal: 12,
      paddingBottom: 140,
    },
    loaderFooter: {
      paddingVertical: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bellContainer: {
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    bellLoop: {
      width: 8,
      height: 6,
      borderWidth: 2,
      borderBottomWidth: 0,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      position: 'absolute',
      top: 2,
    },
    bellBody: {
      width: 14,
      height: 10,
      borderTopLeftRadius: 7,
      borderTopRightRadius: 7,
      position: 'absolute',
      top: 6,
    },
    bellFlare: {
      width: 18,
      height: 2.5,
      borderRadius: 1.5,
      position: 'absolute',
      top: 15,
    },
    bellClapper: {
      width: 5,
      height: 4,
      borderBottomLeftRadius: 2.5,
      borderBottomRightRadius: 2.5,
      position: 'absolute',
      bottom: 2,
    },
    postContainer: { flexDirection: 'row-reverse', alignItems: 'center' },
    concaveHeader: {
      width: '100%',
      backgroundColor: 'transparent',
    },

    // محتوى المنشور (مشترك مع PostDetailSheet و PostCard)
    postContent: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: 'normal',
      marginBottom: 12,
    },

    // فاصل
    separator: {
      height: 0.5,
      width: '100%',
      marginVertical: 14,
    },
  });

export const useFeedStyles = () => {
  const { colors, isDark } = useTheme();
  return getFeedStyles(colors, isDark);
};

export const feedStyles = getFeedStyles(LIGHT_COLORS, false);
