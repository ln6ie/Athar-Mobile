import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnonymousAvatar } from './AnonymousAvatar';
import { useTheme } from '../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ProfileHeaderCardProps {
  anonymousName: string;
  userEmail: string;
  postsCount: number;
}

export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({
  anonymousName,
  userEmail,
  postsCount,
}) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.headerWrapper}>
      {/* Foreground Main Curved Wave Card */}
      <View
        style={[
          styles.mainWaveCard,
          {
            backgroundColor: colors.brand.gold,
            paddingTop: Math.max(insets.top + 16, 40),
          },
        ]}
      />

      {/* Actual Content placed inside the main card area */}
      <View style={[styles.contentContainer, { paddingTop: Math.max(insets.top + 16, 40) }]}>
        <View style={styles.headerRow}>
          {/* Avatar on the Left with dynamic white glow */}
          <View style={styles.avatarWrapper}>
            <AnonymousAvatar size={70} />
          </View>

          {/* User Information on the Right (Arabic RTL layout) */}
          <View style={styles.profileInfoColumn}>
            <Text style={styles.profileName} numberOfLines={1} ellipsizeMode="tail">
              {anonymousName}
            </Text>

            <View style={styles.metaRow}>
              {/* Stat box styled with glassmorphism on blue card */}
              <View style={styles.inlineStatsBox}>
                <Text style={styles.statVal}>{postsCount}</Text>
                <Text style={styles.statLabel}>منشور</Text>
              </View>
            </View>

            <Text style={styles.profileEmail}>{userEmail}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
    position: 'relative',
    // Push the profile container down slightly less to accommodate the wave card natively
    marginBottom: 20,
  },
  backgroundWave: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: -10,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 130, // Opposite curve layer to create wave overlap
  },
  mainWaveCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderBottomLeftRadius: 130, // Deep wave sweep on the left
    borderBottomRightRadius: 50,  // Soft curve on the right
    // Premium soft card drop shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 8,
  },
  contentContainer: {
    width: '100%',
    paddingBottom: 36,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 28,
  },
  avatarWrapper: {
    // Elegant soft glow backlighting for avatar
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  profileInfoColumn: {
    alignItems: 'flex-end', // Align texts to the right for Arabic RTL
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF', // High-end white text directly overlaying the blue card
    lineHeight: 28,
    textAlign: 'right',
  },
  metaRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 6,
  },
  inlineStatsBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Glassmorphism stat card
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  statVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 14,
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginRight: 4,
    lineHeight: 12,
  },
  profileEmail: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)', // Highly readable semi-transparent white on blue
    marginTop: 6,
    lineHeight: 16,
    textAlign: 'right',
  },
});
