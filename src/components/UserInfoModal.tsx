import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Clipboard,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { GlassicView } from './GlassicView';
import { BouncyPressable } from './BouncyPressable';
import { SymbolView } from './SymbolView';
import { AnonymousAvatar } from './AnonymousAvatar';
import { ConcaveHeaderEdge } from './ConcaveHeaderEdge';

interface UserInfoModalProps {
  visible: boolean;
  onClose: () => void;
  anonymousName: string;
  userEmail: string;
  postsCount: number;
}

export const UserInfoModal: React.FC<UserInfoModalProps> = ({
  visible,
  onClose,
  anonymousName,
  userEmail,
  postsCount,
}) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const handleCopyName = () => {
    Clipboard.setString(anonymousName);
    alert('تم نسخ الاسم المستعار بنجاح!');
  };

  const handleCopyEmail = () => {
    Clipboard.setString(userEmail);
    alert('تم نسخ البريد الإلكتروني بنجاح!');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background.default }]}>
        {/* --- Header: Brand S-Curve Design with Avatar --- */}
        <View style={styles.headerWrapper}>
          <View
            style={[
              styles.blueBase,
              {
                backgroundColor: colors.brand.gold,
                paddingTop: Math.max(insets.top, 24) + 40,
                paddingBottom: 24,
              },
            ]}
          >
            {/* Close circular glass button */}
            <View style={styles.closeButtonContainer}>
              <GlassicView cornerRadius={14} style={styles.circularCloseButton}>
                <BouncyPressable onPress={onClose} style={styles.centerAll}>
                  <SymbolView
                    name={{ ios: 'xmark', android: 'close' }}
                    size={11}
                    tintColor="#FFFFFF"
                  />
                </BouncyPressable>
              </GlassicView>
            </View>

            {/* Header Content Row */}
            <View style={styles.headerRow}>
              {/* White avatar container */}
              <View style={styles.avatarCircle}>
                <AnonymousAvatar size={60} />
              </View>

              {/* Title & Info */}
              <View style={styles.profileInfoColumn}>
                <Text style={styles.profileName} numberOfLines={1} ellipsizeMode="tail">
                  {anonymousName}
                </Text>
                
                {/* Compact, elegant capsule for posts count right inside the blue header */}
                <View style={styles.postsCountCapsule}>
                  <Text style={styles.postsCountText}>
                    {postsCount} منشورات
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Curved Edge */}
          <ConcaveHeaderEdge
            color={colors.brand.gold}
            height={60}
            style={styles.concaveEdge}
          />
        </View>

        {/* --- Modal Content: User Details & Stats --- */}
        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>بيانات الحساب الشخصية</Text>

          {/* Active Anonymous Name Card */}
          <GlassicView cornerRadius={24} style={styles.infoCard}>
            <View style={styles.cardRow}>
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.text.disabled }]}>الاسم المستعار </Text>
                <Text style={[styles.infoVal, { color: colors.text.primary }]}>{anonymousName}</Text>
              </View>
              <BouncyPressable onPress={handleCopyName} style={styles.actionIconButton}>
                <SymbolView
                  name={{ ios: 'doc.on.doc.fill', android: 'content-copy' }}
                  size={16}
                  tintColor={colors.text.secondary}
                />
              </BouncyPressable>
            </View>
          </GlassicView>

          {/* Registered Email Card */}
          <GlassicView cornerRadius={24} style={styles.infoCard}>
            <View style={styles.cardRow}>
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.text.disabled }]}>البريد الإلكتروني المسجل</Text>
                <Text style={[styles.infoVal, { color: colors.text.primary }]}>{userEmail}</Text>
              </View>
              <BouncyPressable onPress={handleCopyEmail} style={styles.actionIconButton}>
                <SymbolView
                  name={{ ios: 'doc.on.doc.fill', android: 'content-copy' }}
                  size={16}
                  tintColor={colors.text.secondary}
                />
              </BouncyPressable>
            </View>
          </GlassicView>

          {/* Informational Message */}
          <GlassicView cornerRadius={20} style={styles.securityNote}>
            <Text style={[styles.noteText, { color: colors.text.secondary }]}>
               يلتزم تطبيق "أثر" بالحفاظ التام والكامل على سرية هويتك. معلومات حسابك والبريد الإلكتروني لا تظهر لأي مستخدم آخر وتستخدم فقط لغايات المصادقة الثنائية الآمنة واسترجاع الحساب.
            </Text>
          </GlassicView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    width: '100%',
    position: 'relative',
    zIndex: 10,
    marginTop: -100, // Notch Bleed Hack
    marginBottom: 70,
  },
  blueBase: {
    width: '100%',
  },
  closeButtonContainer: {
    position: 'absolute',
    left: 24,
    top: Platform.OS === 'ios' ? 120 : 110,
    zIndex: 20,
  },
  circularCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent glass close
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerAll: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 28,
    marginTop: 20,
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
    alignItems: 'flex-end',
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 28,
    textAlign: 'right',
  },
  postsCountCapsule: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 12,
    marginTop: 6,
  },
  postsCountText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  concaveEdge: {
    position: 'absolute',
    bottom: -60,
    left: 0,
    right: 0,
    zIndex: 15,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 16,
  },
  infoCard: {
    padding: 16,
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  infoTextContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  infoLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  infoVal: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  securityNote: {
    padding: 16,
    marginTop: 8,
  },
  noteText: {
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'right',
  },
});
