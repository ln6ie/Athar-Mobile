import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { ThemeMode } from '../../store/useThemeStore';
import { GlassicView } from '../shared/GlassicView';
import { BouncyPressable } from '../shared/BouncyPressable';
import { SymbolView } from '../shared/SymbolView';
import { useProfileStyles } from '../../styles';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../../utils/changeLanguage';

interface ThemeSelectorProps {
  minimal?: boolean;
}

const THEME_MODES: { mode: ThemeMode; icon: { ios: string; android: string } }[] = [
  { mode: 'dark', icon: { ios: 'moon.fill', android: 'dark_mode' } },
  { mode: 'system', icon: { ios: 'gearshape.fill', android: 'settings' } },
  { mode: 'light', icon: { ios: 'sun.max.fill', android: 'light_mode' } },
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ minimal = false }) => {
  const { t, i18n } = useTranslation();
  const { themeMode, setThemeMode, colors } = useTheme();
  const profileStyles = useProfileStyles();

  const currentLang = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  const content = (
    <>
      <Text style={profileStyles.optionsTitle}>{t('theme.title')}</Text>
      {THEME_MODES.map((item, idx) => {
        const isActive = themeMode === item.mode;
        return (
          <BouncyPressable
            key={item.mode}
            style={[
              profileStyles.optionRow,
              idx === THEME_MODES.length - 1 && profileStyles.lastOptionRow,
            ]}
            onPress={() => setThemeMode(item.mode)}
          >
            <View style={profileStyles.optionIconWrapper}>
              <SymbolView
                name={item.icon}
                size={20}
                tintColor={isActive ? colors.brand.gold : colors.text.disabled}
              />
            </View>
            <View style={profileStyles.optionRightContainer}>
              <Text
                style={[
                  profileStyles.optionLabel,
                  isActive && { color: colors.brand.gold, fontWeight: 'bold' },
                ]}
              >
                {t(`theme.${item.mode}`)}
              </Text>
              {isActive && (
                <SymbolView
                  name={{ ios: 'checkmark.circle.fill', android: 'check_circle' }}
                  size={18}
                  tintColor={colors.brand.gold}
                  style={{ marginHorizontal: 6 }}
                />
              )}
            </View>
          </BouncyPressable>
        );
      })}

      <Text style={[profileStyles.optionsTitle, { marginTop: 20 }]}>{t('language.title')}</Text>
      {(['ar', 'en'] as const).map((lang, idx) => {
        const isActive = currentLang === lang;
        return (
          <BouncyPressable
            key={lang}
            style={[
              profileStyles.optionRow,
              idx === 1 && profileStyles.lastOptionRow,
            ]}
            onPress={() => changeLanguage(lang)}
          >
            <View style={profileStyles.optionIconWrapper}>
              <SymbolView
                name={{ ios: 'globe', android: 'language' }}
                size={20}
                tintColor={isActive ? colors.brand.gold : colors.text.disabled}
              />
            </View>
            <View style={profileStyles.optionRightContainer}>
              <Text
                style={[
                  profileStyles.optionLabel,
                  isActive && { color: colors.brand.gold, fontWeight: 'bold' },
                ]}
              >
                {t(`language.${lang === 'ar' ? 'arabic' : 'english'}`)}
              </Text>
              {isActive && (
                <SymbolView
                  name={{ ios: 'checkmark.circle.fill', android: 'check_circle' }}
                  size={18}
                  tintColor={colors.brand.gold}
                  style={{ marginHorizontal: 6 }}
                />
              )}
            </View>
          </BouncyPressable>
        );
      })}
    </>
  );

  if (minimal) {
    return (
      <View style={[localStyles.minimalContainer, { borderTopColor: colors.border.muted }]}>
        {content}
      </View>
    );
  }

  return (
    <GlassicView cornerRadius={24} style={profileStyles.optionsCard}>
      {content}
    </GlassicView>
  );
};

const localStyles = StyleSheet.create({
  minimalContainer: {
    borderTopWidth: 1,
    paddingTop: 16,
    marginTop: 12,
  },
});
