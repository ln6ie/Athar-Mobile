import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { TOKENS } from '../constants/tokens';
import { useTheme } from '../hooks/useTheme';

interface FloatingTabBarProps {
  activeTab: 'feed' | 'profile';
  onChangeTab: (tab: 'feed' | 'profile') => void;
  onAddPress: () => void;
}

export const FloatingTabBar: React.FC<FloatingTabBarProps> = ({ 
  activeTab, 
  onChangeTab, 
  onAddPress 
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.outerContainer}>
      {/* Right side: Standalone Round Add Button (RTL Default) */}
      <TouchableOpacity
        onPress={onAddPress}
        style={[
          styles.standaloneAddButton, 
          { backgroundColor: colors.brand.gold, shadowColor: colors.brand.gold }
        ]}
        activeOpacity={0.85}
      >
        <View style={styles.plusIconContainer}>
          <View style={styles.plusBarHorizontal} />
          <View style={styles.plusBarVertical} />
        </View>
      </TouchableOpacity>

      {/* Left side: Floating Tab Bar Card (Special Buttons) */}
      <View style={[
        styles.leftTabCard, 
        { backgroundColor: colors.brand.gold, shadowColor: colors.brand.gold }
      ]}>
        {/* Home Tab */}
        <TouchableOpacity
          onPress={() => onChangeTab('feed')}
          style={[
            styles.tabButton,
            activeTab === 'feed' && styles.tabButtonActive
          ]}
          activeOpacity={0.8}
        >
          {/* Custom dense vector Home icon drawn with CSS */}
          <View style={styles.homeIconContainer}>
            <View style={[
              styles.homeRoofSolid,
              { borderBottomColor: activeTab === 'feed' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)' }
            ]} />
            <View style={[
              styles.homeBodySolid,
              { backgroundColor: activeTab === 'feed' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)' }
            ]} />
          </View>
          <Text style={[
            styles.tabLabel,
            activeTab === 'feed' ? styles.tabLabelActive : styles.tabLabelInactive
          ]}>
            الرئيسية
          </Text>
        </TouchableOpacity>

        {/* Profile Tab */}
        <TouchableOpacity
          onPress={() => onChangeTab('profile')}
          style={[
            styles.tabButton,
            activeTab === 'profile' && styles.tabButtonActive
          ]}
          activeOpacity={0.8}
        >
          {/* Custom dense vector Profile icon drawn with CSS */}
          <View style={styles.profileIconContainer}>
            <View style={[
              styles.profileHeadSolid,
              { backgroundColor: activeTab === 'profile' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)' }
            ]} />
            <View style={[
              styles.profileShouldersSolid,
              { backgroundColor: activeTab === 'profile' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)' }
            ]} />
          </View>
          <Text style={[
            styles.tabLabel,
            activeTab === 'profile' ? styles.tabLabelActive : styles.tabLabelInactive
          ]}>
            الملف الشخصي
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    height: 60,
    flexDirection: 'row-reverse', // RTL Layout: Add button on right, special buttons card on left
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  standaloneAddButton: {
    width: 60,
    height: 60,
    borderRadius: 30, // Exactly 100% round circular shape
    backgroundColor: TOKENS.colors.brand.gold, // Royal sky blue brand color
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: TOKENS.colors.brand.gold,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.22,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  plusIconContainer: {
    width: 24,
    height: 24,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusBarHorizontal: {
    position: 'absolute',
    width: 22,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  plusBarVertical: {
    position: 'absolute',
    width: 4,
    height: 22,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  leftTabCard: {
    flex: 1, // Fill remaining space on the left
    height: 56,
    borderRadius: 28, // Exactly 100% rounded corners for navigation pill
    backgroundColor: TOKENS.colors.brand.gold, // Solid royal blue brand color, no transparency!
    borderWidth: 0, // Solid background needs no borders
    borderColor: 'transparent',
    flexDirection: 'row-reverse', // Arabic RTL button alignment
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginRight: 16, // Perfect 16px visual spacing gap from the Add button
    ...Platform.select({
      ios: {
        shadowColor: TOKENS.colors.brand.gold,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.22,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  tabButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column', // Vertical stack layout
    paddingVertical: 2,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Premium semi-transparent white highlight
  },
  tabLabel: {
    fontSize: 9, // Slightly smaller and extremely premium
    fontWeight: 'bold',
    marginTop: 3, // Vertical margin separation from icon
    lineHeight: 12,
  },
  tabLabelActive: {
    color: '#FFFFFF', // Crisp white for the active tab label
  },
  tabLabelInactive: {
    color: 'rgba(255, 255, 255, 0.6)', // Muted semi-transparent white for inactive tabs
  },
  // CSS Vector Drawing Styles
  homeIconContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeRoofSolid: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  homeBodySolid: {
    width: 14,
    height: 9,
    marginTop: -0.5,
  },
  profileIconContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeadSolid: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 2,
  },
  profileShouldersSolid: {
    width: 18,
    height: 7,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
  },
});
