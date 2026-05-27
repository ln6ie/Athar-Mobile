import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TOKENS } from '../constants/tokens';
import { useTheme } from '../hooks/useTheme';
import { GlassicView } from './GlassicView';

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
  const { colors, isDark } = useTheme();

  const activeTabStyle = [
    styles.tabButtonActive,
    {
      backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
      borderWidth: isDark ? 1 : 0.5,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    }
  ];

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

      {/* Left side: Floating Tab Bar Card */}
      <GlassicView
        cornerRadius={28}
        glassEffectStyle="regular"
        style={[
          styles.leftTabCard,
          { marginRight: 16 }
        ]}
      >
        {/* Home Tab */}
        <TouchableOpacity
          onPress={() => onChangeTab('feed')}
          style={[
            styles.tabButton,
            activeTab === 'feed' && activeTabStyle
          ]}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={activeTab === 'feed' ? 'home' : 'home-outline'} 
            size={24} 
            color={activeTab === 'feed' ? colors.brand.gold : colors.text.secondary} 
          />
          <Text style={[
            styles.tabLabel,
            activeTab === 'feed' ? { color: colors.brand.gold } : { color: colors.text.secondary }
          ]}>
            الرئيسية
          </Text>
        </TouchableOpacity>

        {/* Profile Tab */}
        <TouchableOpacity
          onPress={() => onChangeTab('profile')}
          style={[
            styles.tabButton,
            activeTab === 'profile' && activeTabStyle
          ]}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={activeTab === 'profile' ? 'person' : 'person-outline'} 
            size={24} 
            color={activeTab === 'profile' ? colors.brand.gold : colors.text.secondary} 
          />
          <Text style={[
            styles.tabLabel,
            activeTab === 'profile' ? { color: colors.brand.gold } : { color: colors.text.secondary }
          ]}>
            الملف الشخصي
          </Text>
        </TouchableOpacity>
      </GlassicView>
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
    flex: 1,
    height: 56,
    borderRadius: 28,
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginRight: 16,
    // iOS 26: UIGlassEffect applies its own material elevation automatically.
    // Manual shadows conflict with the native glass surface rendering.
    ...Platform.select({
      android: {
        elevation: 3,
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
    backgroundColor: 'rgba(128, 128, 128, 0.08)', // Dynamic neutral highlight for transparent backgrounds
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
});
