import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AnonymousAvatar } from '../shared/AnonymousAvatar';
import { useTheme } from '../../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConcaveHeaderEdge } from '../feed/ConcaveHeaderEdge';
import { BouncyPressable } from '../shared/BouncyPressable';
import { useProfileStyles } from '../../styles';

interface ProfileHeaderCardProps {
  anonymousName: string;
  userEmail: string;
  postsCount: number;
  onPress?: () => void;
}

// بطاقة الهيدر - الاسم المجهول وعدد المنشورات مع الخلفية الذهبية
export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({
  anonymousName,
  userEmail,
  postsCount,
  onPress,
}) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const profileStyles = useProfileStyles();
  const insets = useSafeAreaInsets();

  return (
    <View style={[profileStyles.headerWrapper, { marginTop: -60, marginBottom: 70 }]}>
      <View
        style={[
          profileStyles.blueBase,
          {
            backgroundColor: colors.brand.gold,
            paddingTop: insets.top + 60,
            paddingBottom: 1,
          },
        ]}
      >
        <BouncyPressable
          style={[profileStyles.profileMainRow, { flexDirection: 'row', paddingHorizontal: 28, paddingVertical: 0 }]}
          onPress={onPress}
        >
          <View style={profileStyles.avatarCircleLarge}>
            <AnonymousAvatar size={60} />
          </View>

          <View style={[profileStyles.profileInfoColumn, { alignItems: 'flex-end', marginLeft: 16 }]}>
            <Text style={[profileStyles.profileName, { fontSize: 22, color: '#FFFFFF', lineHeight: 28 }]} numberOfLines={1} ellipsizeMode="tail">
              {anonymousName}
            </Text>

            <View style={profileStyles.profileMetaRow}>
              <View style={[profileStyles.inlineStatsBox, { backgroundColor: 'rgba(255, 255, 255, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 }]}>
                <Text style={[profileStyles.statVal, { color: '#FFFFFF' }]}>{postsCount}</Text>
                <Text style={[profileStyles.statLabel, { color: 'rgba(255, 255, 255, 0.8)' }]}>{t('profile.post_count')}</Text>
              </View>
            </View>

            <Text style={[profileStyles.profileEmail, { fontSize: 12, color: 'rgba(255, 255, 255, 0.85)' }]}>{userEmail}</Text>
          </View>
        </BouncyPressable>
      </View>

      <ConcaveHeaderEdge
        color={colors.brand.gold}
        height={60}
        style={profileStyles.concaveEdge}
      />
    </View>
  );
};
