import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GlassicView } from './GlassicView';
import { useProfileStyles } from '../styles/ProfileStyles';
import { useTheme } from '../hooks/useTheme';

interface ProfileOptionsCardProps {
  onSubScreenNavigate: (screen: 'change-email' | 'blocked-users' | 'support' | 'privacy' | 'about') => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export const ProfileOptionsCard: React.FC<ProfileOptionsCardProps> = ({
  onSubScreenNavigate,
  onLogout,
  onDeleteAccount,
}) => {
  const styles = useProfileStyles();
  const { colors } = useTheme();

  return (
    <GlassicView cornerRadius={24} style={styles.optionsCard}>
      <Text style={styles.optionsTitle}>إعدادات الحساب والدعم</Text>
      
      <TouchableOpacity style={styles.optionRow} onPress={() => onSubScreenNavigate('change-email')}>
        <Text style={styles.chevron}>‹</Text>
        <View style={styles.optionRightContainer}>
          <Text style={styles.optionLabel}>تغيير البريد الإلكتروني</Text>
          <View style={styles.optionIconWrapper}>
            <Ionicons name="mail" size={20} color={colors.brand.gold} />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionRow} onPress={() => onSubScreenNavigate('blocked-users')}>
        <Text style={styles.chevron}>‹</Text>
        <View style={styles.optionRightContainer}>
          <Text style={styles.optionLabel}>المستخدمون المحظورون</Text>
          <View style={styles.optionIconWrapper}>
            <Ionicons name="ban" size={20} color={colors.brand.gold} />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionRow} onPress={() => onSubScreenNavigate('support')}>
        <Text style={styles.chevron}>‹</Text>
        <View style={styles.optionRightContainer}>
          <Text style={styles.optionLabel}>مراسلة الدعم الفني</Text>
          <View style={styles.optionIconWrapper}>
            <Ionicons name="chatbubbles" size={20} color={colors.brand.gold} />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionRow} onPress={() => onSubScreenNavigate('privacy')}>
        <Text style={styles.chevron}>‹</Text>
        <View style={styles.optionRightContainer}>
          <Text style={styles.optionLabel}>سياسة الخصوصية</Text>
          <View style={styles.optionIconWrapper}>
            <Ionicons name="shield-checkmark" size={20} color={colors.brand.gold} />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionRow} onPress={() => onSubScreenNavigate('about')}>
        <Text style={styles.chevron}>‹</Text>
        <View style={styles.optionRightContainer}>
          <Text style={styles.optionLabel}>عن التطبيق والفكرة</Text>
          <View style={styles.optionIconWrapper}>
            <Ionicons name="information-circle" size={20} color={colors.brand.gold} />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionRow} onPress={onLogout}>
        <Text style={styles.chevronRed}>‹</Text>
        <View style={styles.optionRightContainer}>
          <Text style={styles.optionLabelRed}>تسجيل الخروج</Text>
          <View style={styles.optionIconWrapper}>
            <Ionicons name="log-out" size={20} color="#DC2626" />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.optionRow, styles.lastOptionRow]} onPress={onDeleteAccount}>
        <Text style={styles.chevronRed}>‹</Text>
        <View style={styles.optionRightContainer}>
          <Text style={styles.optionLabelRed}>حذف الحساب بشكل نهائي</Text>
          <View style={styles.optionIconWrapper}>
            <Ionicons name="trash" size={20} color="#DC2626" />
          </View>
        </View>
      </TouchableOpacity>
    </GlassicView>
  );
};
