import React from 'react';
import { View, Text } from 'react-native';
import { GlassicView } from './GlassicView';
import { AnonymousAvatar } from './AnonymousAvatar';
import { useProfileStyles } from '../styles/ProfileStyles';

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
  const styles = useProfileStyles();

  return (
    <GlassicView cornerRadius={24} style={styles.profileHeaderCard}>
      <View style={styles.profileMainRow}>
        <View style={{ marginLeft: 16 }}>
          <AnonymousAvatar size={72} />
        </View>

        <View style={styles.profileInfoColumn}>
          <Text style={styles.profileName} numberOfLines={1} ellipsizeMode="tail">
            {anonymousName}
          </Text>
          
          <View style={styles.profileMetaRow}>
            <View style={styles.inlineStatsBox}>
              <Text style={styles.statVal}>{postsCount}</Text>
              <Text style={styles.statLabel}>منشور</Text>
            </View>
          </View>

          <Text style={styles.profileEmail}>{userEmail}</Text>
        </View>
      </View>
    </GlassicView>
  );
};
