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
          {/* Curved Layered Wave Header Container */}
          <View style={styles.headerWrapper}>
            {/* Background Accent Wave Layer for Depth */}
            <View
              style={[
                styles.backgroundWave,
                {
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(0, 85, 165, 0.12)',
                },
              ]}
            />

            {/* Foreground Main Curved Wave Card */}
            <View
              style={[
                styles.mainWaveCard,
                {
                  backgroundColor: colors.brand.gold,
                  paddingTop: Math.max(insets.top + 16, 40),
                },
              ]}
            >
              {/* Logo (Left) and Text (Right) Premium Horizontal Layout */}
              <View style={styles.headerRow}>
                {/* Logo on the Left */}
                <View style={styles.logoWrapper}>
                  <Logo size={70} color="#FFFFFF" />
                </View>

                {/* Brand Titles on the Right (Arabic RTL Aligned) */}
                <View style={styles.brandTextColumn}>
                  <Text style={styles.brandTitle}>أثر</Text>
                  <Text style={styles.brandSubtitle}>أبْقِ أثرك في هذا العالم</Text>
                </View>
              </View>
            </View>
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
  },
  backgroundWave: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: -10,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 130, // Opposite curve layer to create wave overlap
  },
  mainWaveCard: {
    width: '100%',
    paddingBottom: 40,
    borderBottomLeftRadius: 130, // Deep wave sweep on the left
    borderBottomRightRadius: 50,  // Soft curve on the right
    // Premium soft card drop shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 28,
  },
  logoWrapper: {
    // Elegant soft glow backlighting for white logo
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  brandTextColumn: {
    alignItems: 'flex-end', // Align texts to the right for Arabic RTL layout
    flex: 1,
    marginLeft: 16,
  },
  brandTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF', // High-end white text directly overlaying the blue card
    marginBottom: 4,
    textAlign: 'right',
    lineHeight: 46,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)', // Highly readable semi-transparent white on blue
    textAlign: 'right',
    lineHeight: 18,
  },
  innerContainer: {
    width: '100%',
    paddingHorizontal: 28,
    marginTop: 40,
  },
});
