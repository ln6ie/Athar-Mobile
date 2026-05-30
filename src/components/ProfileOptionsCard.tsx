import React from 'react';
import { Text, View } from 'react-native';
import { SymbolView } from './SymbolView';
import { GlassicView } from './GlassicView';
import { BouncyPressable } from './BouncyPressable';
import { useProfileStyles } from '../styles/ProfileStyles';
import { useTheme } from '../hooks/useTheme';

interface ProfileOptionsCardProps {
  onSubScreenNavigate: (screen: 'change-email' | 'blocked-users' | 'support' | 'privacy' | 'about' | 'reports') => void;
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
      
      <BouncyPressable style={styles.optionRow} onPress={() => onSubScreenNavigate('change-email')}>
        <Text style={styles.chevron}>‹</Text>
        <View style={styles.optionRightContainer}>
          <Text style={styles.optionLabel}>تغيير البريد الإلكتروني</Text>
          <View style={styles.optionIconWrapper}>
            <SymbolView
              name={{ ios: 'envelope.fill', android: 'mail' }}
              size={20}
              tintColor={colors.brand.gold}
            />
          </View>
        </View>
      </BouncyPressable>

      <BouncyPressable style={styles.optionRow} onPress={() => onSubScreenNavigate('blocked-users')}>
        <Text style={styles.chevron}>‹</Text>
        <View style={styles.optionRightContainer}>
          <Text style={styles.optionLabel}>المستخدمون المحظورون</Text>
          <View style={styles.optionIconWrapper}>
            <SymbolView
              name={{ ios: 'nosign', android: 'block' }}
              size={20}
              tintColor={colors.brand.gold}
            />
          </View>
        </View>
      </BouncyPressable>

      <BouncyPressable style={styles.optionRow} onPress={() => onSubScreenNavigate('reports')}>
        <Text style={styles.chevron}>‹</Text>
        <View style={styles.optionRightContainer}>
          <Text style={styles.optionLabel}>سجل البلاغات والتقارير</Text>
          <View style={styles.optionIconWrapper}>
            <SymbolView
              name={{ ios: 'exclamationmark.shield.fill', android: 'security' }}
              size={20}
              tintColor={colors.brand.gold}
            />
          </View>
        </View>
      </BouncyPressable>

      <BouncyPressable style={styles.optionRow} onPress={() => onSubScreenNavigate('support')}>
        <Text style={styles.chevron}>‹</Text>
        <View style={styles.optionRightContainer}>
          <Text style={styles.optionLabel}>مراسلة الدعم الفني</Text>
          <View style={styles.optionIconWrapper}>
            <SymbolView
              name={{ ios: 'bubble.left.and.bubble.right.fill', android: 'forum' }}
              size={20}
              tintColor={colors.brand.gold}
            />
          </View>
        </View>
      </BouncyPressable>

      <BouncyPressable style={styles.optionRow} onPress={() => onSubScreenNavigate('privacy')}>
        <Text style={styles.chevron}>‹</Text>
        <View style={styles.optionRightContainer}>
          <Text style={styles.optionLabel}>سياسة الخصوصية</Text>
          <View style={styles.optionIconWrapper}>
            <SymbolView
              name={{ ios: 'shield.fill', android: 'shield' }}
              size={20}
              tintColor={colors.brand.gold}
            />
          </View>
        </View>
      </BouncyPressable>

      <BouncyPressable style={styles.optionRow} onPress={() => onSubScreenNavigate('about')}>
        <Text style={styles.chevron}>‹</Text>
        <View style={styles.optionRightContainer}>
          <Text style={styles.optionLabel}>عن التطبيق والفكرة</Text>
          <View style={styles.optionIconWrapper}>
            <SymbolView
              name={{ ios: 'info.circle.fill', android: 'info' }}
              size={20}
              tintColor={colors.brand.gold}
            />
          </View>
        </View>
      </BouncyPressable>

      <BouncyPressable style={styles.optionRow} onPress={onLogout}>
        <Text style={styles.chevronRed}>‹</Text>
        <View style={styles.optionRightContainer}>
          <Text style={styles.optionLabelRed}>تسجيل الخروج</Text>
          <View style={styles.optionIconWrapper}>
            <SymbolView
              name={{ ios: 'arrow.right.square.fill', android: 'logout' }}
              size={20}
              tintColor="#DC2626"
            />
          </View>
        </View>
      </BouncyPressable>

      <BouncyPressable style={[styles.optionRow, styles.lastOptionRow]} onPress={onDeleteAccount}>
        <Text style={styles.chevronRed}>‹</Text>
        <View style={styles.optionRightContainer}>
          <Text style={styles.optionLabelRed}>حذف الحساب بشكل نهائي</Text>
          <View style={styles.optionIconWrapper}>
            <SymbolView
              name={{ ios: 'trash.fill', android: 'delete' }}
              size={20}
              tintColor="#DC2626"
            />
          </View>
        </View>
      </BouncyPressable>
    </GlassicView>
  );
};
