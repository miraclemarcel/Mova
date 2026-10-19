import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import type { IconName } from '@/constants/data';
import { initials } from '@/lib/format';
import { useAuthStore } from '@/store/auth';
import { useSelectedPayment } from '@/store/booking';

export default function AccountScreen() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const payment = useSelectedPayment();

  const rows: { icon: IconName; label: string; detail?: string; onPress?: () => void }[] = [
    { icon: 'wallet-outline', label: 'Payment', detail: payment.label, onPress: () => router.push('/payment') },
    { icon: 'map-marker-star-outline', label: 'Saved places' },
    { icon: 'ticket-percent-outline', label: 'Promotions', detail: '1 active' },
    { icon: 'shield-check-outline', label: 'Safety' },
    { icon: 'bell-outline', label: 'Notifications' },
    { icon: 'help-circle-outline', label: 'Help & support' },
  ];

  return (
    <Screen edges={['top']}>
      <ScrollView contentContainerClassName="px-5 pb-8">
        <Text className="mb-6 mt-4 text-3xl font-extrabold text-ink">Account</Text>

        <View className="flex-row items-center gap-4 rounded-3xl bg-ink-50 p-4">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-ink">
            <Text className="text-xl font-bold text-white">{initials(user?.firstName, user?.lastName)}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold text-ink">
              {user?.firstName} {user?.lastName}
            </Text>
            <Text className="text-sm text-ink-600">{user?.phone}</Text>
            {user?.email ? <Text className="text-sm text-ink-600">{user.email}</Text> : null}
          </View>
          <View className="flex-row items-center gap-1 rounded-full bg-white px-3 py-1.5">
            <MaterialCommunityIcons name="star" size={14} color="#F5B300" />
            <Text className="text-sm font-bold text-ink">4.9</Text>
          </View>
        </View>

        <View className="mt-6">
          {rows.map((row) => (
            <Pressable key={row.label} onPress={row.onPress} className="flex-row items-center gap-4 py-4 active:opacity-60">
              <MaterialCommunityIcons name={row.icon} size={24} color="#0B0D12" />
              <Text className="flex-1 text-base font-medium text-ink">{row.label}</Text>
              {row.detail && <Text className="text-sm text-ink-400">{row.detail}</Text>}
              <MaterialCommunityIcons name="chevron-right" size={22} color="#8A909C" />
            </Pressable>
          ))}
        </View>

        <Button title="Sign out" icon="logout" variant="danger" className="mt-6" onPress={signOut} />
      </ScrollView>
    </Screen>
  );
}
