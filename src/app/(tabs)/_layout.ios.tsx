import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  // Pass dynamic screen options and background blurs directly to the native tab host
  const tabsProps = {
    initialRouteName: 'feed', // Home feed is always loaded first when the app opens!
    screenOptions: {
      backgroundBlurEffect: 'systemChromeMaterialDark',
      headerShown: false,
    },
  } as any;

  return (
    <NativeTabs {...tabsProps}>
      <NativeTabs.Trigger name="profile">
        <Icon sf="person.crop.circle.fill" />
        <Label>الملف الشخصي</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="feed">
        <Icon sf="house.fill" />
        <Label>الرئيسية</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
