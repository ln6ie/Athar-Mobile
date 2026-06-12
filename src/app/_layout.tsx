// التخطيط الجذر للتطبيق - إدارة الحالة والمصادقة والشاشات
import 'react-native-reanimated';
import '../constants/locales';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';
import { useFeedStore } from '../store/useFeedStore';
import { useThemeStore } from '../store/useThemeStore';
import { useTheme } from '../hooks/useTheme';
import { LoginScreen } from '../screens/LoginScreen';
import { PostModal } from '../components/feed/PostModal';
import { forceArabicLayout } from '../utils/rtl';
import { initializeLanguage } from '../utils/changeLanguage';
import { IntroScreen } from '../screens/IntroScreen';
import { useConfigStore } from '../store/useConfigStore';
import { ForceUpdateModal } from '../components/shared/ForceUpdateModal';
import { GlassicView } from '../components/shared/GlassicView';
import { BouncyPressable } from '../components/shared/BouncyPressable';
import { SymbolView } from '../components/shared/SymbolView';
import { Snackbar } from '../components/shared/Snackbar';
import { cleanLegacyStorage } from '../store/feedStorage';
import { MemoryMonitor } from '../components/shared/MemoryMonitor';
import { useGlobalStyles, floatingPositions } from '../styles';
import {
  initializeNotifications,
  registerFcmTokenWithBackend,
  handleNotificationOpenedApp,
  setupForegroundMessageHandler,
} from '../services/notificationManager';

// إبقاء الـ native splash حتى نخفيه يدوياً
SplashScreen.preventAutoHideAsync().catch(() => {});

function MainLayout() {
  const { isAuthenticated, isInitialized, initialize } = useAuthStore();
  const { initializeTheme } = useThemeStore();
  const { colors, isDark } = useTheme();
  const { createPost, initializeFeed, isPostModalOpen, setPostModalOpen } = useFeedStore();
  const { checkAppVersion } = useConfigStore();
  const [showSplash, setShowSplash] = useState(true);
  const insets = useSafeAreaInsets();
  const globalStyles = useGlobalStyles();

  useEffect(() => {
    forceArabicLayout();
    checkAppVersion();

    // مسح التخزين القديم قبل تهيئة المتاجر لمنع استنزاف الذاكرة
    cleanLegacyStorage().then(() => {
      Promise.all([
        initialize(),
        initializeTheme(),
        initializeFeed(),
        initializeLanguage()
      ]).catch((err) => {
        console.error('[RootLayout] Initialization error', err);
      });
    });

    handleNotificationOpenedApp();
    const unsubscribeForeground = setupForegroundMessageHandler();

    const timer = setTimeout(() => {
      setShowSplash(false);
      // إخفاء الـ native splash بعد انتهاء الـ intro
      SplashScreen.hideAsync().catch(() => {});
    }, 2500);
    return () => {
      clearTimeout(timer);
      unsubscribeForeground();
    };
  }, []);



  const shouldShowIntro = showSplash || !isInitialized;
  const isPad = Platform.select({ ios: (Platform as any).isPad, default: false });
  const showRootAddButton = isPad;

  // حساب موضع زر الإضافة السفلي ليتوافق مع شريط التبويب
  const buttonBottom = Math.max(insets.bottom - 12, 10);

  return (
    <>
      <StatusBar style="light" {...({ backgroundColor: 'transparent' } as any)} translucent />
      <ForceUpdateModal />

      {/* مسار التوجيه الرئيسي - مثبت دائماً */}
        <View style={[globalStyles.container, { backgroundColor: colors.background.default }]}>
        <Slot />
        
        {/* زر الإضافة العائم للـ iPad */}
        {isAuthenticated && !shouldShowIntro && showRootAddButton && (
          <GlassicView
            cornerRadius={30}
            style={[
              floatingPositions.addButton,
              {
                backgroundColor: colors.brand.gold,
                bottom: buttonBottom, // توسيط عمودي لجميع الشاشات
              }
            ]}
          >
            <BouncyPressable
              onPress={() => setPostModalOpen(true)}
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
            visible={isPostModalOpen}
            onClose={() => setPostModalOpen(false)}
            onSubmit={createPost}
          />
        )}
      </View>

      {/* شاشة تسجيل الدخول عند عدم المصادقة */}
      {!isAuthenticated && isInitialized && !showSplash && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background.default, zIndex: 500 }]}>
          <View style={globalStyles.container}>
            <LoginScreen onSuccess={() => {
              initializeFeed();
            }} />
          </View>
        </View>
      )}

      {/* شاشة البداية المتحركة أثناء التحميل */}
      {shouldShowIntro && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 9999 }]}>
          <IntroScreen />
        </View>
      )}

      {/* شريط الإشعارات المنبثقة */}
      <Snackbar />
 
      {/* مراقب الذاكرة - وضع التطوير فقط */}
      <MemoryMonitor />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <MainLayout />
    </SafeAreaProvider>
  );
}
