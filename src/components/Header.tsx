import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TOKENS } from '../constants/tokens';
import { useTheme } from '../hooks/useTheme';
import { useFeedStore } from '../store/useFeedStore';
import { BellIcon } from './BellIcon';
import { Logo } from './Logo';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { GlassicView } from './GlassicView';
import { BouncyPressable } from './BouncyPressable';
import { SymbolView } from './SymbolView';


interface HeaderProps {
  title?: string;
  subtitle?: string;
  leftText?: string;
  onLeftPress?: () => void;
  rightText?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'الأثر',
  subtitle = 'الآثار النشطة',
  leftText,
  onLeftPress,
}) => {
  const insets = useSafeAreaInsets();
  const { unreadLikesCount } = useFeedStore();
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const isBack = leftText === 'رجوع';
  const isLogout = leftText === 'خروج';
  const showIcon = isBack || isLogout;
  const iconColor = isLogout ? '#DC2626' : colors.brand.gold;

  return (
    <View style={[styles.headerContainer, { 
      paddingTop: Math.max(insets.top, 10), 
      backgroundColor: colors.background.default, 
      borderBottomColor: colors.border.muted 
    }]}>
      <View style={[styles.header, { backgroundColor: colors.background.default }]}>
        {!leftText ? (
          <>
            {/* Left Side: Transparent Notification Bell */}
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.bellButton}
              activeOpacity={0.7}
            >
              <BellIcon color={colors.brand.gold} />
              {unreadLikesCount > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>
                    {unreadLikesCount > 9 ? '9+' : unreadLikesCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Right Side: Logo & Brand Info in RTL layout */}
            <View style={styles.brandRow}>
              <View style={styles.brandTextColumn}>
                <Text style={[styles.mainTitleText, { color: colors.text.primary }]}>{title}</Text>
                {subtitle ? <Text style={[styles.mainSubtitleText, { color: colors.text.disabled }]}>{subtitle}</Text> : null}
              </View>
              <View style={styles.logoWrapper}>
                <Logo size={24} />
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Sub-screens Left Side: Native iOS Circular Close Button (Perfect for Arabic RTL) */}
            <View style={styles.leftContainer}>
              {onLeftPress ? (
                <GlassicView
                  cornerRadius={14}
                  style={styles.circularCloseButton}
                >
                  <BouncyPressable
                    onPress={onLeftPress}
                    style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                  >
                    <SymbolView
                      name={{ ios: 'xmark', android: 'close' }}
                      size={11}
                      tintColor={colors.text.secondary}
                    />
                  </BouncyPressable>
                </GlassicView>
              ) : (
                <View style={styles.placeholder} />
              )}
            </View>

            {/* Sub-screens Center: Title and Subtitle */}
            <View style={styles.titleContainer}>
              <Text style={[styles.titleText, { color: colors.text.primary }]}>{title}</Text>
              {subtitle ? <Text style={[styles.subtitleText, { color: colors.text.disabled }]}>{subtitle}</Text> : null}
            </View>

            {/* Sub-screens Right Side: Empty placeholder */}
            <View style={styles.rightContainer}>
              <View style={styles.placeholder} />
            </View>

          </>
        )}
      </View>

      {/* Notification Screen Overlay */}
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <NotificationsScreen onClose={() => setModalVisible(false)} />
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: TOKENS.colors.background.default,
    borderBottomWidth: 0,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    paddingTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: TOKENS.colors.background.default,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: TOKENS.colors.feedback.error,
    fontSize: 10,
    fontWeight: 'bold',
    lineHeight: 14,
  },
  circularCloseButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftContainer: { width: 60, alignItems: 'flex-start', justifyContent: 'center' },
  rightContainer: { width: 60, alignItems: 'flex-end', justifyContent: 'center' },
  placeholder: { width: 28, height: 28 },
  titleContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  titleText: {
    color: TOKENS.colors.text.primary,
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 22,
    textAlign: 'center',
  },
  subtitleText: {
    color: TOKENS.colors.text.disabled,
    fontSize: 9,
    fontWeight: 'bold',
    lineHeight: 12,
    textAlign: 'center',
  },
  bellButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: TOKENS.colors.feedback.error,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
    lineHeight: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoWrapper: {
    marginLeft: 8,
  },
  brandTextColumn: {
    alignItems: 'flex-end',
  },
  mainTitleText: {
    color: TOKENS.colors.text.primary,
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 22,
    textAlign: 'right',
  },
  mainSubtitleText: {
    color: TOKENS.colors.text.disabled,
    fontSize: 9,
    fontWeight: 'bold',
    lineHeight: 12,
    textAlign: 'right',
  },
});
