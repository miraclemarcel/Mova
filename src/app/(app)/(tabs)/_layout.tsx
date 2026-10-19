import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { IconName } from '@/constants/data';

const tabIcon =
  (active: IconName, inactive: IconName) =>
  ({ color, focused }: { color: ColorValue; focused: boolean }) => (
    <MaterialCommunityIcons name={focused ? active : inactive} size={24} color={color as string} />
  );

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  // Gesture navigation reports little or no bottom inset, so keep a minimum gap from the screen edge.
  const bottomPadding = Math.max(insets.bottom, 14);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0B0D12',
        tabBarInactiveTintColor: '#8A909C',
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarStyle: {
          borderTopColor: '#EEF0F3',
          height: 62 + bottomPadding,
          paddingTop: 8,
          paddingBottom: bottomPadding,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: tabIcon('home', 'home-outline') }} />
      <Tabs.Screen
        name="activity"
        options={{ title: 'Activity', tabBarIcon: tabIcon('receipt-text', 'receipt-text-outline') }}
      />
      <Tabs.Screen
        name="account"
        options={{ title: 'Account', tabBarIcon: tabIcon('account-circle', 'account-circle-outline') }}
      />
    </Tabs>
  );
}
