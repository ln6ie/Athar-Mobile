// حاويات حالات الواجهة - تحميل وفراغ وخطأ
import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { useSharedStyles } from '../../styles';

export const LoadingState: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const sharedStyles = useSharedStyles();
  return (
    <View style={sharedStyles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.brand.gold} />
      <Text style={sharedStyles.loadingText}>{t('common.loading')}</Text>
    </View>
  );
};

export const EmptyState: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const sharedStyles = useSharedStyles();
  return (
    <View style={sharedStyles.emptyContainer}>
      <Text style={[sharedStyles.emptyTitle, { color: colors.brand.gold }]}>{t('common.no_posts')}</Text>
      <Text style={sharedStyles.emptySubtitle}>{t('common.no_posts_hint')}</Text>
    </View>
  );
};

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  const { t } = useTranslation();
  const sharedStyles = useSharedStyles();
  return (
    <View style={sharedStyles.errorContainer}>
      <Text style={sharedStyles.errorText}>
        {message || t('common.connection_failed')}
      </Text>
      <TouchableOpacity
        onPress={onRetry}
        style={sharedStyles.retryButton}
        activeOpacity={0.8}
      >
        <Text style={sharedStyles.retryButtonText}>{t('common.retry')}</Text>
      </TouchableOpacity>
    </View>
  );
};
