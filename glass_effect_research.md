# iOS 26 Native Glass Effect - Research Report

## الخلاصة السريعة

هناك **3 طرق** للحصول على تأثير زجاجي في Expo:

| الطريقة | المصدر | Expo Go | iOS 26 فقط | النوع |
|---|---|---|---|---|
| **`expo-glass-effect`** | UIVisualEffectView + UIGlassEffect | YES | YES | Native real |
| `@expo/ui` glassEffect modifier | SwiftUI .glassEffect() | NO | YES | Native real |
| `expo-blur` BlurView | UIVisualEffectView (blur only) | YES | NO (جميع الإصدارات) | Native (لكن قديم) |

---

## الطريقة المثلى: `expo-glass-effect` (الرسمية من Expo SDK 56)

### لماذا هي الأفضل؟
- **رسمية من Expo** - موجودة في Expo SDK 56 كجزء من المكتبات الرسمية
- **Expo Go مدعوم** - تعمل مباشرة بدون Development Build
- **UIGlassEffect native** - تستخدم `UIVisualEffectView` + `UIGlassEffect` من iOS 26 مباشرة
- **Fallback تلقائي** - تتحول لـ `View` عادي على iOS < 26 وAndroid
- **API بسيطة** - لا تعقيد في الإعداد

### المصدر النظري
```
iOS 26 UIKit
└── UIVisualEffectView
    └── UIGlassEffect (جديد في iOS 26)
        ├── regular style - تأثير زجاجي عادي
        └── clear style - تأثير زجاجي شفاف أكثر
```

### التركيب

```bash
npx expo install expo-glass-effect
```

### API الكامل

```tsx
import {
  GlassView,
  GlassContainer,
  isLiquidGlassAvailable,
  isGlassEffectAPIAvailable,
} from 'expo-glass-effect';
```

#### GlassView Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `glassEffectStyle` | `'regular' \| 'clear' \| 'none' \| GlassEffectStyleConfig` | `'regular'` | نوع التأثير الزجاجي |
| `isInteractive` | `boolean` | `false` | تأثيرات اللمس والفيزياء |
| `tintColor` | `string` | - | لون طلاء على الزجاج |
| `colorScheme` | `'auto' \| 'light' \| 'dark'` | `'auto'` | تجاوز ثيم النظام |

#### GlassContainer Props
- `spacing`: المسافة التي تبدأ عندها العناصر تؤثر ببعضها (تدمج الحواف)

### مثال كامل

```tsx
import { GlassView, GlassContainer, isGlassEffectAPIAvailable } from 'expo-glass-effect';

// Check before using (important for iOS 26 beta devices)
const canUseGlass = isGlassEffectAPIAvailable();

// Simple usage - الاستخدام البسيط
<GlassView
  style={{ borderRadius: 24, padding: 16 }}
  glassEffectStyle="regular"
  isInteractive={false}
>
  <Text>Content</Text>
</GlassView>

// Combined glass elements (they merge at borders)
<GlassContainer spacing={10}>
  <GlassView style={{ width: 60, height: 60, borderRadius: 30 }} />
  <GlassView style={{ flex: 1, height: 60, borderRadius: 30 }} />
</GlassContainer>
```

### قيود مهمة

> **CRITICAL:** لا تضع `opacity: 0` على `GlassView` أو أي parent له - يوقف التأثير كليًا.

لتحريك الظهور/الإخفاء، استخدم:
```tsx
// الطريقة الصحيحة: تحريك عبر glassEffectStyle
<GlassView
  glassEffectStyle={{
    style: isVisible ? 'regular' : 'none',
    animate: true,
    animationDuration: 0.3,
  }}
/>
```

---

## الطريقة 2: `@expo/ui` SwiftUI glassEffect (Development Build فقط)

```tsx
import { Host, VStack } from '@expo/ui/swift-ui';
import { glassEffect } from '@expo/ui/swift-ui/modifiers';

// لا تعمل في Expo Go - تحتاج Development Build
<Host>
  <VStack modifiers={[glassEffect({ variant: 'regular', cornerRadius: 24 })]} />
</Host>
```

**المشكلة:** لا تعمل في Expo Go + تعقيد في Layout.

---

## الطريقة 3: `expo-blur` (للـ fallback فقط)

```tsx
import { BlurView } from 'expo-blur';

// يعمل على جميع الإصدارات لكن ليس iOS 26 Liquid Glass
<BlurView intensity={80} tint="systemMaterial">
  <Text>Content</Text>
</BlurView>
```

**متى تستخدمه:** iOS < 26 وAndroid كـ fallback.

---

## خطة التطبيق على مشروع Athar

### الهدف
استبدال `GlassicView` الحالية بـ `expo-glass-effect` + fallback بـ `expo-blur`.

### Architecture المقترحة

```
GlassicView.tsx (cross-platform)
├── iOS 26+ → expo-glass-effect GlassView (UIGlassEffect)
├── iOS < 26 → expo-blur BlurView (UIVisualEffectView blur)
└── Android → semi-transparent View (CSS fallback)
```

### الملفات المتأثرة
1. `src/components/GlassicView.ios.tsx` - استبدال كامل
2. `src/components/GlassicView.tsx` - استبدال كامل
3. `src/components/GlassicView.types.ts` - تحديث Props

### الأوامر للتركيب
```bash
cd mobile
npx expo install expo-glass-effect expo-blur
```
