// نموذج إدخال رمز التحقق OTP مع دعم اللصق التلقائي
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator, StyleSheet, Pressable, Clipboard } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useGlobalStyles, useSharedStyles, textPresets } from '../../styles';
import { useTheme } from '../../hooks/useTheme';
import { BouncyPressable } from '../shared/BouncyPressable';

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
  const { t } = useTranslation();
  const [otpCode, setOtpCode] = useState('');
  const globalStyles = useGlobalStyles();
  const sharedStyles = useSharedStyles();
  const { colors, isDark } = useTheme();
  const inputRef = useRef<TextInput>(null);

  const codeLength = 6;
  const digits = Array.from({ length: codeLength }, (_, i) => otpCode[i] || '');

  const handleVerify = () => {
    onSubmit(otpCode.trim());
  };

  const handlePressBoxes = () => {
    inputRef.current?.focus();
  };

  const handleQuickPaste = async () => {
    try {
      const content = await Clipboard.getString();
      const cleaned = content ? content.trim() : '';
      if (cleaned && /^[0-9]{6}$/.test(cleaned)) {
        setOtpCode(cleaned);
        onSubmit(cleaned);
      } else {
        alert(t('validation.code_length'));
      }
    } catch (err) {
      console.log('خطأ في قراءة الحافظة', err);
    }
  };

  const isSubmitDisabled = isLoading || otpCode.length !== codeLength;

  return (
    <View>
      <Text style={globalStyles.label}>{t('auth.otp_label')}</Text>
      <Text style={[textPresets.body, { marginBottom: 12, paddingHorizontal: 4, color: colors.text.secondary }]}>
        {t('auth.otp_instructions', { email })}
      </Text>

      {/* حقل إدخال مخفي خارج الشاشة - لا يفقد التركيز أبداً */}
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
            onSubmit(cleaned); // إرسال تلقائي عند اكتمال الإدخال
          }
        }}
        style={localStyles.hiddenInput}
        underlineColorAndroid="transparent"
        autoFocus
      />

      {/* صف من 6 مربعات أرقام دائرية */}
      <Pressable style={localStyles.otpBoxesRow} onPress={handlePressBoxes}>
        {digits.map((digit, idx) => {
          const isFocused = otpCode.length === idx;
          return (
            <View
              key={idx}
              style={[
                localStyles.digitBox,
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
              <Text style={[localStyles.digitText, { color: colors.text.primary }]}>
                {digit}
              </Text>
              {isFocused && (
                <View style={[localStyles.activeCursor, { backgroundColor: colors.brand.gold }]} />
              )}
            </View>
          );
        })}
      </Pressable>

      {/* زر لصق سريع - يظهر دائماً ويقوم بقراءة الحافظة وتعبئتها فقط عند النقر الفعلي لمنع التحذيرات التلقائية */}
      <BouncyPressable
        onPress={handleQuickPaste}
        style={[localStyles.quickPasteContainer, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(0, 85, 165, 0.08)' }]}
      >
        <Text style={[textPresets.bodyCentered, { fontWeight: 'bold', color: colors.brand.gold }]}>
          {t('auth.paste_from_clipboard')}
        </Text>
      </BouncyPressable>

      {error ? (
        <Text style={[sharedStyles.errorText, { color: colors.feedback.error }]}>
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
          <Text style={globalStyles.buttonText}>{t('auth.verify')}</Text>
        )}
      </BouncyPressable>

      <BouncyPressable
        onPress={onBack}
        style={globalStyles.secondaryButton}
      >
        <Text style={globalStyles.secondaryButtonText}>{t('auth.change_email')}</Text>
      </BouncyPressable>
    </View>
  );
};

const localStyles = StyleSheet.create({
  hiddenInput: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 1,
    height: 1,
    opacity: 0,
  },
  otpBoxesRow: {
    flexDirection: 'row', 
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
});
