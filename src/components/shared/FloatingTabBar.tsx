import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TOKENS } from '../../constants/tokens';
import { useTheme } from '../../hooks/useTheme';
import { GlassicView } from './GlassicView';
import { useSharedStyles } from '../../styles';
import { HomeIcon } from './HomeIcon';
import Svg, { Path } from 'react-native-svg';

interface FloatingTabBarProps {
  activeTab: 'feed' | 'profile';
  onChangeTab: (tab: 'feed' | 'profile') => void;
  onAddPress: () => void;
}

// شريط التبويب العائم - تنقل بين الخلاصة والملف الشخصي مع زر الإضافة
export const FloatingTabBar: React.FC<FloatingTabBarProps> = ({
  activeTab,
  onChangeTab,
  onAddPress
}) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const sharedStyles = useSharedStyles();
  const insets = useSafeAreaInsets();
  const dynamicBottom = Math.max(insets.bottom + 8, 20);

  const activeTabStyle = [
    localStyles.tabButtonActive,
    {
      backgroundColor: colors.brand.gold,
      borderColor: 'transparent',
      borderWidth: 0,
      shadowColor: colors.brand.gold,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    }
  ];

  return (
    <View style={[localStyles.outerContainer, { bottom: dynamicBottom }]}>
      {/* الجانب الأيمن: زر الإضافة المنفرد الدائري (افتراضي RTL) */}
      <TouchableOpacity
        onPress={onAddPress}
        style={[
          localStyles.standaloneAddButton,
          { backgroundColor: colors.brand.gold, shadowColor: colors.brand.gold }
        ]}
        activeOpacity={0.85}
      >
        <View style={localStyles.plusIconContainer}>
          <Svg
            width={26}
            height={26}
            viewBox="0 0 512 512"
            fill="#FFFFFF"
          >
            <Path
              d="M93.1,325.8V139.6H46.5C20.9,139.6,0,160.5,0,186.2v279.3C0,491.1,20.9,512,46.5,512h279.3c25.7,0,46.5-20.9,46.5-46.5v-46.5H186.2C134.8,418.9,93.1,377.2,93.1,325.8z M465.5,0H186.2c-25.7,0-46.5,20.9-46.5,46.5v279.3c0,25.7,20.9,46.5,46.5,46.5h279.3c25.7,0,46.5-20.9,46.5-46.5V46.5C512,20.9,491.1,0,465.5,0z M442.2,209.5h-93.1v93.1h-46.5v-93.1h-93.1v-46.5h93.1V69.8h46.5v93.1h93.1V209.5z"
              fill="#FFFFFF"
            />
          </Svg>
        </View>
      </TouchableOpacity>

      {/* الجانب الأيسر: بطاقة شريط التبويب العائم */}
      <GlassicView
        cornerRadius={28}
        glassEffectStyle="regular"
        style={[
          localStyles.leftTabCard,
          { marginRight: 16 }
        ]}
      >
        {/* تبويب الرئيسية */}
        <TouchableOpacity
          onPress={() => onChangeTab('feed')}
          style={[
            localStyles.tabButton,
            activeTab === 'feed' && activeTabStyle
          ]}
          activeOpacity={0.8}
        >
          <HomeIcon
            size={24}
            color={activeTab === 'feed' ? '#FFFFFF' : colors.text.secondary}
            filled={activeTab === 'feed'}
            activeColor={colors.brand.gold}
          />
          <Text style={[
            localStyles.tabLabel,
            activeTab === 'feed' ? { color: '#FFFFFF' } : { color: colors.text.secondary }
          ]}>
            {t('home')}
          </Text>
        </TouchableOpacity>

        {/* تبويب الملف الشخصي */}
        <TouchableOpacity
          onPress={() => onChangeTab('profile')}
          style={[
            localStyles.tabButton,
            activeTab === 'profile' && activeTabStyle
          ]}
          activeOpacity={0.8}
        >
          <Ionicons
            name={activeTab === 'profile' ? 'person-circle' : 'person-circle-outline'}
            size={24}
            color={activeTab === 'profile' ? '#FFFFFF' : colors.text.secondary}
          />
          <Text style={[
            localStyles.tabLabel,
            activeTab === 'profile' ? { color: '#FFFFFF' } : { color: colors.text.secondary }
          ]}>
            {t('profile.title')}
          </Text>
        </TouchableOpacity>
      </GlassicView>
    </View>
  );
};


const localStyles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 24,
    right: 24,
    height: 60,
    flexDirection: 'row-reverse', // RTL: زر الإضافة على اليمين
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  standaloneAddButton: {
    width: 60,
    height: 60,
    borderRadius: 30, // دائري بالكامل
    backgroundColor: TOKENS.colors.brand.gold, // لون العلامة التجارية
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: TOKENS.colors.brand.gold,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.22,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  plusIconContainer: {
    width: 24,
    height: 24,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusBarHorizontal: {
    position: 'absolute',
    width: 22,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  plusBarVertical: {
    position: 'absolute',
    width: 4,
    height: 22,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  leftTabCard: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginRight: 16,
    // iOS 26: UIGlassEffect يطبق ظله تلقائياً
    ...Platform.select({
      android: {
        elevation: 3,
      },
    }),
  },
  tabButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column', // توزيع عمودي
    paddingVertical: 2,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(128, 128, 128, 0.08)', // إضاءة ديناميكية محايدة
  },
  tabLabel: {
    fontSize: 9, // نحيف وفاخر
    fontWeight: 'bold',
    marginTop: 3, // فاصل رأسي من الأيقونة
    lineHeight: 12,
  },
  tabLabelActive: {
    color: '#FFFFFF', // أبيض ناصع للتبويب النشط
  },
  tabLabelInactive: {
    color: 'rgba(255, 255, 255, 0.6)', // أبيض شفاف للتبويبات غير النشطة
  },
  // رسم SVG يدوي
});
