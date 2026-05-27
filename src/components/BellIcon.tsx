import React from 'react';
import { View, StyleSheet, ColorValue } from 'react-native';

interface BellIconProps {
  color?: ColorValue;
}

export const BellIcon: React.FC<BellIconProps> = ({ color = '#0055A5' }) => {
  return (
    <View style={styles.bellContainer}>
      <View style={[styles.bellLoop, { borderColor: color }]} />
      <View style={[styles.bellBody, { backgroundColor: color }]} />
      <View style={[styles.bellFlare, { backgroundColor: color }]} />
      <View style={[styles.bellClapper, { backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  bellContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bellLoop: {
    width: 8,
    height: 6,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    position: 'absolute',
    top: 2,
  },
  bellBody: {
    width: 14,
    height: 10,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    position: 'absolute',
    top: 6,
  },
  bellFlare: {
    width: 18,
    height: 2.5,
    borderRadius: 1.5,
    position: 'absolute',
    top: 15,
  },
  bellClapper: {
    width: 5,
    height: 4,
    borderBottomLeftRadius: 2.5,
    borderBottomRightRadius: 2.5,
    position: 'absolute',
    bottom: 2,
  },
});
