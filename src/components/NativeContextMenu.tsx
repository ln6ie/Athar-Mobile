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

let Host: any = React.Fragment;
let ContextMenu: any = null;
let ContextButton: any = null;
let isNativeMenuAvailable = false;

if (Platform.OS === 'ios') {
  try {
    const expoUiSwiftUi = require('@expo/ui/swift-ui');
    Host = expoUiSwiftUi.Host || React.Fragment;
    ContextMenu = expoUiSwiftUi.ContextMenu;
    ContextButton = expoUiSwiftUi.Button;
    if (ContextMenu && ContextButton) {
      isNativeMenuAvailable = true;
    }
  } catch (e) {
    // Fail-safe fallback to ActionSheetIOS if Swift UI components are not fully linked yet
    isNativeMenuAvailable = false;
  }
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

  // iOS 26+ Genuine SwiftUI Pop-Out Context Menu
  if (Platform.OS === 'ios' && isNativeMenuAvailable && ContextMenu) {
    const nonCancelOptions = options.filter((o) => o.style !== 'cancel');

    return (
      <Host matchContents>
        <ContextMenu>
          <ContextMenu.Trigger>
            <Pressable onLongPress={triggerFallbackMenu}>
              {children}
            </Pressable>
          </ContextMenu.Trigger>
          <ContextMenu.Items>
            {nonCancelOptions.map((opt, idx) => (
              <ContextButton
                key={idx}
                label={opt.label}
                onPress={opt.onPress}
                role={opt.style === 'destructive' ? 'destructive' : 'normal'}
              />
            ))}
          </ContextMenu.Items>
        </ContextMenu>
      </Host>
    );
  }

  // Universal fallback (ActionSheetIOS on iOS, Native Dialog Alert on Android)
  return (
    <Pressable onLongPress={triggerFallbackMenu} delayLongPress={450}>
      {children}
    </Pressable>
  );
};
