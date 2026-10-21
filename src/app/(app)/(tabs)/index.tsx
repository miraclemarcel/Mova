import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FakeMap } from '@/components/FakeMap';
import { IconButton } from '@/components/IconButton';
import { PlaceRow } from '@/components/PlaceRow';
import { RECENT_PLACES, SAVED_PLACES, type Place } from '@/constants/data';
import { shadow } from '@/lib/shadow';
import { useAuthStore } from '@/store/auth';
import { useBookingStore } from '@/store/booking';
 
const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const firstName = useAuthStore((s) => s.user?.firstName);
  const pickup = useBookingStore((s) => s.pickup);
  const setDestination = useBookingStore((s) => s.setDestination);

  const bookTo = (place: Place) => {
    setDestination(place);
    router.push('/ride/select');
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-[0.9]">
        <FakeMap showCars />
        <View className="absolute inset-x-0 flex-row items-center justify-between px-5" style={{ top: insets.top + 12 }}>
          <IconButton icon="menu" floating onPress={() => router.push('/account')} />
          <View className="flex-row items-center gap-2 rounded-full bg-white px-4 py-2.5" style={shadow.md}>
            <View className="h-2 w-2 rounded-full bg-brand" />
            <Text numberOfLines={1} className="max-w-[180px] text-sm font-semibold text-ink">
              {pickup.address}
            </Text>
          </View>
          <IconButton icon="bell-outline" floating />
        </View>
      </View>

      <View className="-mt-8 flex-1 rounded-t-[28px] bg-white" style={shadow.sheet}>
        <ScrollView contentContainerClassName="px-5 pb-6 pt-3" showsVerticalScrollIndicator={false}>
          <View className="mb-4 h-1 w-10 self-center rounded-full bg-ink-200" />
          <Text className="text-2xl font-extrabold text-ink">
            {greeting()}
            {firstName ? `, ${firstName}` : ''}
          </Text>

          <Pressable
            onPress={() => router.push('/search')}
            className="mt-4 h-14 flex-row items-center gap-3 rounded-2xl bg-ink-50 px-4 active:opacity-70"
          >
            <MaterialCommunityIcons name="magnify" size={24} color="#0B0D12" />
            <Text className="flex-1 text-lg font-semibold text-ink-600">Where to?</Text>
            <View className="flex-row items-center gap-1 rounded-full bg-white px-3 py-1.5">
              <MaterialCommunityIcons name="clock-outline" size={16} color="#0B0D12" />
              <Text className="text-sm font-semibold text-ink">Now</Text>
            </View>
          </Pressable>

          <View className="mt-4 flex-row gap-3">
            {SAVED_PLACES.map((place) => (
              <Pressable
                key={place.id}
                onPress={() => bookTo(place)}
                className="flex-1 flex-row items-center gap-3 rounded-2xl border border-ink-100 p-3 active:opacity-70"
              >
                <View className="h-9 w-9 items-center justify-center rounded-full bg-ink-100">
                  <MaterialCommunityIcons name={place.icon} size={18} color="#0B0D12" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-ink">{place.name}</Text>
                  <Text numberOfLines={1} className="text-xs text-ink-400">
                    {place.address}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          <View className="mt-4 flex-row items-center gap-4 overflow-hidden rounded-2xl bg-ink p-4">
            <View className="flex-1 gap-1">
              <Text className="text-xs font-bold uppercase tracking-widest text-brand">Limited offer</Text>
              <Text className="text-base font-bold text-white">20% off your next 3 rides</Text>
              <Text className="text-xs text-ink-200">Applied automatically at checkout</Text>
            </View>
            <MaterialCommunityIcons name="ticket-percent" size={44} color="#12B76A" />
          </View>

          <Text className="mb-1 mt-6 text-base font-bold text-ink">Recent</Text>
          {RECENT_PLACES.map((place) => (
            <PlaceRow key={place.id} place={place} icon="history" onPress={() => bookTo(place)} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
