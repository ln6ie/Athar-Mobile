import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface GlassicViewProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  cornerRadius?: number;
  glassEffectStyle?: 'regular' | 'clear';
  isInteractive?: boolean;
  tintColor?: string;
}
