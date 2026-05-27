import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator, 
  StyleSheet
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { GlassicView } from './GlassicView';
import Ionicons from '@expo/vector-icons/Ionicons';

interface PostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (content: string) => Promise<void>;
}

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
      // Autofocus input on open for instant typing
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
        style={[styles.container, { backgroundColor: colors.background.default }]}
      >
        {/* Sheet Top Header */}
        <View style={[styles.header, { 
          paddingTop: Math.max(insets.top, 16), 
          borderBottomColor: colors.border.muted 
        }]}>
          {/* Left Side: Publish button inside a glass capsule */}
          <View style={styles.leftSideContainer}>
            <GlassicView
              cornerRadius={18}
              style={[
                styles.publishGlassBtn,
                isPublishDisabled && styles.publishGlassBtnDisabled
              ]}
            >
              <TouchableOpacity 
                onPress={handlePublish}
                disabled={isPublishDisabled}
                style={styles.publishTapArea}
                activeOpacity={0.8}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={colors.brand.gold} />
                ) : (
                  <Text style={[
                    styles.publishButtonText, 
                    { color: colors.brand.gold },
                    isPublishDisabled && { color: colors.text.disabled }
                  ]}>نشر</Text>
                )}
              </TouchableOpacity>
            </GlassicView>
          </View>

          {/* Center: Title */}
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { color: colors.text.primary }]}> بوست جديد</Text>
          </View>

          {/* Right Side: Circular Glass Close X button */}
          <View style={styles.rightSideContainer}>
            <GlassicView
              cornerRadius={18}
              style={styles.closeIconButton}
            >
              <TouchableOpacity 
                onPress={onClose}
                style={styles.closeTapArea}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color={colors.brand.gold} />
              </TouchableOpacity>
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
        <View style={[styles.bottomBar, { 
          paddingBottom: Math.max(insets.bottom, 16),
          borderTopColor: colors.border.muted 
        }]}>
          <View style={styles.infoContainer}>
            <Text style={[styles.anonymousNote, { color: colors.text.disabled }]}>
              سينشر بحسابك مجهول الهوية بالكامل
            </Text>
            <Text style={[
              styles.counterText, 
              { color: content.length >= characterLimit - 20 ? colors.feedback.error : colors.text.disabled }
            ]}>
              {content.length} / {characterLimit}
            </Text>
          </View>
        </View>

        {validationError && (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.feedback.error }]}>{validationError}</Text>
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
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  leftSideContainer: {
    width: 70,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightSideContainer: {
    width: 70,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeTapArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  publishGlassBtn: {
    height: 36,
    minWidth: 64,
    borderRadius: 18,
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
    paddingHorizontal: 16,
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
    borderTopWidth: 1,
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
