import React from 'react';
import { Platform, Alert, ActionSheetIOS, Pressable } from 'react-native';

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
      // Android: Native system options dialog
      const activeOptions = options.filter((o) => o.style !== 'cancel');
      Alert.alert(
        title || 'خيارات الأثر',
        message || 'الرجاء اختيار أحد الإجراءات التالية:',
        activeOptions.map((o) => ({
          text: o.label,
          style: o.style === 'destructive' ? 'destructive' : 'default',
          onPress: o.onPress,
        })),
        { cancelable: true }
      );
    }
  };

  // Universal stable native sheet trigger on long press
  return (
    <Pressable onLongPress={triggerFallbackMenu} delayLongPress={450}>
      {children}
    </Pressable>
  );
};
