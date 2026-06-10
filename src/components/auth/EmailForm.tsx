// نموذج إدخال البريد الإلكتروني لتسجيل الدخول
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useGlobalStyles } from '../../styles/globalStyles';
import { useTheme } from '../../hooks/useTheme';
import { EulaModal } from '../shared/EulaModal';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface EmailFormProps {
  email: string;
  onChangeEmail: (email: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error?: string | null;
  onGoogleLogin?: () => void;
  onAppleLogin?: () => void;
  appleAuthAvailable?: boolean;
}

export const EmailForm: React.FC<EmailFormProps> = ({
  email,
  onChangeEmail,
  onSubmit,
  isLoading,
  error,
  onGoogleLogin,
  onAppleLogin,
  appleAuthAvailable,
}) => {
  const { t } = useTranslation();
  const globalStyles = useGlobalStyles();
  const { colors, isDark } = useTheme();
  const [agreed, setAgreed] = useState(false);
  const [showEula, setShowEula] = useState(false);
  const [pendingProvider, setPendingProvider] = useState<'google' | 'apple' | null>(null);

  const handleGooglePress = () => {
    if (!agreed) {
      setPendingProvider('google');
      Alert.alert(
        t('auth.agreement_required_title'),
        t('auth.agreement_required_desc'),
        [
          { text: t('auth.cancel'), onPress: () => setPendingProvider(null), style: 'cancel' },
          { text: t('auth.show_eula'), onPress: () => setShowEula(true) }
        ]
      );
      return;
    }
    onGoogleLogin?.();
  };

  const handleApplePress = () => {
    if (!agreed) {
      setPendingProvider('apple');
      Alert.alert(
        t('auth.agreement_required_title'),
        t('auth.agreement_required_desc'),
        [
          { text: t('auth.cancel'), onPress: () => setPendingProvider(null), style: 'cancel' },
          { text: t('auth.show_eula'), onPress: () => setShowEula(true) }
        ]
      );
      return;
    }
    onAppleLogin?.();
  };

  useEffect(() => {
    if (!showEula && pendingProvider) {
      const provider = pendingProvider;
      setPendingProvider(null);
      const timer = setTimeout(() => {
        if (provider === 'google') {
          onGoogleLogin?.();
        } else if (provider === 'apple') {
          onAppleLogin?.();
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showEula, pendingProvider]);

  const handleAcceptEula = () => {
    setAgreed(true);
    setShowEula(false);
  };

  return (
    <View>
      <Text style={globalStyles.label}>{t('auth.email_label')}</Text>

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
          {t('auth.agree_prefix')}{' '}
          <Text 
            onPress={() => setShowEula(true)}
            style={{ color: colors.brand.gold, fontWeight: 'bold', textDecorationLine: 'underline' }}
          >
            {t('auth.eula_link')}
          </Text>
          {' '}{t('auth.age_confirm')}
        </Text>
      </TouchableOpacity>

      <EulaModal 
        visible={showEula} 
        onClose={() => {
          setShowEula(false);
          setPendingProvider(null);
        }} 
        onAccept={handleAcceptEula}
        onDecline={() => {
          setAgreed(false);
          setShowEula(false);
          setPendingProvider(null);
        }}
      />

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
          <Text style={globalStyles.buttonText}>{t('auth.send_code')}</Text>
        )}
      </TouchableOpacity>

      {/* Divider */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: isDark ? '#374151' : '#E5E7EB' }} />
        <Text style={{ marginHorizontal: 10, color: colors.text.secondary, fontSize: 12 }}>{t('auth.or')}</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: isDark ? '#374151' : '#E5E7EB' }} />
      </View>

      {/* Google Login Button */}
      {onGoogleLogin && (
        <TouchableOpacity
          onPress={handleGooglePress}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#4285F4', '#EA4335', '#FBBC05', '#34A853']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 12,
              borderRadius: 9999,
              marginBottom: 10,
              gap: 8,
            }, isLoading && { opacity: 0.5 }]}
          >
            <AntDesign name="google" size={18} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14 }}>{t('auth.google_login')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Apple Login Button */}
      {onAppleLogin && appleAuthAvailable && (
        <TouchableOpacity
          onPress={handleApplePress}
          disabled={isLoading}
          style={[{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 12,
            borderRadius: 9999,
            backgroundColor: isDark ? '#FFFFFF' : '#000000',
            marginBottom: 10,
            gap: 8,
          }, isLoading && { opacity: 0.5 }]}
          activeOpacity={0.8}
        >
          <AntDesign name="apple" size={18} color={isDark ? '#000000' : '#FFFFFF'} />
          <Text style={{ color: isDark ? '#000000' : '#FFFFFF', fontWeight: '600', fontSize: 14 }}>{t('auth.apple_login')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
