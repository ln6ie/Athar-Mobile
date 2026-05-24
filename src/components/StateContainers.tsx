import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export const LoadingState: React.FC = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.loadingContainer, { backgroundColor: colors.background.default }]}>
      <ActivityIndicator size="large" color={colors.brand.gold} />
      <Text style={[styles.loadingText, { color: colors.text.secondary }]}>تحميل...</Text>
    </View>
  );
};

export const EmptyState: React.FC = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.emptyContainer, { backgroundColor: colors.background.default }]}>
      <Text style={[styles.emptyTitle, { color: colors.brand.gold }]}>لا يوجد أثر</Text>
      <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>كن البادئ واكتب أثراً.</Text>
    </View>
  );
};

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.errorContainer, { backgroundColor: colors.background.default }]}>
      <Text style={[styles.errorText, { color: colors.feedback.error }]}>
        {message || 'فشل الاتصال.'}
      </Text>
      <TouchableOpacity 
        onPress={onRetry} 
        style={[styles.retryButton, { backgroundColor: colors.brand.gold }]}
        activeOpacity={0.8}
      >
        <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 26,
  },
  emptySubtitle: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
  },
});

