import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Clipboard,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { GlassicView } from '../shared/GlassicView';
import { BouncyPressable } from '../shared/BouncyPressable';
import { SymbolView } from '../shared/SymbolView';
import { AnonymousAvatar } from '../shared/AnonymousAvatar';
import { ConcaveHeaderEdge } from '../feed/ConcaveHeaderEdge';
import { useGlobalStyles, useSharedStyles, useProfileStyles, iconButtons, textPresets } from '../../styles';

interface UserInfoModalProps {
  visible: boolean;
  onClose: () => void;
  anonymousName: string;
  userEmail: string;
  postsCount: number;
}

// نافذة معلومات المستخدم - عرض الاسم المجهول والبريد مع إمكانية النسخ
export const UserInfoModal: React.FC<UserInfoModalProps> = ({
  visible,
  onClose,
  anonymousName,
  userEmail,
  postsCount,
}) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const globalStyles = useGlobalStyles();
  const sharedStyles = useSharedStyles();
  const profileStyles = useProfileStyles();

  const handleCopyName = () => {
    Clipboard.setString(anonymousName);
    alert(t('user_info.name_copied'));
  };

  const handleCopyEmail = () => {
    Clipboard.setString(userEmail);
    alert(t('user_info.email_copied'));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={globalStyles.container}>
        {/* --- الترويسة: تصميم منحني مع الصورة الرمزية --- */}
        <View style={profileStyles.headerWrapper}>
          <View
            style={[
              profileStyles.blueBase,
              {
                backgroundColor: colors.brand.gold,
                paddingTop: Math.max(insets.top, 8) + 12,
                paddingBottom: 16,
              },
            ]}
          >
            {/* صف محتوى الترويسة */}
            <View style={localStyles.headerRow}>
              {/* حاوية الصورة الرمزية البيضاء */}
              <View style={profileStyles.avatarCircleLarge}>
                <AnonymousAvatar size={60} />
              </View>

              {/* العنوان والمعلومات */}
              <View style={localStyles.profileInfoColumn}>
                <Text style={localStyles.profileName} numberOfLines={1} ellipsizeMode="tail">
                  {anonymousName}
                </Text>
                
                {/* كبسولة أنيقة لعدد المنشورات داخل الترويسة */}
                <View style={localStyles.postsCountCapsule}>
                  <Text style={localStyles.postsCountText}>
                    {t('user_info.posts_count', { count: postsCount })}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* الحافة المقعرة */}
          <ConcaveHeaderEdge
            color={colors.brand.gold}
            height={60}
            style={profileStyles.concaveEdge}
          />
        </View>

        {/* --- محتوى النافذة: تفاصيل المستخدم والإحصائيات --- */}
        <View style={localStyles.content}>
          <Text style={[sharedStyles.sectionTitle, { color: colors.text.primary }]}>{t('user_info.title')}</Text>

          {/* بطاقة الاسم المستعار النشط */}
          <GlassicView cornerRadius={24} style={localStyles.infoCard}>
            <View style={sharedStyles.rowReverse}>
              <View style={localStyles.infoTextContainer}>
                <Text style={[textPresets.small, { marginBottom: 4, color: colors.text.disabled }]}>{t('user_info.anonymous_name')} </Text>
                <Text style={[localStyles.infoVal, { color: colors.text.primary }]}>{anonymousName}</Text>
              </View>
              <BouncyPressable onPress={handleCopyName} style={iconButtons.md}>
                <SymbolView
                  name={{ ios: 'doc.on.doc.fill', android: 'content-copy' }}
                  size={16}
                  tintColor={colors.text.secondary}
                />
              </BouncyPressable>
            </View>
          </GlassicView>

          {/* بطاقة البريد الإلكتروني المسجل */}
          <GlassicView cornerRadius={24} style={localStyles.infoCard}>
            <View style={sharedStyles.rowReverse}>
              <View style={localStyles.infoTextContainer}>
                <Text style={[textPresets.small, { marginBottom: 4, color: colors.text.disabled }]}>{t('user_info.registered_email')}</Text>
                <Text style={[localStyles.infoVal, { color: colors.text.primary }]}>{userEmail}</Text>
              </View>
              <BouncyPressable onPress={handleCopyEmail} style={iconButtons.md}>
                <SymbolView
                  name={{ ios: 'doc.on.doc.fill', android: 'content-copy' }}
                  size={16}
                  tintColor={colors.text.secondary}
                />
              </BouncyPressable>
            </View>
          </GlassicView>

          {/* رسالة توعوية */}
          <GlassicView cornerRadius={20} style={localStyles.securityNote}>
            <Text style={[textPresets.small, { color: colors.text.secondary }]}>
              {t('user_info.security_note')}
            </Text>
          </GlassicView>
        </View>
      </View>
    </Modal>
  );
};

const localStyles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 28,
    marginTop: 4,
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 64,
  },
  infoCard: {
    padding: 16,
    marginBottom: 16,
  },
  infoTextContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  infoVal: {
    fontSize: 14,
    fontWeight: '600',
  },
  securityNote: {
    padding: 16,
    marginTop: 8,
  },
});
