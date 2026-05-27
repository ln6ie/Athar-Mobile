import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Linking } from 'react-native';
import { useConfigStore } from '../store/useConfigStore';
import { useTheme } from '../hooks/useTheme';
import { Logo } from './Logo';

export const ForceUpdateModal: React.FC = () => {
  const { isUpdateRequired, storeUrl } = useConfigStore();
  const { colors } = useTheme();

  const handleUpdate = () => {
    if (storeUrl) {
      Linking.openURL(storeUrl).catch((err) => {
        console.error('Failed to open store link:', err);
      });
    }
  };

  return (
    <Modal
      visible={isUpdateRequired}
      transparent={false}
      animationType="fade"
      hardwareAccelerated
      statusBarTranslucent
      onRequestClose={() => {}} // Strict security: prevent closing on back button
    >
      <View style={[styles.container, { backgroundColor: '#000000' }]}>
        <View style={styles.contentContainer}>
          {/* Unified Programmatic Brand Logo */}
          <View style={styles.logoWrapper}>
            <Logo size={100} />
          </View>

          <Text style={[styles.title, { color: '#FFFFFF' }]}>
            يتوفر تحديث جديد
          </Text>

          <Text style={[styles.description, { color: '#A0AEC0' }]}>
            أطلقنا تحديثاً جديداً لأثر يضم ميزات أمان متقدمة وتحسينات هندسية. لضمان استمرار تجربتك الفاخرة، يرجى تحديث التطبيق الآن.
          </Text>

          <TouchableOpacity
            onPress={handleUpdate}
            style={[styles.button, { backgroundColor: colors.brand.gold }]}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>تحديث الآن</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
  },
  logoWrapper: {
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 8,
  },
  button: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
