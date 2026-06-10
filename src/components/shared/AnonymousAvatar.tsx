// صورة رمزية مجهولة - أيقونة مستخدم عشوائية مع الحروف الأولى
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSharedStyles } from '../../styles';

interface AnonymousAvatarProps {
  size?: number;
}

export const AnonymousAvatar: React.FC<AnonymousAvatarProps> = ({ size = 72 }) => {
  const sharedStyles = useSharedStyles();
  const scale = size / 72;

  return (
    <View style={[localStyles.avatarCircle, { width: size, height: size, borderRadius: size / 2 }]}>
      {/* الحلقة الخارجية للتأثير المتموج */}
      <View
        style={[
          localStyles.rippleRing,
          {
            width: size * 0.9,
            height: size * 0.9,
            borderRadius: (size * 0.9) / 2,
            opacity: 0.15,
            borderWidth: 2 * scale,
          },
        ]}
      />
      {/* الحلقة الداخلية للتأثير المتموج */}
      <View
        style={[
          localStyles.rippleRing,
          {
            width: size * 0.72,
            height: size * 0.72,
            borderRadius: (size * 0.72) / 2,
            opacity: 0.35,
            borderWidth: 1.5 * scale,
          },
        ]}
      />
      {/* شخصية المتخفي الرمزية */}
      <View style={[localStyles.characterContainer, { transform: [{ scale }] }]}>
        {/* قبعة المباحث */}
        <View style={localStyles.hatCrown} />
        <View style={localStyles.hatBrim} />
        {/* النظارات/القناع الغامض */}
        <View style={localStyles.glassesContainer}>
          <View style={localStyles.glassLens} />
          <View style={localStyles.glassesBridge} />
          <View style={localStyles.glassLens} />
        </View>
        {/* الكتفين/المعطف */}
        <View style={localStyles.shoulders} />
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  avatarCircle: {
    backgroundColor: '#0055A5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0055A5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  rippleRing: {
    position: 'absolute',
    borderColor: '#FFFFFF',
  },
  characterContainer: {
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  hatCrown: {
    width: 24,
    height: 10,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    bottom: 37,
    position: 'absolute',
    opacity: 0.95,
  },
  hatBrim: {
    width: 32,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 1.5,
    bottom: 34,
    position: 'absolute',
    opacity: 0.95,
  },
  glassesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 24,
    position: 'absolute',
  },
  glassLens: {
    width: 10,
    height: 7,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    opacity: 0.9,
  },
  glassesBridge: {
    width: 4,
    height: 2,
    backgroundColor: '#FFFFFF',
    opacity: 0.9,
  },
  shoulders: {
    width: 40,
    height: 16,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    bottom: 4,
    position: 'absolute',
    opacity: 0.85,
  },
});
