// قائمة سياق أصلية لنظام iOS - بديل ActionSheet
import React from 'react';
import { Platform, Alert, ActionSheetIOS, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';

interface ContextMenuOption {
  label: string;
  onPress: () => void;
  style?: 'default' | 'destructive' | 'cancel';
}

interface NativeContextMenuProps {
  children: React.ReactNode;
  options: ContextMenuOption[];
  title?: string;
  message?: string;
}

export const NativeContextMenu: React.FC<NativeContextMenuProps> = ({
  children,
  options,
  title,
  message,
}) => {
  const { t } = useTranslation();
  const triggerFallbackMenu = () => {
    if (Platform.OS === 'ios') {
      const labels = options.map((o) => o.label);
      const cancelIndex = options.findIndex((o) => o.style === 'cancel');
      const destructiveIndex = options.findIndex((o) => o.style === 'destructive');

      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: labels,
          title: title || undefined,
          message: message || undefined,
          cancelButtonIndex: cancelIndex >= 0 ? cancelIndex : undefined,
          destructiveButtonIndex: destructiveIndex >= 0 ? destructiveIndex : undefined,
        },
        (buttonIndex) => {
          if (buttonIndex !== cancelIndex && options[buttonIndex]) {
            options[buttonIndex].onPress();
          }
        }
      );
    } else {
      // أندرويد: قائمة خيارات النظام
      const activeOptions = options.filter((o) => o.style !== 'cancel');
      Alert.alert(
        title || t('menu.title'),
        message || t('menu.message'),
        activeOptions.map((o) => ({
          text: o.label,
          style: o.style === 'destructive' ? 'destructive' : 'default',
          onPress: o.onPress,
        })),
        { cancelable: true }
      );
    }
  };

  // مشغل القائمة عند الضغط المطول
  return (
    <Pressable onLongPress={triggerFallbackMenu} delayLongPress={450}>
      {children}
    </Pressable>
  );
};
