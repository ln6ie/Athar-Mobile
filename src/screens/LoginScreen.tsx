import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { RequestOtpSchema } from '../types/schemas';
import { useGlobalStyles } from '../styles/globalStyles';
import { EmailForm } from '../components/EmailForm';
import { OtpForm } from '../components/OtpForm';
import { Logo } from '../components/Logo';

interface LoginScreenProps {
  onSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
  const { sendOtp, verifyOtp, isLoading, error, clearError } = useAuthStore();
  const globalStyles = useGlobalStyles();

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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={globalStyles.keyboardAvoid}
      >
        <View style={styles.innerContainer}>
          {/* Brand Header */}
          <View style={globalStyles.headerContainer}>
            <View style={{ marginBottom: 16 }}>
              <Logo size={80} />
            </View>
            <Text style={globalStyles.brandTitle}>أثر</Text>
            <Text style={globalStyles.brandSubtitle}>أبْقِ أثرك في هذا العالم</Text>
          </View>

          {/* Form switching */}
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
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    width: '100%',
    paddingHorizontal: 32,
  },
});
