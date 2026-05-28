import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface OfflineBannerProps {
  topOffset: number;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ topOffset }) => {
  return (
    <View style={[styles.offlineBanner, { top: topOffset }]}>
      <View style={styles.offlineIndicator} />
      <Text style={styles.offlineText}>
        أنت تتصفح في وضع عدم الاتصال بالإنترنت حالياً
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  offlineBanner: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 38,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
    paddingHorizontal: 16,
    zIndex: 9,
  },
  offlineIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D97706',
    marginHorizontal: 8,
  },
  offlineText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#92400E',
    letterSpacing: 0.3,
  },
});
