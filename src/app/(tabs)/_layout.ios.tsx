// تخطيط التبويبات لنظام iOS - شريط سفلي أيقونات مع علامات الإشعارات
import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { FloatingTabBar } from '../../components/shared/FloatingTabBar';
import { useFeedStore } from '../../store/useFeedStore';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { HomeIcon } from '../../components/shared/HomeIcon';

function DefaultTabLayout() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Tabs
      initialRouteName="feed"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand.gold as any,
        tabBarInactiveTintColor: colors.text.secondary as any,
        tabBarStyle: {
          backgroundColor: colors.background.default,
          borderTopColor: colors.border.muted,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile.title'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: t('home'),
          tabBarIcon: ({ color, size }) => (
            <HomeIcon size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  const { t } = useTranslation();

  const isPad = Platform.select({ ios: (Platform as any).isPad, default: false });
  if (isPad) {
    return <DefaultTabLayout />;
  }

  const { setPostModalOpen } = useFeedStore();

  return (
    <Tabs
      initialRouteName="feed"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ state, navigation }) => {
        const activeTab = state.routes[state.index].name as 'feed' | 'profile';
        const handleChangeTab = (tab: 'feed' | 'profile') => {
          navigation.navigate(tab);
        };
        const handleAddPress = () => {
          setPostModalOpen(true);
        };

        return (
          <FloatingTabBar
            activeTab={activeTab}
            onChangeTab={handleChangeTab}
            onAddPress={handleAddPress}
          />
        );
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile.title'),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: t('home'),
        }}
      />
    </Tabs>
  );
}
