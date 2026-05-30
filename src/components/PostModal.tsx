import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { GlassicView } from './GlassicView';
import { BouncyPressable } from './BouncyPressable';
import { SymbolView } from './SymbolView';

interface PostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (content: string) => Promise<void>;
}

const OBJECTIONABLE_WORDS = [
  'كس', 'شرموط', 'منيوك', 'قحبة', 'نيك', 'ديوث', 'تيز', 'خرة', 'تف عليك',
  'fuck', 'shit', 'bitch', 'asshole', 'dick', 'pussy', 'whore', 'bastard'
];

export const PostModal: React.FC<PostModalProps> = ({ visible, onClose, onSubmit }) => {
  const { colors, isDark } = useTheme();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

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

  const handlePublish = async () => {
    const trimmed = content.trim();
    if (!trimmed) {
      setValidationError('لا يمكن نشر أثر فارغ');
      return;
    }
    if (trimmed.length > characterLimit) {
      setValidationError(`لا يمكن أن يتجاوز الأثر ${characterLimit} حرفاً`);
      return;
    }

    // Apple UGC Content Filtering check
    const hasObjectionable = OBJECTIONABLE_WORDS.some(word => 
      trimmed.toLowerCase().includes(word)
    );

    if (hasObjectionable) {
      setValidationError('عذراً، تم حظر النشر لاحتواء النص على كلمات غير لائقة. يلتزم تطبيق أثر بسياسة صارمة وخالية من التسامح تجاه الإساءة (Zero-Tolerance Policy) وفقاً لاتفاقية الاستخدام (EULA).');
      return;
    }

    setIsSubmitting(true);
    setValidationError(null);
    try {
      await onSubmit(trimmed);
      setContent('');
      onClose();
    } catch (err: any) {
      setValidationError(err.response?.data?.message || 'فشل النشر.');
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 48 : 0}
        style={[styles.container, { backgroundColor: colors.background.default }]}
      >
        {/* Sheet Top Header (Unified Premium Borderless RTL Design) */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 10) }]}>
          {/* Left Side: Circular Glass Close Button (Perfect for Arabic RTL) */}
          <View style={styles.leftContainer}>
            <GlassicView cornerRadius={14} style={styles.circularCloseButton}>
              <BouncyPressable
                onPress={onClose}
                style={styles.centerAll}
              >
                <SymbolView
                  name={{ ios: 'xmark', android: 'close' }}
                  size={11}
                  tintColor={colors.text.secondary}
                />
              </BouncyPressable>
            </GlassicView>
          </View>

          {/* Center: Title */}
          <View style={styles.titleContainer}>
            <Text style={[styles.titleText, { color: colors.text.primary }]}>بوست جديد</Text>
          </View>

          {/* Right Side: Publish Button in a Glass Capsule */}
          <View style={styles.rightContainer}>
            <GlassicView
              cornerRadius={18}
              style={[
                styles.publishGlassBtn,
                isPublishDisabled && styles.publishGlassBtnDisabled,
              ]}
            >
              <BouncyPressable
                onPress={handlePublish}
                disabled={isPublishDisabled}
                style={styles.publishTapArea}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={colors.brand.gold} />
                ) : (
                  <Text
                    style={[
                      styles.publishButtonText,
                      { color: colors.brand.gold },
                      isPublishDisabled && { color: colors.text.disabled },
                    ]}
                  >
                    نشر
                  </Text>
                )}
              </BouncyPressable>
            </GlassicView>
          </View>
        </View>

        {/* Input container */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            multiline
            placeholder="اكتب فكرتك هنا..."
            placeholderTextColor={colors.text.disabled}
            value={content}
            onChangeText={(txt) => {
              if (txt.length <= characterLimit) {
                setContent(txt);
                setValidationError(null);
              }
            }}
            textAlign="right"
            style={[styles.textInput, { color: colors.text.primary }]}
          />
        </View>

        {/* Bottom bar */}
        <View
          style={[
            styles.bottomBar,
            {
              paddingBottom: Math.max(insets.bottom, 16),
            },
          ]}
        >
          <View style={styles.infoContainer}>
            <Text style={[styles.anonymousNote, { color: colors.text.disabled }]}>
              سينشر بحسابك مجهول الهوية بالكامل
            </Text>
            <Text
              style={[
                styles.counterText,
                {
                  color:
                    content.length >= characterLimit - 20
                      ? colors.feedback.error
                      : colors.text.disabled,
                },
              ]}
            >
              {content.length} / {characterLimit}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 8,
    paddingTop: 4,
    borderBottomWidth: 0,
  },
  leftContainer: {
    width: 60,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightContainer: {
    width: 60,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  circularCloseButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerAll: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 22,
    textAlign: 'center',
  },
  publishGlassBtn: {
    height: 32,
    minWidth: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  publishGlassBtnDisabled: {
    opacity: 0.5,
  },
  publishTapArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  publishButtonText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  textInput: {
    width: '100%',
    height: '100%',
    fontSize: 16,
    textAlign: 'right',
    textAlignVertical: 'top',
    lineHeight: 24,
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingTop: 12,
    borderTopWidth: 0,
  },
  infoContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  anonymousNote: {
    fontSize: 11,
  },
  counterText: {
    fontSize: 11,
    fontWeight: '600',
  },
  errorContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  errorText: {
    fontSize: 12,
    textAlign: 'right',
    fontWeight: '600',
  },
});
