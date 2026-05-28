import React from 'react';
import { View, StyleSheet, ViewStyle, ColorValue } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../hooks/useTheme';

interface ConcaveHeaderEdgeProps {
  color?: ColorValue;
  height?: number;
  style?: ViewStyle;
}

export const ConcaveHeaderEdge: React.FC<ConcaveHeaderEdgeProps> = ({
  color,
  height = 60,
  style,
}) => {
  const { colors } = useTheme();
  const fillColor = color || colors.brand.gold;

  return (
    <View style={[styles.container, { height }, style]} pointerEvents="none">
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
      >
        {/*
          Deep dramatic Cubic Bezier wave:
          Left edge starts at (0, 15),
          dips deeply in the middle-left (control point 35, 75),
          sweeps high on the middle-right (control point 65, -15),
          and finishes at the right edge (100, 20).
        */}
        <Path
          d="M 0 0 L 0 15 C 35 75, 65 -15, 100 20 L 100 0 Z"
          fill={fillColor as string}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'transparent',
  },
});
