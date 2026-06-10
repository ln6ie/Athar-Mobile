# تطبيق أثر الوجداني (Athar Mobile)

تطبيق أثر هو منصة تواصل اجتماعي مجهولة الهوية بالكامل، تمكن المستخدمين من مشاركة مشاعرهم وأفكارهم و اراهم بحرية تامة ودون الكشف عن هوياتهم
---
mobile/src/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   └── (tabs)/
│       ├── _layout.ios.tsx
│       ├── _layout.tsx
│       ├── feed.tsx
│       └── profile.tsx
├── components/
│   ├── auth/
│   │   ├── EmailForm.tsx
│   │   └── OtpForm.tsx
│   ├── feed/
│   │   ├── BellIcon.tsx
│   │   ├── ConcaveHeaderEdge.tsx
│   │   ├── FeedTabsHeader.tsx
│   │   ├── PostActions.tsx
│   │   ├── PostCard.tsx
│   │   ├── PostCardSkeleton.tsx
│   │   ├── PostDetailSheet.tsx
│   │   └── PostModal.tsx
│   ├── profile/
│   │   ├── AboutSubScreen.tsx
│   │   ├── BlockedUsersSubScreen.tsx
│   │   ├── ChangeEmailSubScreen.tsx
│   │   ├── MyReportsSubScreen.tsx
│   │   ├── PrivacySubScreen.tsx
│   │   ├── ProfileHeaderCard.tsx
│   │   ├── ProfileOptionsCard.tsx
│   │   ├── SupportSubScreen.tsx
│   │   ├── ThemeSelector.tsx
│   │   ├── ThemeSubScreen.tsx
│   │   └── UserInfoModal.tsx
│   └── shared/
│       ├── AnonymousAvatar.tsx
│       ├── BouncyPressable.tsx
│       ├── EulaModal.tsx
│       ├── FloatingTabBar.tsx
│       ├── ForceUpdateModal.tsx
│       ├── GlassicView.ios.tsx
│       ├── GlassicView.tsx
│       ├── GlassicView.types.ts
│       ├── Header.tsx
│       ├── LikeButton.tsx
│       ├── Logo.tsx
│       ├── MemoryMonitor.tsx
│       ├── NativeContextMenu.tsx
│       ├── NotificationModal.tsx
│       ├── OfflineBanner.tsx
│       ├── Snackbar.tsx
│       ├── StateContainers.tsx
│       └── SymbolView.tsx
├── constants/
│   └── tokens.ts
├── hooks/
│   └── useTheme.ts
├── screens/
│   ├── FeedScreen.tsx
│   ├── IntroScreen.tsx
│   ├── LoginScreen.tsx
│   ├── NotificationsScreen.tsx
│   └── ProfileScreen.tsx
├── services/
│   ├── api.ts
│   └── encryption.ts
├── store/
│   ├── feedActions.ts
│   ├── feedStorage.ts
│   ├── userActions.ts
│   ├── useAuthStore.ts
│   ├── useConfigStore.ts
│   ├── useFeedStore.ts
│   ├── useThemeStore.ts
│   └── useToastStore.ts
├── styles/
│   ├── FeedStyles.ts
│   ├── ProfileStyles.ts
│   ├── SharedStyles.ts
│   ├── globalStyles.ts
│   ├── index.ts
│   └── styleUtils.ts
├── types/
│   ├── index.ts
│   └── schemas.ts
└── utils/
    ├── rtl.ts
    └── time.ts

## المزايا الرئيسية للتطبيق

* **مجهولية تامة**: لا نطلب أي معلومات شخصية تعريفية، وتظهر جميع المشاركات بأسماء مستعارة عشوائية.
* **واجهة مستخدم عصرية**: تصميم عصري بمظهر الداكن والفاتح 
* **مشاركة المشاعر اللحظية**: تصفح وتفاعل مع منشورات الآخرين

---

## التقنيات المستخدمة

* **Expo (React Native)** لتطوير تطبيق الهواتف (iOS & Android).
* **Zustand** لإدارة الحالة البرمجية.
* **React Native Reanimated** للحركات والتأثيرات.
* **Zod & Axios** للاتصال بالخادم والتحقق من البيانات.
