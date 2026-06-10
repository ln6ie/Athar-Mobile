// تخطيط التبويبات لأنظمة أندرويد والويب شريط سفلي عائم مع زر الإضافة
import React from 'react';
import { Tabs } from 'expo-router';
import { FloatingTabBar } from '../../components/shared/FloatingTabBar';
import { useFeedStore } from '../../store/useFeedStore';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const { t } = useTranslation();
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
