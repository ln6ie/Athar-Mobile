import { View, Text, StyleSheet } from 'react-native';
import { AnonymousAvatar } from './AnonymousAvatar';
import { useTheme } from '../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConcaveHeaderEdge } from './ConcaveHeaderEdge';
import { BouncyPressable } from './BouncyPressable';

interface ProfileHeaderCardProps {
  anonymousName: string;
  userEmail: string;
  postsCount: number;
  onPress?: () => void;
}

export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({
  anonymousName,
  userEmail,
  postsCount,
  onPress,
}) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.headerWrapper}>
      <View
        style={[
          styles.blueBase,
          {
            backgroundColor: colors.brand.gold,
            paddingTop: insets.top + 60 ,//pacted top notch offset compensation
            paddingBottom: 1,  // Compacted bottom padding to shrink vertical size
          },
        ]}
      >
        {/* Actual Content placed inside the main card area (tap to open sheet) */}
        <BouncyPressable style={styles.headerRow} onPress={onPress}>
          {/* Avatar on the Left with premium white circle container */}
          <View style={styles.avatarCircle}>
            <AnonymousAvatar size={60} />
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
        </BouncyPressable>
      </View>

      {/* The Concave Edge absolute-anchored at the bottom */}
      <ConcaveHeaderEdge
        color={colors.brand.gold}
        height={60}
        style={styles.concaveEdge}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
    position: 'relative',
    zIndex: 10,
    marginTop: -60, // Pulls the background up to bleed under the status bar, matching the custom insets.top + 60 padding!
    marginBottom: 70, // Spacing cleared perfectly for the deep S-Curve SVG below!
  },
  blueBase: {
    width: '100%',
  },
  concaveEdge: {
    position: 'absolute',
    bottom: -60,
    left: 0,
    right: 0,
    zIndex: 15,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 28,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
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
