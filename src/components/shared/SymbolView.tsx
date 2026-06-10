// عرض أيقونات رموز النظام - iOS SF Symbols وأندرويد Material
import React from 'react';
import { Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

let ExpoSymbolView: any = null;
if (Platform.OS === 'ios') {
  try {
    const expoSymbols = require('expo-symbols');
    ExpoSymbolView = expoSymbols.SymbolView;
  } catch (error) {
    console.warn('[SymbolView] expo-symbols is not available, falling back to MaterialIcons.', error);
  }
}

export interface SymbolViewProps {
  name: string | { ios: string; android: string };
  size?: number;
  tintColor?: any;
  style?: any;
}

export const SymbolView: React.FC<SymbolViewProps> = ({
  name,
  size = 24,
  tintColor,
  style,
}) => {
  const iosName = typeof name === 'object' ? name.ios : name;
  const androidName = typeof name === 'object' ? name.android : name;

  if (Platform.OS === 'ios' && ExpoSymbolView) {
    return (
      <ExpoSymbolView
        name={iosName}
        size={size}
        tintColor={tintColor}
        style={style}
      />
    );
  }

  // تحويل لـ MaterialIcons لأندرويد
  // الأسماء الافتراضية متوافقة مع MaterialIcons
  let resolvedAndroidName: any = androidName;

  // أمان إضافي للأسماء غير المتوقعة
  if (resolvedAndroidName === 'close') {
    resolvedAndroidName = 'close';
  } else if (resolvedAndroidName === 'block') {
    resolvedAndroidName = 'block';
  }

  return (
    <MaterialIcons
      name={resolvedAndroidName}
      size={size}
      color={tintColor}
      style={style}
    />
  );
};
