import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';
import { ThemeMode } from '../store/useThemeStore';
import { GlassicView } from './GlassicView';
import { BouncyPressable } from './BouncyPressable';

interface ThemeSelectorProps {
  minimal?: boolean;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ minimal = false }) => {
  const { themeMode, setThemeMode, colors, isDark } = useTheme();

  const options: { mode: ThemeMode; label: string }[] = [
    { mode: 'dark', label: 'داكن' },
    { mode: 'system', label: 'تلقائي' },
    { mode: 'light', label: 'الفاتح' },
  ];

  // Dynamic layout measurements for 3-column spring capsule animation
  const containerWidth = useSharedValue(0);
  const slideTranslation = useSharedValue(0);

  const updateSlidePosition = () => {
    'worklet';
    if (containerWidth.value === 0) return;
    const buttonWidth = (containerWidth.value - 8) / 3; // padding 4 on each side = 8 total
    
    let targetIndex = 1; // Default to 'system'
    if (themeMode === 'dark') targetIndex = 0;
    if (themeMode === 'light') targetIndex = 2;

    // In RTL: dark (0) is at 0, system (1) is at -buttonWidth, light (2) is at -2 * buttonWidth
    slideTranslation.value = withSpring(
      -targetIndex * buttonWidth,
      { damping: 15, stiffness: 150, mass: 0.6 }
    );
  };

  useEffect(() => {
    updateSlidePosition();
  }, [themeMode]);

  const onLayout = (e: any) => {
    containerWidth.value = e.nativeEvent.layout.width;
    updateSlidePosition();
  };

  const sliderAnimatedStyle = useAnimatedStyle(() => {
    const buttonWidth = containerWidth.value > 0 ? (containerWidth.value - 8) / 3 : 80;
    return {
      width: buttonWidth,
      transform: [{ translateX: slideTranslation.value }],
    };
  });

  const renderContent = () => (
    <>
      <Text style={[styles.title, { color: colors.brand.gold }]}>مظهر التطبيق</Text>
      
      <View
        style={[styles.segmentContainer, { backgroundColor: isDark ? '#000000' : colors.background.input }]}
        onLayout={onLayout}
      >
        {/* Spring-Driven 3-Column Sliding Backdrop Capsule */}
        <Animated.View
          style={[
            styles.activeSlider,
            {
              backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
              borderWidth: isDark ? 1 : 0.5,
            },
            sliderAnimatedStyle,
          ]}
        />

        {options.map((opt) => {
          const isActive = themeMode === opt.mode;
          return (
            <BouncyPressable
              key={opt.mode}
              style={styles.segmentButton}
              onPress={() => setThemeMode(opt.mode)}
            >
              <Text
                style={[
                  styles.segmentText,
                  isActive
                    ? [styles.activeSegmentText, { color: colors.brand.gold }]
                    : { color: colors.text.secondary },
                ]}
              >
                {opt.label}
              </Text>
            </BouncyPressable>
          );
        })}
      </View>
    </>
  );

  if (minimal) {
    return (
      <View style={[styles.minimalContainer, { borderTopColor: colors.border.muted }]}>
        {renderContent()}
      </View>
    );
  }

  return (
    <GlassicView cornerRadius={24} style={styles.container}>
      {renderContent()}
    </GlassicView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  minimalContainer: {
    borderTopWidth: 1,
    paddingTop: 16,
    marginTop: 12,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 12,
  },
  segmentContainer: {
    flexDirection: 'row-reverse',
    borderRadius: 24,
    padding: 4,
    position: 'relative',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  activeSlider: {
    position: 'absolute',
    right: 4,
    top: 4,
    height: 36,
    borderRadius: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 1,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
  },
  activeSegmentText: {
    fontWeight: 'bold',
  },
});
