// زر قابل للضغط مع تأثير ارتداد سلس
import React from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface BouncyPressableProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  shrinkTo?: number;
}

// فصل أنماط التخطيط الخارجي عن الأنماط البصرية للضغط
const splitStyles = (style: any) => {
  const flattened = StyleSheet.flatten(style) || {};
  const layoutKeys = [
    'flex',
    'flexGrow',
    'flexShrink',
    'flexBasis',
    'width',
    'height',
    'margin',
    'marginTop',
    'marginBottom',
    'marginLeft',
    'marginRight',
    'marginHorizontal',
    'marginVertical',
    'position',
    'top',
    'bottom',
    'left',
    'right',
    'zIndex',
    'alignSelf',
  ];

  const layoutStyle: any = {};
  const innerStyle: any = {};

  Object.keys(flattened).forEach((key) => {
    if (layoutKeys.includes(key)) {
      layoutStyle[key] = flattened[key];
    } else {
      innerStyle[key] = flattened[key];
    }
  });

  return { layoutStyle, innerStyle };
};

export const BouncyPressable: React.FC<BouncyPressableProps> = ({
  children,
  style,
  shrinkTo = 0.96,
  ...pressableProps
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    'worklet';
    scale.value = withSpring(shrinkTo, { damping: 15, stiffness: 150, mass: 0.6 });
  };

  const handlePressOut = () => {
    'worklet';
    scale.value = withSpring(1, { damping: 15, stiffness: 150, mass: 0.6 });
  };

  const { layoutStyle, innerStyle } = splitStyles(style);

  return (
    <Animated.View style={[layoutStyle, animatedStyle]}>
      <Pressable
        {...pressableProps}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          innerStyle,
          {
            width: layoutStyle.width ? '100%' : undefined,
            height: layoutStyle.height ? '100%' : undefined,
          },
          layoutStyle.flex ? { width: '100%' } : null,
        ]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};
