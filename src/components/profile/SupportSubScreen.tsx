// شاشة الدعم الفني - إرسال رسالة لفريق الدعم
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Header } from '../shared/Header';
import { api } from '../../services/api';
import { useTheme } from '../../hooks/useTheme';
import { BouncyPressable } from '../shared/BouncyPressable';
import { useGlobalStyles, useSharedStyles, formStyles } from '../../styles';

interface SupportSubScreenProps {
  currentEmail: string;
  onBack: () => void;
}

export const SupportSubScreen: React.FC<SupportSubScreenProps> = ({ currentEmail, onBack }) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const globalStyles = useGlobalStyles();
  const sharedStyles = useSharedStyles();
  const [email, setEmail] = useState(currentEmail);
  const [whatsapp, setWhatsapp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const handleSubmit = async () => {
    if (!email || !whatsapp || !message) {
      setError(t('support.empty_error'));
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post('/auth/support', { email, whatsapp, message });
      setSuccess(response.data.message || t('support.success'));
      setMessage('');
      setWhatsapp('');
    } catch (err: any) {
      setError(err.response?.data?.message || t('support.failed'));
    } finally {
      setLoading(false);
    }
  };

  const textInputStyle = [
    sharedStyles.formInput,
    { 
      backgroundColor: colors.background.input,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
      color: colors.text.primary 
    }
  ];

  const clampedHeight = Math.min(contentHeight, 120);
  const messageRadius = clampedHeight < 36 ? 24 : Math.max(6, 24 - (clampedHeight - 36) * 0.2);

  return (
    <View style={globalStyles.container}>
      <Header title={t('support.title')} subtitle="" leftText={t('common.back')} onLeftPress={onBack} />
      <ScrollView contentContainerStyle={sharedStyles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={sharedStyles.description}>
          {t('support.description')}
        </Text>

        {error && (
          <View style={sharedStyles.errorBox}>
            <Text style={sharedStyles.errorBoxText}>{error}</Text>
          </View>
        )}

        {success && (
          <View style={sharedStyles.successBox}>
            <Text style={sharedStyles.successBoxText}>{success}</Text>
          </View>
        )}

        <View style={formStyles.container}>
          <Text style={sharedStyles.formLabel}>{t('support.email_label')}</Text>
          <TextInput
            style={textInputStyle}
            value={email}
            onChangeText={(txt) => { setEmail(txt); setError(null); }}
            placeholder="example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={colors.text.disabled}
          />

          <Text style={sharedStyles.formLabel}>{t('support.whatsapp_label')}</Text>
          <TextInput
            style={textInputStyle}
            value={whatsapp}
            onChangeText={(txt) => { setWhatsapp(txt); setError(null); }}
            placeholder="077********"
            keyboardType="phone-pad"
            placeholderTextColor={colors.text.disabled}
          />

          <Text style={sharedStyles.formLabel}>{t('support.message_label')}</Text>
          <TextInput
            style={[textInputStyle, sharedStyles.formTextArea, { borderRadius: messageRadius }]}
            value={message}
            onChangeText={(txt) => { setMessage(txt); setError(null); }}
            onContentSizeChange={(e) => setContentHeight(e.nativeEvent.contentSize.height)}
            placeholder={t('support.placeholder')}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            placeholderTextColor={colors.text.disabled}
          />

          <BouncyPressable
            style={[
              sharedStyles.confirmButton,
              { height: 48, marginTop: 10 },
              loading && { backgroundColor: colors.text.disabled }
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={sharedStyles.confirmButtonText}>{t('support.send')}</Text>
            )}
          </BouncyPressable>
        </View>
      </ScrollView>
    </View>
  );
};
