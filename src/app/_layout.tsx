import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';
import { useFeedStore } from '../store/useFeedStore';
import { useThemeStore } from '../store/useThemeStore';
import { useTheme } from '../hooks/useTheme';
import { LoginScreen } from '../screens/LoginScreen';
import { PostModal } from '../components/PostModal';
import { forceArabicLayout } from '../utils/rtl';
import { IntroScreen } from '../screens/IntroScreen';
import { useConfigStore } from '../store/useConfigStore';
import { ForceUpdateModal } from '../components/ForceUpdateModal';
import { TOKENS } from '../constants/tokens';

export default function RootLayout() {
  const { isAuthenticated, isInitialized, initialize } = useAuthStore();
  const { initializeTheme } = useThemeStore();
  const { colors, isDark } = useTheme();
  const { createPost, initializeFeed } = useFeedStore();
  const { checkAppVersion } = useConfigStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    forceArabicLayout();
    checkAppVersion();
    
    Promise.all([initialize(), initializeTheme(), initializeFeed()]).catch((err) => {
      console.error('[RootLayout] Initialization error', err);
    });

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash || !isInitialized) {
    return (
      <SafeAreaProvider>
        <IntroScreen />
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ForceUpdateModal />
      {isAuthenticated ? (
        <View style={[styles.container, { backgroundColor: colors.background.default }]}>
          <Slot />
          
          {/* Real System Navigation overlay for Premium Floating Add Button */}
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={[
              styles.standaloneAddButton, 
              { backgroundColor: colors.brand.gold, shadowColor: colors.brand.gold }
            ]}
            activeOpacity={0.85}
          >
            <View style={styles.plusIconContainer}>
              <View style={styles.plusBarHorizontal} />
              <View style={styles.plusBarVertical} />
            </View>
          </TouchableOpacity>

          <PostModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onSubmit={createPost}
          />
        </View>
      ) : (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
          <LoginScreen onSuccess={() => {}} />
        </SafeAreaView>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  standaloneAddButton: {
    position: 'absolute',
    bottom: 34,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.22,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  plusIconContainer: {
    width: 24,
    height: 24,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusBarHorizontal: {
    position: 'absolute',
    width: 22,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  plusBarVertical: {
    position: 'absolute',
    width: 4,
    height: 22,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
});
