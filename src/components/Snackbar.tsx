import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, Animated, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useToastStore } from '../store/useToastStore';
import { useTheme } from '../hooks/useTheme';

export const Snackbar: React.FC = () => {
  const { visible, message, hide } = useToastStore();
  const { isDark } = useTheme();
  
  // Slide animation value
  const slideAnim = useRef(new Animated.Value(100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = React.useState(false);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      // Animate up and fade in
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate down and fade out
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setShouldRender(false);
        }
      });
    }
  }, [visible]);

  if (!shouldRender) return null;

  // Premium obsidian dark frosted glass theme for dark mode / platinum tint for light mode
  const backgroundColor = isDark 
    ? 'rgba(28, 28, 30, 0.92)' 
    : 'rgba(0, 0, 0, 0.88)'; // Solid high-end obsidian black for light mode to read clearly

  const borderColor = isDark 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(255, 255, 255, 0.15)';

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        }
      ]}
    >
      <BlurView
        intensity={60}
        tint="dark"
        style={[
          styles.container,
          {
            backgroundColor,
            borderColor,
          }
        ]}
      >
        <Text style={styles.messageText}>
          {message}
        </Text>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 95 : 85, // Float right above the Add Button / Tab Bar
    left: 24,
    right: 24,
    zIndex: 99999,
  },
  container: {
    borderRadius: 16,
    borderWidth: 0.8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    overflow: 'hidden',
    flexDirection: 'row-reverse', // Arabic RTL default
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 18,
  },
});
