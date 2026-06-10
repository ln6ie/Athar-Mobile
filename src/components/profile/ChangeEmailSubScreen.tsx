import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Header } from '../shared/Header';
import { useAuthStore } from '../../store/useAuthStore';
import { useTheme } from '../../hooks/useTheme';
import { useGlobalStyles, useSharedStyles, formStyles, textPresets } from '../../styles';

interface ChangeEmailSubScreenProps {
  currentEmail: string;
  onBack: () => void;
}

export const ChangeEmailSubScreen: React.FC<ChangeEmailSubScreenProps> = ({ currentEmail, onBack }) => {
  const { t } = useTranslation();
  const { sendOtpChangeEmail, confirmEmailChange } = useAuthStore();
  const { colors, isDark } = useTheme();
  const globalStyles = useGlobalStyles();
  const sharedStyles = useSharedStyles();

  const [step, setStep] = useState<'email' | 'otp' | 'done'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    if (!email) {
      setError(t('change_email.empty_error'));
      return;
    }
    if (email === currentEmail) {
      setError(t('change_email.same_error'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await sendOtpChangeEmail(email);
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.message || t('change_email.save_failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOtp = async () => {
    if (!code || code.length !== 6) {
      setError(t('change_email.invalid_code'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await confirmEmailChange(code);
      setStep('done');
    } catch (err: any) {
      setError(err.response?.data?.message || t('change_email.save_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Header
        title={step === 'done' ? t('change_email.title') : t('change_email.title')}
        subtitle=""
        leftText={step === 'otp' ? t('common.back') : t('common.back')}
        onLeftPress={step === 'otp' ? () => { setStep('email'); setError(null); setCode(''); } : onBack}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={sharedStyles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={localStyles.currentBox}>
            <Text style={[textPresets.small, { marginBottom: 4, color: colors.text.secondary }]}>{t('change_email.current_label')}</Text>
            <Text style={[textPresets.subtitle, { fontWeight: 'bold', color: colors.text.primary }]}>{currentEmail}</Text>
          </View>

          {error && (
            <View style={sharedStyles.errorBox}>
              <Text style={sharedStyles.errorBoxText}>{error}</Text>
            </View>
          )}

          {step === 'email' && (
            <View style={formStyles.container}>
              <Text style={globalStyles.label}>{t('change_email.new_label')}</Text>
              <TextInput
                style={[globalStyles.input, { textAlign: email ? 'left' : 'right' }]}
                value={email}
                onChangeText={(txt) => { setEmail(txt); setError(null); }}
                placeholder="email@gmail.com"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colors.text.disabled}
              />

              <Text style={[textPresets.caption, { color: colors.text.secondary, marginBottom: 16, textAlign: 'right' }]}>
                {t('change_email.otp_hint')}
              </Text>

              <TouchableOpacity
                style={[sharedStyles.confirmButton, { height: 48 }, loading && { backgroundColor: colors.text.disabled }]}
                onPress={handleSendOtp}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={sharedStyles.confirmButtonText}>{t('change_email.send_otp')}</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {step === 'otp' && (
            <View style={formStyles.container}>
              <Text style={sharedStyles.description}>
                {t('change_email.otp_sent')}
              </Text>

              <Text style={globalStyles.label}>{t('change_email.otp_label')}</Text>
              <TextInput
                style={[globalStyles.input, { textAlign: 'center', fontSize: 24, letterSpacing: 8 }]}
                value={code}
                onChangeText={(txt) => { setCode(txt.replace(/[^0-9]/g, '').slice(0, 6)); setError(null); }}
                placeholder="000000"
                keyboardType="number-pad"
                maxLength={6}
                placeholderTextColor={colors.text.disabled}
              />

              <TouchableOpacity
                style={[sharedStyles.confirmButton, { height: 48 }, loading && { backgroundColor: colors.text.disabled }]}
                onPress={handleConfirmOtp}
                disabled={loading || code.length !== 6}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={sharedStyles.confirmButtonText}>{t('common.confirm')}</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {step === 'done' && (
            <View style={formStyles.container}>
              <View style={sharedStyles.successBox}>
                <Text style={sharedStyles.successBoxText}>{t('change_email.success')}</Text>
              </View>
              <View style={localStyles.doneBox}>
                <Text style={[textPresets.caption, { color: colors.text.secondary, textAlign: 'center' }]}>
                  {t('change_email.success_hint')}
                </Text>
              </View>
              <TouchableOpacity
                style={[sharedStyles.confirmButton, { height: 48, backgroundColor: colors.brand.gold }]}
                onPress={onBack}
                activeOpacity={0.8}
              >
                <Text style={sharedStyles.confirmButtonText}>{t('common.done')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const localStyles = StyleSheet.create({
  currentBox: { backgroundColor: 'transparent', padding: 0, marginBottom: 24, width: '100%' },
  doneBox: { marginVertical: 16, alignItems: 'center' },
});