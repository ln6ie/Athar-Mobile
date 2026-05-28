import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  // Pass dynamic screen options and background blurs directly to the native tab host
  const tabsProps = {
    screenOptions: {
      backgroundBlurEffect: 'systemChromeMaterialDark',
      headerShown: false,
    },
  } as any;

  return (
    <NativeTabs {...tabsProps}>
      <NativeTabs.Trigger name="feed">
        <Icon sf="clock.fill" />
        <Label>الحديثة</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Icon sf="flame.fill" />
        <Label>الرائجة</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
