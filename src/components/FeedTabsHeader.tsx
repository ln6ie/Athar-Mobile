import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GlassicView } from './GlassicView';
import { BellIcon } from './BellIcon';
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
  const activeTabStyle = [
    styles.activeTabButton,
    {
      backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
      borderWidth: isDark ? 1 : 0.5,
    }
  ];
  const tabTextColor = colors.text.secondary;
  const activeTabTextColor = colors.brand.gold;

  return (
    <View style={[styles.topHeaderRow, { top: topOffset }]}>
      <GlassicView
        cornerRadius={22}
        style={styles.centeredTabsCard}
      >
        <View style={[styles.tabsWrapper, { backgroundColor: tabWrapperBg }]}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'trending' && activeTabStyle]}
            onPress={() => onTabChange('trending')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, { color: tabTextColor }, activeTab === 'trending' && [styles.activeTabText, { color: activeTabTextColor }]]}>
              الرائجة
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'recent' && activeTabStyle]}
            onPress={() => onTabChange('recent')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, { color: tabTextColor }, activeTab === 'recent' && [styles.activeTabText, { color: activeTabTextColor }]]}>
              الحديثة
            </Text>
          </TouchableOpacity>
        </View>
      </GlassicView>

      <TouchableOpacity
        onPress={onBellPress}
        style={styles.sideNotificationButton}
        activeOpacity={0.7}
      >
        <BellIcon color={colors.brand.gold} />
        {unreadLikesCount > 0 && (
          <View style={globalStyles.badgeContainer}>
            <Text style={globalStyles.badgeText}>
              {unreadLikesCount > 9 ? '9+' : unreadLikesCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
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
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    height: 38,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabButton: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3.5,
    elevation: 2,
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
