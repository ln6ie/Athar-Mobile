import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useFeedStore } from '../../store/useFeedStore';
import { BellIcon } from '../feed/BellIcon';
import { Logo } from './Logo';
import { NotificationsScreen } from '../../screens/NotificationsScreen';
import { BouncyPressable } from './BouncyPressable';
import { SymbolView } from './SymbolView';
import { useSharedStyles } from '../../styles';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  leftText?: string;
  onLeftPress?: () => void;
  rightText?: string;
}

// رأس الصفحة - يعرض العنوان وزر الجرس والโลغو مع دعم الشاشات الفرعية
export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftText,
  onLeftPress,
}) => {
  const { t } = useTranslation();
  const effectiveTitle = title || t('feed.header_title');
  const effectiveSubtitle = subtitle || t('feed.header_subtitle');
  const insets = useSafeAreaInsets();
  const { unreadLikesCount } = useFeedStore();
  const { colors } = useTheme();
  const sharedStyles = useSharedStyles();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{
      paddingTop: !leftText ? Math.max(insets.top, 10) : (Platform.OS === 'android' ? Math.max(insets.top, 10) : 0),
      backgroundColor: colors.background.default,
    }}>
      <View style={{ paddingHorizontal: 20, paddingBottom: 4, paddingTop: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {!leftText ? (
          <>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={sharedStyles.bellButton}
              activeOpacity={0.7}
            >
              <BellIcon color={colors.brand.gold} />
              {unreadLikesCount > 0 && (
                <View style={sharedStyles.badgeContainer}>
                  <Text style={sharedStyles.badgeText}>
                    {unreadLikesCount > 9 ? '9+' : unreadLikesCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[{ fontSize: 16, fontWeight: 'bold', lineHeight: 22, textAlign: 'right' }, { color: colors.text.primary }]}>{effectiveTitle}</Text>
                {effectiveSubtitle ? <Text style={[{ fontSize: 9, fontWeight: 'bold', lineHeight: 12, textAlign: 'right' }, { color: colors.text.disabled }]}>{effectiveSubtitle}</Text> : null}
              </View>
              <View style={{ marginLeft: 8 }}>
                <Logo size={24} />
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={{ width: 40, alignItems: 'flex-start', justifyContent: 'center' }}>
              {onLeftPress ? (
                <View
                  style={sharedStyles.circularCloseButton}
                >
                  <BouncyPressable
                    onPress={onLeftPress}
                    style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                  >
                    <SymbolView
                      name={{ ios: 'xmark', android: 'close' }}
                      size={16}
                      tintColor="#FFFFFF"
                    />
                  </BouncyPressable>
                </View>
              ) : (
                <View style={{ width: 36, height: 36 }} />
              )}
            </View>

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={[{ fontSize: 15, fontWeight: '600', lineHeight: 20, textAlign: 'center' }, { color: colors.text.primary }]}>{effectiveTitle}</Text>
              {effectiveSubtitle ? <Text style={[{ fontSize: 9, fontWeight: 'bold', lineHeight: 12, textAlign: 'center' }, { color: colors.text.disabled }]}>{effectiveSubtitle}</Text> : null}
            </View>

            <View style={{ width: 40, alignItems: 'flex-end', justifyContent: 'center' }}>
              <View style={{ width: 36, height: 36 }} />
            </View>
          </>
        )}
      </View>

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
