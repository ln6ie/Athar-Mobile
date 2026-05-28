import React from 'react';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  // Bypassing experimental type restrictions to feed iOS UIVisualEffectView configs
  const tabsProps = {
    screenOptions: {
      backgroundBlurEffect: 'systemChromeMaterialDark',
      headerShown: false,
    },
  } as any;

  return (
    <NativeTabs {...tabsProps}>
      <NativeTabs.Trigger name="feed">
        <NativeTabs.Trigger.Icon sf="clock.fill" />
        <NativeTabs.Trigger.Label>الحديثة</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon sf="flame.fill" />
        <NativeTabs.Trigger.Label>الرائجة</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
