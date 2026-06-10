// أنماط شاشة الملف الشخصي - البطاقات والخيارات والنماذج
import { StyleSheet, Platform } from 'react-native';
import { TOKENS, LIGHT_COLORS } from '../constants/tokens';
import { useTheme } from '../hooks/useTheme';

export const getProfileStyles = (colors: typeof LIGHT_COLORS, isDark: boolean = false) =>
  StyleSheet.create({
    listContent: { padding: 24, paddingBottom: 140 },
    profileHeaderCard: {
      alignItems: 'stretch',
      paddingVertical: 16,
      paddingHorizontal: 16,
      marginBottom: 12,
      marginTop: 8,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0 : 0.04,
      shadowRadius: 12,
      elevation: 2,
    },
    profileMainRow: { flexDirection: 'row-reverse', alignItems: 'center', width: '100%', paddingVertical: 8 },
    profileInfoColumn: { flex: 1, alignItems: 'flex-start' },
    profileMetaRow: { flexDirection: 'row-reverse', alignItems: 'center', marginTop: 6 },
    avatarCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.brand.gold,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.brand.gold,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
      marginLeft: 16,
    },
    avatarText: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold', lineHeight: 34 },
    profileName: { fontSize: 18, fontWeight: 'bold', color: colors.text.primary, lineHeight: 24, textAlign: 'right' },
    inlineStatsBox: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      marginRight: 10,
      backgroundColor: colors.background.input,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: TOKENS.borderRadius.full,
    },
    statVal: { fontSize: 11, fontWeight: 'bold', color: colors.text.primary, lineHeight: 14 },
    statLabel: { fontSize: 9, color: colors.text.secondary, marginRight: 4, lineHeight: 12 },
    profileEmail: { fontSize: 11, color: colors.text.secondary, marginTop: 6, lineHeight: 16, textAlign: 'right' },
    optionsCard: {
      padding: 16,
      marginTop: 8,
      marginBottom: 8,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0 : 0.04,
      shadowRadius: 12,
      elevation: Platform.OS === 'android' ? 0 : 2,
    },
    optionsTitle: { fontSize: 12, fontWeight: 'bold', color: colors.brand.gold, textAlign: 'right', marginBottom: 12 },
    optionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.muted,
    },
    lastOptionRow: { borderBottomWidth: 0, paddingBottom: 4 },
    optionLabel: { fontSize: 13, color: colors.text.primary },
    optionLabelRed: { fontSize: 13, color: '#DC2626', fontWeight: 'bold' },
    chevron: { fontSize: 18, color: colors.text.disabled, fontWeight: '600' },
    chevronRed: { fontSize: 18, color: '#DC2626', fontWeight: 'bold' },
    sectionTitle: { fontSize: 14, fontWeight: 'bold', color: colors.text.primary, alignSelf: 'flex-start', marginTop: 32, marginBottom: 8, lineHeight: 22 },
    emptyContainer: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 16 },
    emptyIconCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: 'rgba(0, 85, 165, 0.05)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
      borderWidth: 3,
      borderColor: colors.brand.gold,
    },
    emptyIconDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.brand.gold },
    emptyTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text.primary, marginBottom: 8, lineHeight: 24 },
    emptyDescription: { fontSize: 12, color: colors.text.secondary, textAlign: 'center', lineHeight: 20 },
    tabContainer: {
      flexDirection: 'row-reverse',
      backgroundColor: isDark ? '#000000' : '#E5E5EA',
      borderRadius: 24,
      padding: 4,
      marginTop: 28,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
    },
    tabToggle: { flex: 1, paddingVertical: 10, borderRadius: 20, alignItems: 'center' },
    tabToggleActive: {
      backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
      borderWidth: isDark ? 1 : 0.5,
      borderRadius: 20,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    tabToggleText: { fontSize: 13, fontWeight: '600', color: colors.text.secondary },
    tabToggleTextActive: { color: colors.brand.gold, fontWeight: 'bold' },
    
    // أنماط الأيقونات
    optionRightContainer: { flexDirection: 'row', alignItems: 'center' },
    optionIconWrapper: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center', marginLeft: 12 },

    // تخطيط رأس العلامة التجارية (مشترك مع LoginScreen و ProfileHeaderCard و UserInfoModal)
    headerWrapper: {
      width: '100%',
      position: 'relative',
      zIndex: 10,
    },
    blueBase: {
      width: '100%',
    },
    concaveEdge: {
      position: 'absolute',
      bottom: -60,
      left: 0,
      right: 0,
      zIndex: 15,
    },
    avatarCircleLarge: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: 28,
    },
    brandTextColumn: {
      alignItems: 'flex-end',
      flex: 1,
      marginLeft: 16,
    },
    brandTitle: {
      fontSize: 34,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 4,
      textAlign: 'right',
    },
    brandSubtitle: {
      fontSize: 12,
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.85)',
      textAlign: 'right',
      lineHeight: 18,
    },
  });

export const useProfileStyles = () => {
  const { colors, isDark } = useTheme();
  return getProfileStyles(colors, isDark);
};

export const styles = getProfileStyles(LIGHT_COLORS, false);

