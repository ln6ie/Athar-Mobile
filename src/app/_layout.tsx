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
import { GlassicView } from '../components/GlassicView';
import { BouncyPressable } from '../components/BouncyPressable';
import { SymbolView } from 'expo-symbols';


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

  const shouldShowIntro = showSplash || !isInitialized;

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ForceUpdateModal />

      {/* Main router tree is always mounted to ensure Expo Router resolves correctly */}
      <View style={[styles.container, { backgroundColor: colors.background.default }]}>
        <Slot />
        
        {/* Real System Navigation overlay for Premium Floating Add Button */}
        {isAuthenticated && !shouldShowIntro && (
          <GlassicView
            cornerRadius={30}
            style={[
              styles.standaloneAddButton,
              {
                backgroundColor: colors.brand.gold,
              }
            ]}
          >
            <BouncyPressable
              onPress={() => setModalVisible(true)}
              style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
            >
              <SymbolView
                name={{ ios: 'plus', android: 'add' }}
                size={24}
                tintColor="#FFFFFF"
              />
            </BouncyPressable>
          </GlassicView>
        )}

        {isAuthenticated && (
          <PostModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onSubmit={createPost}
          />
        )}
      </View>

      {/* Login Screen Overlay when not authenticated */}
      {!isAuthenticated && isInitialized && !showSplash && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background.default, zIndex: 500 }]}>
          <SafeAreaView style={styles.container}>
            <LoginScreen onSuccess={() => {}} />
          </SafeAreaView>
        </View>
      )}

      {/* Intro Animated Screen Overlay during loading */}
      {shouldShowIntro && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 9999 }]}>
          <IntroScreen />
        </View>
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
    bottom: 28, // Mathematically centered with native tab bar items!
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    zIndex: 999,
  },
});
