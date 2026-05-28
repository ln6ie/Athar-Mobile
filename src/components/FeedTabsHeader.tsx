import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { SymbolView } from './SymbolView';
import { GlassicView } from './GlassicView';
import { BouncyPressable } from './BouncyPressable';
import { useTheme } from '../hooks/useTheme';
import { useGlobalStyles } from '../styles/globalStyles';

interface FeedTabsHeaderProps {
  topOffset: number;
  activeTab: 'recent' | 'trending';
  onTabChange: (tab: 'recent' | 'trending') => void;
  unreadLikesCount: number;
  onBellPress: () => void;
}

export const FeedTabsHeader: React.FC<FeedTabsHeaderProps> = ({
  topOffset,
  activeTab,
  onTabChange,
  unreadLikesCount,
  onBellPress,
}) => {
  const { colors, isDark } = useTheme();
  const globalStyles = useGlobalStyles();

  const tabWrapperBg = isDark ? '#000000' : colors.background.input;
  const tabTextColor = colors.text.secondary;
  const activeTabTextColor = colors.brand.gold;

  // Dynamic layout measurements for dynamic capsule spring slides
  const containerWidth = useSharedValue(0);
  const slideTranslation = useSharedValue(0);

  const updateSlidePosition = () => {
    'worklet';
    if (containerWidth.value === 0) return;
    const buttonWidth = (containerWidth.value - 6) / 2; // total padding of 6px (3px on each side)
    // In RTL, Trending is on the right (0), Recent is on the left (-buttonWidth)
    slideTranslation.value = withSpring(
      activeTab === 'trending' ? 0 : -buttonWidth,
      { damping: 15, stiffness: 150, mass: 0.6 }
    );
  };

  useEffect(() => {
    updateSlidePosition();
  }, [activeTab]);

  const onLayout = (e: any) => {
    containerWidth.value = e.nativeEvent.layout.width;
    updateSlidePosition();
  };

  const sliderAnimatedStyle = useAnimatedStyle(() => {
    const buttonWidth = containerWidth.value > 0 ? (containerWidth.value - 6) / 2 : 82;
    return {
      width: buttonWidth,
      transform: [{ translateX: slideTranslation.value }],
    };
  });

  return (
    <View style={[styles.topHeaderRow, { top: topOffset }]}>
      <GlassicView
        cornerRadius={22}
        style={styles.centeredTabsCard}
      >
        <View
          style={[styles.tabsWrapper, { backgroundColor: tabWrapperBg }]}
          onLayout={onLayout}
        >
          {/* Spring-Driven Premium Sliding Backdrop Capsule */}
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

          <BouncyPressable
            style={styles.tabButton}
            onPress={() => onTabChange('trending')}
          >
            <Text
              style={[
                styles.tabText,
                { color: tabTextColor },
                activeTab === 'trending' && [
                  styles.activeTabText,
                  { color: activeTabTextColor },
                ],
              ]}
            >
              الرائجة
            </Text>
          </BouncyPressable>

          <BouncyPressable
            style={styles.tabButton}
            onPress={() => onTabChange('recent')}
          >
            <Text
              style={[
                styles.tabText,
                { color: tabTextColor },
                activeTab === 'recent' && [
                  styles.activeTabText,
                  { color: activeTabTextColor },
                ],
              ]}
            >
              الحديثة
            </Text>
          </BouncyPressable>
        </View>
      </GlassicView>

      <BouncyPressable
        onPress={onBellPress}
        style={styles.sideNotificationButton}
      >
        <SymbolView
          name={{ ios: 'bell.fill', android: 'notifications' }}
          size={22}
          tintColor={colors.brand.gold}
        />
        {unreadLikesCount > 0 && (
          <View style={globalStyles.badgeContainer}>
            <Text style={globalStyles.badgeText}>
              {unreadLikesCount > 9 ? '9+' : unreadLikesCount}
            </Text>
          </View>
        )}
      </BouncyPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  topHeaderRow: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  centeredTabsCard: {
    width: 170,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    padding: 3,
  },
  tabsWrapper: {
    flexDirection: 'row-reverse',
    flex: 1,
    borderRadius: 20,
    position: 'relative',
    padding: 3,
  },
  tabButton: {
    flex: 1,
    height: 38,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  activeSlider: {
    position: 'absolute',
    right: 3,
    top: 3,
    height: 32,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3.5,
    elevation: 2,
    zIndex: 1,
  },
  tabText: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  activeTabText: {
    fontWeight: '700',
  },
  sideNotificationButton: {
    position: 'absolute',
    left: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
