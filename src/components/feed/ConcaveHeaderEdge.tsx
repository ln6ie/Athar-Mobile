// حافة مقعرة في رأس الخلاصة - فاصل بصري بين الهيدر والمحتوى
import React from 'react';
import { View, ViewStyle, ColorValue } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';
import { useFeedStyles } from '../../styles';

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
  const feedStyles = useFeedStyles();
  const fillColor = color || colors.brand.gold;

  return (
    <View style={[feedStyles.concaveHeader, { height }, style]} pointerEvents="none">
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
      >
        <Path
          d="M 0 0 L 0 15 C 35 75, 65 -15, 100 20 L 100 0 Z"
          fill={fillColor as string}
        />
      </Svg>
    </View>
  );
};
