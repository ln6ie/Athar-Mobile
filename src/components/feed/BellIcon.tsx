// أيقونة الجرس المخصصة - تصميم ثلاثي الأبعاد بالكود
import React from 'react';
import { View, ColorValue } from 'react-native';
import { useFeedStyles } from '../../styles';

interface BellIconProps {
  color?: ColorValue;
}

export const BellIcon: React.FC<BellIconProps> = ({ color = '#0055A5' }) => {
  const feedStyles = useFeedStyles();

  return (
    <View style={feedStyles.bellContainer}>
      <View style={[feedStyles.bellLoop, { borderColor: color }]} />
      <View style={[feedStyles.bellBody, { backgroundColor: color }]} />
      <View style={[feedStyles.bellFlare, { backgroundColor: color }]} />
      <View style={[feedStyles.bellClapper, { backgroundColor: color }]} />
    </View>
  );
};
