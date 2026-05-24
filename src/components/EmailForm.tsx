import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useGlobalStyles } from '../styles/globalStyles';

interface EmailFormProps {
  email: string;
  onChangeEmail: (email: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const EmailForm: React.FC<EmailFormProps> = ({
  email,
  onChangeEmail,
  onSubmit,
  isLoading,
}) => {
  const globalStyles = useGlobalStyles();

  return (
    <View>
      <Text style={globalStyles.label}>البريد الإلكتروني</Text>

      <TextInput
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        placeholder="example@domain.com"
        placeholderTextColor="#9CA3AF"
        value={email}
        onChangeText={onChangeEmail}
        textAlign="left"
        style={globalStyles.input}
      />
      <TouchableOpacity
        onPress={onSubmit}
        disabled={isLoading || !email.trim()}
        style={[
          globalStyles.button,
          (isLoading || !email.trim()) && globalStyles.buttonDisabled,
        ]}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={globalStyles.buttonText}>أرسل رمز التحقق</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
