import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from './src/store/useAuthStore';
import { useFeedStore } from './src/store/useFeedStore';
import { useThemeStore } from './src/store/useThemeStore';
import { useTheme } from './src/hooks/useTheme';
import { LoginScreen } from './src/screens/LoginScreen';
import { FeedScreen } from './src/screens/FeedScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { FloatingTabBar } from './src/components/FloatingTabBar';
import { PostModal } from './src/components/PostModal';
import { forceArabicLayout } from './src/utils/rtl';
import { IntroScreen } from './src/screens/IntroScreen';

export default function App() {
  const { isAuthenticated, isInitialized, initialize } = useAuthStore();
  const { initializeTheme } = useThemeStore();
  const { colors, isDark } = useTheme();
  const { createPost, initializeFeed } = useFeedStore();
  const [activeTab, setActiveTab] = useState<'feed' | 'profile'>('feed');
  const [modalVisible, setModalVisible] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    forceArabicLayout();
    
    // Initialize authentication, theme, and feed cache concurrently
    Promise.all([initialize(), initializeTheme(), initializeFeed()]).catch((err) => {
      console.error('[App] Initialization error', err);
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
      {isAuthenticated ? (
        <View style={[styles.container, { backgroundColor: colors.background.default }]}>
          {activeTab === 'feed' ? <FeedScreen /> : <ProfileScreen />}
          <FloatingTabBar 
            activeTab={activeTab} 
            onChangeTab={setActiveTab} 
            onAddPress={() => setModalVisible(true)}
          />
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
});

