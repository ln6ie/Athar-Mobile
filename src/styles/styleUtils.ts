// أدوات أنماط مساعدة - ظلال وبطاقات زجاجية وحلقات ونصوص
import { StyleSheet, Platform } from 'react-native';
import { TOKENS, LIGHT_COLORS } from '../constants/tokens';

// إعدادات الظلال - درجات مختلفة حسب التباعد
export const shadows = StyleSheet.create({
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
});

// أنماط البطاقات الزجاجية - عادية ومضغوطة ومبسطة
export const glassCards = StyleSheet.create({
  default: {
    padding: 20,
    marginBottom: 16,
    borderWidth: 0.6,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  compact: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.6,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  padded: {
    padding: 18,
    marginBottom: 16,
    borderWidth: 0.6,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  info: {
    padding: 16,
    marginTop: 8,
  },
});

// مولد الحلقات المتداخلة - للوغو وشاشة البداية
export const createRings = (outerSize: number) => {
  const sizes = [outerSize, outerSize * 0.8, outerSize * 0.6, outerSize * 0.4];
  const opacities = [0.12, 0.35, 0.7, 1];
  return StyleSheet.create({
    ring3: {
      width: sizes[0], height: sizes[0], borderRadius: sizes[0] / 2,
      borderWidth: 1.5, justifyContent: 'center', alignItems: 'center',
      opacity: opacities[0], position: 'absolute',
    },
    ring2: {
      width: sizes[1], height: sizes[1], borderRadius: sizes[1] / 2,
      borderWidth: 1.5, justifyContent: 'center', alignItems: 'center',
      opacity: opacities[1], position: 'absolute',
    },
    ring1: {
      width: sizes[2], height: sizes[2], borderRadius: sizes[2] / 2,
      borderWidth: 1.5, justifyContent: 'center', alignItems: 'center',
      opacity: opacities[2], position: 'absolute',
    },
    core: {
      width: sizes[3], height: sizes[3], borderRadius: sizes[3] / 2,
      justifyContent: 'center', alignItems: 'center',
    },
  });
};

// أزرار الأيقونات - أحجام صغير ومتوسط وكبير
export const iconButtons = StyleSheet.create({
  sm: {
    width: 28, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  md: {
    width: 32, height: 32, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  lg: {
    width: 48, height: 48, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 6,
  },
});

// أحجام النصوص - من التسمية إلى العنوان
export const textPresets = StyleSheet.create({
  caption: {
    fontSize: 10, lineHeight: 14, textAlign: 'right',
  },
  small: {
    fontSize: 11, lineHeight: 18, textAlign: 'right',
  },
  body: {
    fontSize: 12, lineHeight: 20, textAlign: 'right',
  },
  bodyCentered: {
    fontSize: 12, lineHeight: 20, textAlign: 'center',
  },
  subtitle: {
    fontSize: 13, lineHeight: 20, textAlign: 'right',
  },
  title: {
    fontSize: 16, fontWeight: 'bold', lineHeight: 22, textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 14, fontWeight: 'bold', textAlign: 'right', marginBottom: 10, lineHeight: 20,
  },
  metaLabel: {
    fontSize: 11.5, textAlign: 'right',
  },
  metaValue: {
    fontSize: 11.5, fontWeight: '600', textAlign: 'left',
  },
});

// أنماط النماذج - حاويات وإدخالات وتسميات
export const formStyles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 0.6,
    borderRadius: TOKENS.borderRadius.full,
    paddingHorizontal: 16,
    fontSize: 13,
    textAlign: 'right',
    marginBottom: 20,
  },
  textArea: {
    height: 120,
    paddingTop: 12,
    paddingBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'right',
  },
});

// تخطيط الشيتات - المحتوى والمقبض والخلفية
export const sheetStyles = StyleSheet.create({
  content: {
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 32,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  dragHandle: {
    width: 40, height: 5, borderRadius: 2.5,
    alignSelf: 'center', marginBottom: 20,
  },
  header: {
    flexDirection: 'row-reverse', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  headerRight: {
    flexDirection: 'row-reverse', alignItems: 'center',
  },
  backdrop: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  actionsRow: {
    flexDirection: 'row-reverse', justifyContent: 'space-around',
    alignItems: 'center', marginTop: 4,
  },
  actionButton: {
    alignItems: 'center',
  },
});

// حالات الفراغ - أيقونات للحالات الفارغة
export const emptyStates = StyleSheet.create({
  iconContainer: {
    width: 96, height: 96, borderRadius: 48,
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  iconContainerSm: {
    width: 64, height: 64, borderRadius: 32,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
});

// صناديق المعلومات والاقتباسات
export const infoBoxes = StyleSheet.create({
  base: {
    borderWidth: 1, borderRadius: TOKENS.borderRadius.sm,
    padding: 16, marginBottom: 20,
  },
  quote: {
    padding: 12, borderRadius: 12, marginTop: 8, marginBottom: 8,
    alignItems: 'flex-end',
  },
});

// شارات التصنيف - خلفيات ونصوص
export const badges = StyleSheet.create({
  default: {
    flexDirection: 'row-reverse', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4,
  },
  text: {
    fontSize: 10, fontWeight: 'bold',
  },
});

// فاصل بين العناصر
export const divider = StyleSheet.create({
  default: {
    height: 1, marginBottom: 14,
  },
  subtle: {
    height: 0.5, width: '100%', marginVertical: 14,
  },
});

// تخطيطات الصفوف - عكسي ووسط وبين
export const rowLayouts = StyleSheet.create({
  reverse: {
    flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center',
  },
  center: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
  },
  between: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
});

// مواضع عائمة - الشريط المنبثق وزر الإضافة
export const floatingPositions = StyleSheet.create({
  snackbar: {
    position: 'absolute', bottom: Platform.OS === 'ios' ? 95 : 85,
    left: 24, right: 24, zIndex: 99999,
  },
  addButton: {
    position: 'absolute', right: 24, width: 60, height: 60,
    borderRadius: 30, zIndex: 999,
  },
  absoluteFill: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  },
});
