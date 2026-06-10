// شريط عدم الاتصال - يظهر عند فقدان الشبكة
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../hooks/useTheme';
import { useSharedStyles } from '../../styles';
import { useTranslation } from 'react-i18next';

interface OfflineBannerProps {
  topOffset: number;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ topOffset }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const sharedStyles = useSharedStyles();

  const containerBg = isDark
    ? 'rgba(217, 119, 6, 0.15)'
    : 'rgba(245, 158, 11, 0.08)';

  const borderColor = isDark
    ? 'rgba(217, 119, 6, 0.25)'
    : 'rgba(245, 158, 11, 0.15)';

  const textColor = isDark ? '#F59E0B' : '#B45309';
  const indicatorColor = isDark ? '#F59E0B' : '#D97706';

  return (
    <View style={[sharedStyles.wrapperAbsolute, { top: topOffset, paddingHorizontal: 24, zIndex: 99 }]}>
      <View style={[sharedStyles.offlineBanner, { backgroundColor: containerBg, borderColor: borderColor }]}>
        <BlurView
          intensity={45}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
        <View style={sharedStyles.offlineContent}>
          <View style={[sharedStyles.offlineIndicator, { backgroundColor: indicatorColor }]} />
          <Text style={[sharedStyles.offlineText, { color: textColor }]}>
            {t('offline.banner')}
          </Text>
        </View>
      </View>
    </View>
  );
};
