import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Header } from './Header';
import { api } from '../services/api';
import { useTheme } from '../hooks/useTheme';

interface SupportSubScreenProps {
  currentEmail: string;
  onBack: () => void;
}

export const SupportSubScreen: React.FC<SupportSubScreenProps> = ({ currentEmail, onBack }) => {
  const { colors, isDark } = useTheme();
  const [email, setEmail] = useState(currentEmail);
  const [whatsapp, setWhatsapp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email || !whatsapp || !message) {
      setError('يرجى ملء جميع الحقول المطلوبة لتقديم الدعم.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post('/auth/support', { email, whatsapp, message });
      setSuccess(response.data.message || 'تم إرسال رسالتك بنجاح!');
      setMessage('');
      setWhatsapp('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'تعذر إرسال الرسالة. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  const textInputStyle = [
    styles.input,
    { 
      backgroundColor: colors.background.input,
      borderColor: colors.border.muted,
      color: colors.text.primary 
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background.default }]}>
      <Header title="مراسلة الدعم الفني" subtitle="" leftText="رجوع" onLeftPress={onBack} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={[styles.description, { color: colors.text.secondary }]}>
          يسعدنا الاستماع لملاحظاتك واستفساراتك. يرجى ملء البيانات التالية وسيقوم فريق الدعم بالتواصل معك قريباً:
        </Text>

        {error && (
          <View style={[styles.errorBox, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#FEF2F2', borderColor: colors.feedback.error }]}>
            <Text style={[styles.errorText, { color: colors.feedback.error }]}>{error}</Text>
          </View>
        )}

        {success && (
          <View style={[styles.successBox, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : '#F0FDF4', borderColor: colors.feedback.success }]}>
            <Text style={[styles.successText, { color: colors.feedback.success }]}>{success}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.text.primary }]}>البريد الإلكتروني للتواصل</Text>
          <TextInput
            style={textInputStyle}
            value={email}
            onChangeText={(txt) => { setEmail(txt); setError(null); }}
            placeholder="example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={colors.text.disabled}
          />

          <Text style={[styles.label, { color: colors.text.primary }]}>رقم الواتساب</Text>
          <TextInput
            style={textInputStyle}
            value={whatsapp}
            onChangeText={(txt) => { setWhatsapp(txt); setError(null); }}
            placeholder="077********"
            keyboardType="phone-pad"
            placeholderTextColor={colors.text.disabled}
          />

          <Text style={[styles.label, { color: colors.text.primary }]}>تفاصيل الرسالة أو المشكلة</Text>
          <TextInput
            style={[textInputStyle, styles.textArea]}
            value={message}
            onChangeText={(txt) => { setMessage(txt); setError(null); }}
            placeholder="اكتب هنا تفاصيل المشكلة أو استفسارك..."
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            placeholderTextColor={colors.text.disabled}
          />

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.brand.gold }, loading && { backgroundColor: colors.text.disabled }]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitText}>إرسال الرسالة</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 60 },
  description: { fontSize: 12, lineHeight: 20, textAlign: 'center', marginBottom: 24 },
  form: { width: '100%' },
  label: { fontSize: 12, fontWeight: 'bold', marginBottom: 8, textAlign: 'right' },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    fontSize: 13,
    textAlign: 'right',
    marginBottom: 20,
  },
  textArea: { height: 120, paddingTop: 12, paddingBottom: 12 },
  submitButton: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', marginRight: 8 },
  buttonContent: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center' },
  iconContainer: { width: 18, height: 14, position: 'relative', justifyContent: 'center', alignItems: 'center' },
  envelopeBody: {
    position: 'absolute',
    width: 18,
    height: 14,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    borderRadius: 3,
  },
  envelopeFlapLeft: {
    position: 'absolute',
    width: 9,
    height: 2.5,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '30deg' }],
    top: 4.5,
    left: 2,
  },
  envelopeFlapRight: {
    position: 'absolute',
    width: 9,
    height: 2.5,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '-30deg' }],
    top: 4.5,
    right: 2,
  },
  errorBox: { borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 20 },
  errorText: { fontSize: 12, textAlign: 'center', lineHeight: 18 },
  successBox: { borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 20 },
  successText: { fontSize: 12, textAlign: 'center', lineHeight: 18 },
});

