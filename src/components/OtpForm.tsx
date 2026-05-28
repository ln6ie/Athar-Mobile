import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator, StyleSheet, Pressable, Clipboard } from 'react-native';
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
  const [clipboardCode, setClipboardCode] = useState<string | null>(null);
  const globalStyles = useGlobalStyles();
  const { colors, isDark } = useTheme();
  const inputRef = useRef<TextInput>(null);

  const codeLength = 6;
  const digits = Array.from({ length: codeLength }, (_, i) => otpCode[i] || '');

  // Check clipboard on mount and focus to see if there is an active OTP to suggest
  const checkClipboardForOTP = async () => {
    try {
      const content = await Clipboard.getString();
      if (content && /^[0-9]{6}$/.test(content.trim())) {
        setClipboardCode(content.trim());
      } else {
        setClipboardCode(null);
      }
    } catch (err) {
      console.log('Clipboard access error', err);
    }
  };

  useEffect(() => {
    checkClipboardForOTP();
  }, []);

  const handleVerify = () => {
    onSubmit(otpCode.trim());
  };

  const handlePressBoxes = async () => {
    inputRef.current?.focus();
    await checkClipboardForOTP();
    
    // Smart magic auto-paste: if there is a 6-digit OTP in the clipboard, auto-fill & login instantly on tap!
    if (clipboardCode) {
      setOtpCode(clipboardCode);
      onSubmit(clipboardCode);
    }
  };

  const handleQuickPaste = () => {
    if (clipboardCode) {
      setOtpCode(clipboardCode);
      onSubmit(clipboardCode);
    }
  };

  const isSubmitDisabled = isLoading || otpCode.length !== codeLength;

  return (
    <View>
      <Text style={globalStyles.label}>رمز التحقق (OTP)</Text>
      <Text style={[styles.otpSublabel, { color: colors.text.secondary }]}>
        أدخل الرمز المرسل إلى {email}
      </Text>

      {/* Stable, off-screen native TextInput that NEVER loses focus or hides keyboard */}
      <TextInput
        ref={inputRef}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={codeLength}
        value={otpCode}
        onChangeText={(txt) => {
          const cleaned = txt.replace(/[^0-9]/g, '');
          setOtpCode(cleaned);
          if (cleaned.length === codeLength) {
            onSubmit(cleaned); // Auto submit on full input
          }
        }}
        style={styles.hiddenInput}
        underlineColorAndroid="transparent"
        autoFocus
      />

      {/* Row of 6 Gorgeous Individual Styled Rounded Square Digit Boxes */}
      <Pressable style={styles.otpBoxesRow} onPress={handlePressBoxes}>
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
      </Pressable>

      {/* Premium Quick Paste Hint Box (Only appears if a valid 6-digit OTP is in the clipboard) */}
      {clipboardCode && (
        <BouncyPressable
          onPress={handleQuickPaste}
          style={[styles.quickPasteContainer, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(0, 85, 165, 0.08)' }]}
        >
          <Text style={[styles.quickPasteText, { color: colors.brand.gold }]}>
            📋 لصق الرمز من الحافظة: {clipboardCode}
          </Text>
        </BouncyPressable>
      )}

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
  hiddenInput: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 1,
    height: 1,
    opacity: 0,
  },
  otpBoxesRow: {
    flexDirection: 'row', // Left-to-right number layout even in Arabic
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
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
  quickPasteContainer: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  quickPasteText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
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
