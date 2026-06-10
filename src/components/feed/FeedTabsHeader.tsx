import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { SymbolView } from '../shared/SymbolView';
import { GlassicView } from '../shared/GlassicView';
import { BouncyPressable } from '../shared/BouncyPressable';
import { useTheme } from '../../hooks/useTheme';
import { useGlobalStyles, useFeedStyles } from '../../styles';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const globalStyles = useGlobalStyles();
  const feedStyles = useFeedStyles();

  const tabWrapperBg = isDark ? '#000000' : colors.background.input;
  const tabTextColor = colors.text.secondary;
  const activeTabTextColor = '#FFFFFF';

  const containerWidth = useSharedValue(0);
  const slideTranslation = useSharedValue(activeTab === 'recent' ? 0 : -82);

  const updateSlidePosition = () => {
    'worklet';
    if (containerWidth.value <= 0) return;
    const buttonWidth = (containerWidth.value - 6) / 2;
    slideTranslation.value = withSpring(
      activeTab === 'recent' ? 0 : -buttonWidth,
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
    <View style={[feedStyles.topHeaderRow, { top: topOffset }]}>
      <GlassicView
        cornerRadius={22}
        style={feedStyles.centeredTabsCard}
      >
        <View
          style={[feedStyles.tabsWrapper, { backgroundColor: tabWrapperBg }]}
          onLayout={onLayout}
        >
          <Animated.View
            style={[
              feedStyles.activeSlider,
              {
                backgroundColor: colors.brand.gold,
                borderColor: 'transparent',
                borderWidth: 0,
              },
              sliderAnimatedStyle,
            ]}
          />

          <BouncyPressable
            style={feedStyles.tabButton}
            onPress={() => onTabChange('recent')}
          >
            <Text
              style={[
                feedStyles.tabText,
                { color: tabTextColor },
                activeTab === 'recent' && [
                  feedStyles.activeTabText,
                  { color: activeTabTextColor },
                ],
              ]}
            >
              {t('feed.recent')}
            </Text>
          </BouncyPressable>

          <BouncyPressable
            style={feedStyles.tabButton}
            onPress={() => onTabChange('trending')}
          >
            <Text
              style={[
                feedStyles.tabText,
                { color: tabTextColor },
                activeTab === 'trending' && [
                  feedStyles.activeTabText,
                  { color: activeTabTextColor },
                ],
              ]}
            >
              {t('feed.trending')}
            </Text>
          </BouncyPressable>
        </View>
      </GlassicView>

      <BouncyPressable
        onPress={onBellPress}
        style={feedStyles.sideNotificationButton}
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
