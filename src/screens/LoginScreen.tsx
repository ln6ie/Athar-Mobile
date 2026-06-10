import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/useAuthStore';
import { RequestOtpSchema } from '../types/schemas';
import { useGlobalStyles, useProfileStyles, formStyles } from '../styles';
import { EmailForm } from '../components/auth/EmailForm';
import { OtpForm } from '../components/auth/OtpForm';
import { Logo } from '../components/shared/Logo';
import { useTheme } from '../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConcaveHeaderEdge } from '../components/feed/ConcaveHeaderEdge';
import * as AppleAuthentication from 'expo-apple-authentication';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Configure Google Sign-In with client IDs
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
});

interface LoginScreenProps {
  onSuccess: () => void;
}

// شاشة تسجيل الدخول - خطوتان: إدخال البريد ثم التحقق بالرمز OTP
export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const { sendOtp, verifyOtp, loginWithGoogle, loginWithApple, isLoading, error, clearError } = useAuthStore();
  const globalStyles = useGlobalStyles();
  const profileStyles = useProfileStyles();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'EMAIL' | 'OTP'>('EMAIL');
  const [localError, setLocalError] = useState<string | null>(null);
  const [appleAuthAvailable, setAppleAuthAvailable] = useState(false);

  useEffect(() => {
    AppleAuthentication.isAvailableAsync().then(setAppleAuthAvailable);
  }, []);

  const handleGoogleLogin = async () => {
    console.log('[LoginScreen] Starting Google Login...');
    setLocalError(null);
    clearError();
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken || (response as any).idToken;

      if (!idToken) {
        throw new Error('No Google ID token received');
      }

      await loginWithGoogle(idToken);
      onSuccess();
    } catch (e: any) {
      console.error('[LoginScreen] Google Sign-In Error:', e);
      // Avoid showing error when user cancels
      if (e.code !== 'SIGN_IN_CANCELLED' && e.code !== '12501') {
        setLocalError(t('auth.login_failed'));
      }
    }
  };

  const handleAppleLogin = async () => {
    console.log('[LoginScreen] Starting Apple Login...');
    setLocalError(null);
    clearError();
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const identityToken = credential.identityToken;
      if (!identityToken) {
        throw new Error('No Apple identity token received');
      }

      await loginWithApple(identityToken);
      onSuccess();
    } catch (e: any) {
      console.error('[LoginScreen] Apple Sign-In Error:', e);
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        setLocalError(t('auth.login_failed'));
      }
    }
  };

  // إرسال رمز التحقق للبريد الإلكتروني
  const handleSendOtp = async () => {
    const formattedEmail = email.trim().toLowerCase();
    console.log('[LoginScreen] تم النقر على إرسال الرمز للبريد:', formattedEmail);
    setLocalError(null);
    clearError();

    const validation = RequestOtpSchema.safeParse({ email: formattedEmail });
    if (!validation.success) {
      const err =
        validation.error.issues[0]?.message ||
        t('auth.invalid_email');
      console.log('[LoginScreen] فشل التحقق:', err);
      setLocalError(err);
      return;
    }

    try {
      console.log('[LoginScreen] Sending OTP via authStore...');
      await sendOtp(formattedEmail);
      console.log('[LoginScreen] تم إرسال الرمز بنجاح!');
      setStep('OTP');
    } catch (e: any) {
      console.error('[LoginScreen] خطأ في إرسال الرمز:', e);
      // يتم التعامل معه في المتجر
    }
  };

  // التحقق من الرمز وتسجيل الدخول
  const handleVerifyOtp = async (code: string) => {
    const formattedEmail = email.trim().toLowerCase();
    console.log('[LoginScreen] تم النقر على تحقق. البريد:', formattedEmail, 'الرمز:', code);
    setLocalError(null);
    clearError();

    try {
      console.log('[LoginScreen] Verifying OTP via authStore...');
      await verifyOtp(formattedEmail, code);
      console.log('[LoginScreen] نجح التحقق!');
      onSuccess();
    } catch (e: any) {
      console.error('[LoginScreen] خطأ في التحقق:', e);
    }
  };

  const displayError = localError || error;

  return (
    <View style={globalStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={globalStyles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={localStyles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* رأس مسطح مع حافة مقعرة */}
          <View style={profileStyles.headerWrapper}>
            <View
              style={[
                profileStyles.blueBase,
                {
                  backgroundColor: colors.brand.gold,
                  paddingTop: insets.top + 48, // دفع المحتوى لأسفل النوتش
                  paddingBottom: 24,
                },
              ]}
            >
              {/* اللوغو والنص */}
              <View style={profileStyles.headerRow}>
                {/* اللوغو داخل دائرة بيضاء */}
                <View style={profileStyles.avatarCircleLarge}>
                  <Logo size={50} color={colors.brand.gold} />
                </View>

                {/* النص على اليمين */}
                <View style={profileStyles.brandTextColumn}>
                  <Text style={profileStyles.brandTitle}>{t('app.name')}</Text>
                  <Text style={profileStyles.brandSubtitle}>{t('app.tagline')} </Text>
                </View>
              </View>
            </View>

            {/* الحافة المقعرة */}
            <ConcaveHeaderEdge
              color={colors.brand.gold}
              height={60}
              style={profileStyles.concaveEdge}
            />
          </View>

          {/* منطقة تبديل النماذج */}
          <View style={[formStyles.container, { paddingHorizontal: 28, marginTop: 24 }]}>
            {step === 'EMAIL' ? (
              <EmailForm
                email={email}
                onChangeEmail={(val) => {
                  setEmail(val);
                  setLocalError(null);
                }}
                onSubmit={handleSendOtp}
                isLoading={isLoading}
                error={displayError}
                onGoogleLogin={handleGoogleLogin}
                onAppleLogin={handleAppleLogin}
                appleAuthAvailable={appleAuthAvailable}
              />
            ) : (
              <OtpForm
                email={email}
                onSubmit={handleVerifyOtp}
                onBack={() => {
                  console.log('[LoginScreen] العودة لخطوة البريد');
                  setStep('EMAIL');
                  setLocalError(null);
                  clearError();
                }}
                isLoading={isLoading}
                error={displayError}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const localStyles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
});
