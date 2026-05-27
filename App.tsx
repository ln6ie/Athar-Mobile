import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
import { useConfigStore } from './src/store/useConfigStore';
import { ForceUpdateModal } from './src/components/ForceUpdateModal';

const Tab = createBottomTabNavigator();

export default function App() {
  const { isAuthenticated, isInitialized, initialize } = useAuthStore();
  const { initializeTheme } = useThemeStore();
  const { colors, isDark } = useTheme();
  const { createPost, initializeFeed } = useFeedStore();
  const { checkAppVersion } = useConfigStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    forceArabicLayout();
    
    // Check app version and initializations
    checkAppVersion();
    
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
      <ForceUpdateModal />
      {isAuthenticated ? (
        <NavigationContainer>
          <View style={[styles.container, { backgroundColor: colors.background.default }]}>
            <Tab.Navigator
              tabBar={(props) => {
                const currentRouteName = props.state.routeNames[props.state.index];
                return (
                  <FloatingTabBar
                    activeTab={currentRouteName === 'feed' ? 'feed' : 'profile'}
                    onChangeTab={(tab) => props.navigation.navigate(tab)}
                    onAddPress={() => setModalVisible(true)}
                  />
                );
              }}
              screenOptions={{
                headerShown: false,
              }}
            >
              <Tab.Screen name="feed" component={FeedScreen} />
              <Tab.Screen name="profile" component={ProfileScreen} />
            </Tab.Navigator>
            
            <PostModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onSubmit={createPost}
            />
          </View>
        </NavigationContainer>
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
