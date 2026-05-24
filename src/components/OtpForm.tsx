import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useGlobalStyles } from '../styles/globalStyles';
import { useTheme } from '../hooks/useTheme';
import { TOKENS } from '../constants/tokens';

interface OtpFormProps {
  email: string;
  onSubmit: (code: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

export const OtpForm: React.FC<OtpFormProps> = ({
  email,
  onSubmit,
  onBack,
  isLoading,
}) => {
  const [otpCode, setOtpCode] = useState('');
  const globalStyles = useGlobalStyles();
  const { colors } = useTheme();

  const handleVerify = () => {
    onSubmit(otpCode.trim());
  };

  return (
    <View>
      <Text style={globalStyles.label}>رمز التحقق (OTP)</Text>
      <Text style={[styles.otpSublabel, { color: colors.text.disabled }]}>أدخل الرمز المرسل إلى {email}</Text>

      <TextInput
        keyboardType="number-pad"
        maxLength={6}
        placeholder="------"
        placeholderTextColor="#9CA3AF"
        value={otpCode}
        onChangeText={setOtpCode}
        textAlign="center"
        style={[styles.otpInput, { backgroundColor: colors.background.input, color: colors.text.primary, borderColor: colors.border.muted }]}
      />

      <TouchableOpacity
        onPress={handleVerify}
        disabled={isLoading || otpCode.length !== 6}
        style={[
          globalStyles.button,
          (isLoading || otpCode.length !== 6) && globalStyles.buttonDisabled,
        ]}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={globalStyles.buttonText}>تأكيد الدخول</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onBack}
        style={globalStyles.secondaryButton}
        activeOpacity={0.7}
      >
        <Text style={globalStyles.secondaryButtonText}>تغيير البريد الإلكتروني</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  otpInput: {
    width: '100%',
    backgroundColor: TOKENS.colors.background.input,
    color: TOKENS.colors.text.primary,
    fontSize: 24,
    fontWeight: 'bold',
    paddingVertical: 16,
    borderRadius: TOKENS.borderRadius.lg,
    borderWidth: 1,
    borderColor: TOKENS.colors.border.muted,
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 4,
  },
  otpSublabel: {
    fontSize: 12,
    color: TOKENS.colors.text.disabled,
    textAlign: 'right',
    marginBottom: 16,
    paddingHorizontal: 4,
    lineHeight: 20,
  },
});
