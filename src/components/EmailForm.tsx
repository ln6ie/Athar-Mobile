import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useGlobalStyles } from '../styles/globalStyles';
import { useTheme } from '../hooks/useTheme';
import { EulaModal } from './EulaModal';

interface EmailFormProps {
  email: string;
  onChangeEmail: (email: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error?: string | null;
}

export const EmailForm: React.FC<EmailFormProps> = ({
  email,
  onChangeEmail,
  onSubmit,
  isLoading,
  error,
}) => {
  const globalStyles = useGlobalStyles();
  const { colors } = useTheme();
  const [agreed, setAgreed] = useState(false);
  const [showEula, setShowEula] = useState(false);

  return (
    <View>
      <Text style={globalStyles.label}>البريد الإلكتروني</Text>

      <TextInput
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        placeholder="example@gmail.com"
        placeholderTextColor="#9CA3AF"
        value={email}
        onChangeText={onChangeEmail}
        textAlign="left"
        style={globalStyles.input}
        underlineColorAndroid="transparent"
      />

      {error ? (
        <Text style={{ color: colors.feedback.error, fontSize: 12, textAlign: 'right', marginBottom: 12, fontWeight: '600' }}>
          {error}
        </Text>
      ) : null}

      {/* EULA Agreement Checkbox for Apple UGC Guideline 1.2 Compliance */}
      <TouchableOpacity 
        onPress={() => setAgreed(!agreed)} 
        style={{ flexDirection: 'row-reverse', alignItems: 'center', marginVertical: 14, paddingHorizontal: 2 }}
        activeOpacity={0.8}
      >
        <View style={{
          width: 18,
          height: 18,
          borderRadius: 4,
          borderWidth: 1.5,
          borderColor: agreed ? colors.brand.gold : '#D1D5DB',
          backgroundColor: agreed ? colors.brand.gold : 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 8
        }}>
          {agreed ? <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' }}>✓</Text> : null}
        </View>
        <Text style={{ fontSize: 11, color: colors.text.secondary, flex: 1, textAlign: 'right', lineHeight: 16 }}>
          أوافق على{' '}
          <Text 
            onPress={() => setShowEula(true)}
            style={{ color: colors.brand.gold, fontWeight: 'bold', textDecorationLine: 'underline' }}
          >
            شروط الاستخدام وسياسة المحتوى (EULA)
          </Text>
        </Text>
      </TouchableOpacity>

      <EulaModal visible={showEula} onClose={() => setShowEula(false)} />

      <TouchableOpacity
        onPress={onSubmit}
        disabled={isLoading || !email.trim() || !agreed}
        style={[
          globalStyles.button,
          (isLoading || !email.trim() || !agreed) && globalStyles.buttonDisabled,
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
