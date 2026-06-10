import React from 'react';
import { View, StyleSheet, ColorValue } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useSharedStyles } from '../../styles';

interface LogoProps {
  size?: number;
  color?: ColorValue;
}

// اللوغو - ثلاث حلقات متحركة مع نقطة مركزية
export const Logo: React.FC<LogoProps> = ({ size = 120, color }) => {
  const { colors } = useTheme();
  const sharedStyles = useSharedStyles();
  const logoColor = color || colors.brand.gold;

  return (
    <View style={[localStyles.container, { width: size, height: size }]}>
      {/* الحلقة الخارجية الثالثة */}
      <View style={[
        sharedStyles.ring,
        sharedStyles.ringOuter3,
        { width: size, height: size, borderRadius: size / 2, borderColor: logoColor }
      ]} />

      {/* الحلقة الخارجية الثانية */}
      <View style={[
        sharedStyles.ring,
        sharedStyles.ringOuter2,
        { width: size * 0.75, height: size * 0.75, borderRadius: (size * 0.75) / 2, borderColor: logoColor }
      ]} />

      {/* الحلقة الخارجية الأولى */}
      <View style={[
        sharedStyles.ring,
        sharedStyles.ringOuter1,
        { width: size * 0.5, height: size * 0.5, borderRadius: (size * 0.5) / 2, borderColor: logoColor }
      ]} />

      {/* النقطة المركزية */}
      <View style={[
        { width: size * 0.2, height: size * 0.2, borderRadius: (size * 0.2) / 2, backgroundColor: logoColor }
      ]} />
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
});
