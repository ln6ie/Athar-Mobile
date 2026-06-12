import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Header } from '../shared/Header';
import { useTranslation } from 'react-i18next';
import i18n from '../../constants/locales';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { BouncyPressable } from '../shared/BouncyPressable';
import { SymbolView } from '../shared/SymbolView';
import { isArabicText } from '../../utils/rtl';

interface PostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (content: string) => Promise<void>;
}

// قائمة الكلمات المحظورة - فلترة المحتوى قبل النشر
const OBJECTIONABLE_WORDS = [
  'كس', 'شرموط', 'منيوك', 'قحبة', 'نيك', 'ديوث', 'تيز', 'خرة', 'تف عليك',
  'fuck', 'shit', 'bitch', 'asshole', 'dick', 'pussy', 'whore', 'bastard'
];

// نموذج إنشاء بوست جديد - إدخال النص مع عداد الأحرف وفلترة المحتوى
export const PostModal: React.FC<PostModalProps> = ({ visible, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const layoutArabic = i18n.language?.startsWith('ar') ?? false;
  const textArabic = isArabicText(content) || (layoutArabic && !content);
  const characterLimit = 300;

  useEffect(() => {
    if (visible) {
      setContent('');
      setValidationError(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [visible]);

  // نشر البوست بعد التحقق من الصلاحية
  const handlePublish = async () => {
    const trimmed = content.trim();
    if (!trimmed) {
      setValidationError(t('feed.empty_error'));
      return;
    }
    if (trimmed.length > characterLimit) {
      setValidationError(t('feed.char_limit', { limit: characterLimit }));
      return;
    }

    const hasObjectionable = OBJECTIONABLE_WORDS.some(word =>
      trimmed.toLowerCase().includes(word)
    );

    if (hasObjectionable) {
      setValidationError(t('feed.blocked_content'));
      return;
    }

    setIsSubmitting(true);
    setValidationError(null);
    try {
      await onSubmit(trimmed);
      setContent('');
      onClose();
    } catch (err: any) {
      setValidationError(err.response?.data?.message || t('feed.publish_failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPublishDisabled = isSubmitting || !content.trim();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 48 : 0}
        style={[styles.container, { backgroundColor: colors.background.default }]}
      >
        {/* الشريط العلوي الموحد مع هوامش الأمان */}
        <Header
          title={t('feed.new_post')}
          leftText={t('common.back')}
          onLeftPress={onClose}
        />

        {/* منطقة الإدخال */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            multiline
            placeholder={t('feed.placeholder')}
            placeholderTextColor={colors.text.disabled}
            value={content}
            onChangeText={(txt) => {
              if (txt.length <= characterLimit) {
                setContent(txt);
                setValidationError(null);
              }
            }}
            style={[styles.textInput, { color: colors.text.primary, textAlign: textArabic ? 'right' : 'left' }]}
          />
        </View>

        {/* الشريط السفلي */}
        <View style={[styles.bottomBar, { flexDirection: layoutArabic ? 'row-reverse' : 'row', paddingBottom: Math.max(insets.bottom, 16) }]}>
          {/* زر النشر - الجانب الأيسر */}
          <View style={styles.bottomBarLeft}>
            <BouncyPressable
              onPress={handlePublish}
              disabled={isPublishDisabled}
              style={[
                styles.publishButton,
                { backgroundColor: isPublishDisabled ? colors.text.disabled : colors.brand.gold },
              ]}
            >
              <SymbolView
                name={{ ios: 'arrow.up', android: 'send' }}
                size={20}
                tintColor="#FFFFFF"
              />
            </BouncyPressable>
          </View>

          {/* الوسط: ملاحظة النشر المجهول */}
          <View style={styles.bottomBarCenter}>
            <Text style={[styles.anonymousNote, { color: colors.text.disabled }]}>
              {t('feed.anonymous_note')}
            </Text>
          </View>

          {/* اليمين: عداد الأحرف */}
          <View style={styles.bottomBarRight}>
            <Text
              style={[
                styles.counterText,
                {
                  color: content.length >= characterLimit - 20
                    ? colors.feedback.error
                    : colors.text.disabled,
                },
              ]}
            >
              {content.length}/{characterLimit}
            </Text>
          </View>
        </View>

        {validationError && (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.feedback.error }]}>
              {validationError}
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  topBarRight: {
    width: 40,
    alignItems: 'flex-start',
  },
  topBarCenter: {
    flex: 1,
    alignItems: 'center',
  },
  topBarLeft: {
    width: 40,
  },
  topBarTitle: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  textInput: {
    width: '100%',
    height: '100%',
    fontSize: 16,
    textAlignVertical: 'top',
    lineHeight: 24,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(128, 128, 128, 0.15)',
  },
  bottomBarLeft: {
    width: 48,
    alignItems: 'flex-start',
  },
  bottomBarCenter: {
    flex: 1,
    alignItems: 'center',
  },
  bottomBarRight: {
    width: 60,
    alignItems: 'flex-end',
  },
  publishButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  anonymousNote: {
    fontSize: 11,
    textAlign: 'center',
  },
  counterText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'right',
  },
  errorContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  errorText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 18,
  },
});
