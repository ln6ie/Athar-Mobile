import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { RequestOtpSchema } from '../types/schemas';
import { useGlobalStyles } from '../styles/globalStyles';
import { EmailForm } from '../components/EmailForm';
import { OtpForm } from '../components/OtpForm';
import { Logo } from '../components/Logo';
import { useTheme } from '../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConcaveHeaderEdge } from '../components/ConcaveHeaderEdge';

interface LoginScreenProps {
  onSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
  const { sendOtp, verifyOtp, isLoading, error, clearError } = useAuthStore();
  const globalStyles = useGlobalStyles();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'EMAIL' | 'OTP'>('EMAIL');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    const formattedEmail = email.trim().toLowerCase();
    console.log('[LoginScreen] handleSendOtp clicked for email:', formattedEmail);
    setLocalError(null);
    clearError();

    const validation = RequestOtpSchema.safeParse({ email: formattedEmail });
    if (!validation.success) {
      const err =
        validation.error.issues[0]?.message ||
        'البريد الإلكتروني غير صالح';
      console.log('[LoginScreen] Validation failed:', err);
      setLocalError(err);
      return;
    }

    try {
      console.log('[LoginScreen] Sending OTP via authStore...');
      await sendOtp(formattedEmail);
      console.log('[LoginScreen] OTP successfully sent! Setting step to OTP.');
      setStep('OTP');
    } catch (e: any) {
      console.error('[LoginScreen] sendOtp error caught in component:', e);
      // Handled by store
    }
  };

  const handleVerifyOtp = async (code: string) => {
    const formattedEmail = email.trim().toLowerCase();
    console.log('[LoginScreen] handleVerifyOtp clicked. Email:', formattedEmail, 'Code:', code);
    setLocalError(null);
    clearError();

    try {
      console.log('[LoginScreen] Verifying OTP via authStore...');
      await verifyOtp(formattedEmail, code);
      console.log('[LoginScreen] OTP verification success! Triggering onSuccess.');
      onSuccess();
    } catch (e: any) {
      console.error('[LoginScreen] verifyOtp error caught in component:', e);
      // Handled by store
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
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Flat brand header with Concave Arch Edge */}
          <View style={styles.headerWrapper}>
            <View
              style={[
                styles.blueBase,
                {
                  backgroundColor: colors.brand.gold,
                  paddingTop: insets.top + 128, // Pushes content down below notch while background bleeds up
                  paddingBottom: 24,
                },
              ]}
            >
              {/* Logo (Left) and Text (Right) premium layout */}
              <View style={styles.headerRow}>
                {/* Logo inside solid white circle on the left */}
                <View style={styles.logoCircle}>
                  <Logo size={50} color={colors.brand.gold} />
                </View>

                {/* Brand text on the right (Arabic RTL) */}
                <View style={styles.brandTextColumn}>
                  <Text style={styles.brandTitle}>أثر</Text>
                  <Text style={styles.brandSubtitle}>أنشر بالمجهول وبكل حرية ! </Text>
                </View>
              </View>
            </View>

            {/* The Concave Edge absolute-anchored at the bottom */}
            <ConcaveHeaderEdge
              color={colors.brand.gold}
              height={60}
              style={styles.concaveEdge}
            />
          </View>

          {/* Form switching and input area */}
          <View style={styles.innerContainer}>
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
              />
            ) : (
              <OtpForm
                email={email}
                onSubmit={handleVerifyOtp}
                onBack={() => {
                  console.log('[LoginScreen] Returning to email step.');
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

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  headerWrapper: {
    width: '100%',
    position: 'relative',
    marginTop: -100, // Pulls the background up to bleed under the status bar
    zIndex: 10,
  },
  blueBase: {
    width: '100%',
  },
  concaveEdge: {
    position: 'absolute',
    bottom: -60,
    left: 0,
    right: 0,
    zIndex: 15,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 28,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  brandTextColumn: {
    alignItems: 'flex-end',
    flex: 1,
    marginLeft: 16,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'right',
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'right',
    lineHeight: 18,
  },
  innerContainer: {
    width: '100%',
    paddingHorizontal: 28,
    marginTop: 70, // Spacing cleared perfectly for the deep S-Curve SVG!
  },
});
