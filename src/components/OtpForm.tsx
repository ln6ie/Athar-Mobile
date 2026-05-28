import React, { useState, useRef } from 'react';
import { View, Text, TextInput, ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import { useGlobalStyles } from '../styles/globalStyles';
import { useTheme } from '../hooks/useTheme';
import { BouncyPressable } from './BouncyPressable';

interface OtpFormProps {
  email: string;
  onSubmit: (code: string) => void;
  onBack: () => void;
  isLoading: boolean;
  error?: string | null;
}

export const OtpForm: React.FC<OtpFormProps> = ({
  email,
  onSubmit,
  onBack,
  isLoading,
  error,
}) => {
  const [otpCode, setOtpCode] = useState('');
  const globalStyles = useGlobalStyles();
  const { colors, isDark } = useTheme();
  const inputRef = useRef<TextInput>(null);

  const codeLength = 6;
  const digits = Array.from({ length: codeLength }, (_, i) => otpCode[i] || '');

  const handleVerify = () => {
    onSubmit(otpCode.trim());
  };

  const isSubmitDisabled = isLoading || otpCode.length !== codeLength;

  return (
    <View>
      <Text style={globalStyles.label}>رمز التحقق (OTP)</Text>
      <Text style={[styles.otpSublabel, { color: colors.text.secondary }]}>
        أدخل الرمز المرسل إلى {email}
      </Text>

      {/* Container holding both the hidden interactive overlay and visual cards */}
      <View style={styles.otpInputContainer}>
        {/* Row of 6 Gorgeous Individual Styled Rounded Square Digit Boxes */}
        <View style={styles.otpBoxesRow} pointerEvents="none">
          {digits.map((digit, idx) => {
            const isFocused = otpCode.length === idx;
            return (
              <View
                key={idx}
                style={[
                  styles.digitBox,
                  {
                    backgroundColor: colors.background.input,
                    borderColor: isFocused
                      ? colors.brand.gold
                      : isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.06)',
                    borderWidth: isFocused ? 1.5 : 0.6,
                  },
                ]}
              >
                <Text style={[styles.digitText, { color: colors.text.primary }]}>
                  {digit}
                </Text>
                {isFocused && (
                  <View style={[styles.activeCursor, { backgroundColor: colors.brand.gold }]} />
                )}
              </View>
            );
          })}
        </View>

        {/* 
          Invisibly overlaying real text input over the boxes.
          Receives all touch, long-press gestures to summon clipboard Paste, 
          and enables seamless native OS autocomplete suggestions (SMS OTP code).
        */}
        <TextInput
          ref={inputRef}
          keyboardType="number-pad"
          textContentType="oneTimeCode" // iOS Auto-fill OTP from SMS
          autoComplete="one-time-code" // Android Auto-fill OTP from SMS
          maxLength={codeLength}
          value={otpCode}
          onChangeText={(txt) => {
            const cleaned = txt.replace(/[^0-9]/g, '');
            setOtpCode(cleaned);
            if (cleaned.length === codeLength) {
              onSubmit(cleaned); // Direct Auto-Submit on paste or full input!
            }
          }}
          style={styles.hiddenInput}
          underlineColorAndroid="transparent"
          caretHidden={true} // Hide cursor inside the transparent overlay
          autoFocus
        />
      </View>

      {error ? (
        <Text style={[styles.errorText, { color: colors.feedback.error }]}>
          {error}
        </Text>
      ) : null}

      <BouncyPressable
        onPress={handleVerify}
        disabled={isSubmitDisabled}
        style={[
          globalStyles.button,
          isSubmitDisabled && globalStyles.buttonDisabled,
        ]}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={globalStyles.buttonText}>تأكيد الدخول</Text>
        )}
      </BouncyPressable>

      <BouncyPressable
        onPress={onBack}
        style={globalStyles.secondaryButton}
      >
        <Text style={globalStyles.secondaryButtonText}>تغيير البريد الإلكتروني</Text>
      </BouncyPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  otpInputContainer: {
    width: '100%',
    height: 48,
    position: 'relative',
    marginVertical: 20,
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.01, // Practically transparent but catches gestures for paste
    fontSize: 24,
    color: 'transparent',
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  otpBoxesRow: {
    flexDirection: 'row', // Left-to-right number layout even in Arabic
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    paddingHorizontal: 2,
  },
  digitBox: {
    width: 44,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  digitText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeCursor: {
    position: 'absolute',
    bottom: 8,
    width: 12,
    height: 2.5,
    borderRadius: 1.25,
  },
  otpSublabel: {
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 12,
    paddingHorizontal: 4,
    lineHeight: 20,
  },
  errorText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
});
