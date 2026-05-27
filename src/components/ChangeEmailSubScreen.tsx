import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Header } from './Header';
import { useAuthStore } from '../store/useAuthStore';
import { useTheme } from '../hooks/useTheme';
import { useGlobalStyles } from '../styles/globalStyles';

interface ChangeEmailSubScreenProps {
  currentEmail: string;
  onBack: () => void;
}

export const ChangeEmailSubScreen: React.FC<ChangeEmailSubScreenProps> = ({ currentEmail, onBack }) => {
  const { changeEmail } = useAuthStore();
  const { colors, isDark } = useTheme();
  const globalStyles = useGlobalStyles();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSave = async () => {
    if (!email) {
      setError('يرجى إدخال البريد الإلكتروني الجديد.');
      return;
    }
    if (email === currentEmail) {
      setError('البريد الجديد متطابق مع البريد الحالي.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await changeEmail(email);
      setSuccess('تم تغيير البريد الإلكتروني بنجاح!');
      setEmail('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'تعذر حفظ البريد الجديد. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.default }]}>
      <Header title="تغيير البريد الإلكتروني" subtitle="" leftText="رجوع" onLeftPress={onBack} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={[styles.description, { color: colors.text.secondary }]}>
          أدخل عنوان بريدك الإلكتروني الجديد لحفظه في حسابك بدلاً من البريد الحالي:
        </Text>

        <View style={styles.currentBox}>
          <Text style={[styles.currentLabel, { color: colors.text.secondary }]}>البريد الإلكتروني الحالي:</Text>
          <Text style={[styles.currentValue, { color: colors.text.primary }]}>{currentEmail}</Text>
        </View>

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
          <Text style={globalStyles.label}>البريد الإلكتروني الجديد</Text>
          <TextInput
            style={[
              globalStyles.input, 
              { 
                textAlign: email ? 'left' : 'right' 
              }
            ]}
            value={email}
            onChangeText={(txt) => { setEmail(txt); setError(null); }}
            placeholder="email@gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={colors.text.disabled}
          />

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.brand.gold }, loading && { backgroundColor: colors.text.disabled }]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.saveText}>حفظ</Text>
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
  currentBox: { backgroundColor: 'transparent', padding: 0, marginBottom: 24, width: '100%' },
  currentLabel: { fontSize: 11, textAlign: 'right', marginBottom: 4 },
  currentValue: { fontSize: 13, fontWeight: 'bold', textAlign: 'right' },
  form: { width: '100%' },
  saveButton: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  errorBox: { borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 20 },
  errorText: { fontSize: 12, textAlign: 'center', lineHeight: 18 },
  successBox: { borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 20 },
  successText: { fontSize: 12, textAlign: 'center', lineHeight: 18 },
});

