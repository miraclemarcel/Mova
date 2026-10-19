import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { FakeMap } from '@/components/FakeMap';
import { BackButton } from '@/components/IconButton';
import { RideOptionCard } from '@/components/RideOptionCard';
import { RIDE_OPTIONS } from '@/constants/data';
import { estimateTripMin } from '@/lib/format';
import { shadow } from '@/lib/shadow';
import { useBookingStore, useSelectedPayment, useSelectedRide } from '@/store/booking';

export default function SelectRideScreen() {
  const insets = useSafeAreaInsets();
  const pickup = useBookingStore((s) => s.pickup);
  const destination = useBookingStore((s) => s.destination);
  const rideId = useBookingStore((s) => s.rideId);
  const selectRide = useBookingStore((s) => s.selectRide);
  const requestRide = useBookingStore((s) => s.requestRide);
  const ride = useSelectedRide();
  const payment = useSelectedPayment();

  if (!destination) return <Redirect href="/" />;

  const onBook = () => {
    requestRide();
    router.replace('/ride/searching');
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-[0.8]">
        <FakeMap route pickupLabel={pickup.name} dropoffLabel={`${destination.name} · ${estimateTripMin(destination)} min`} />
        <View className="absolute left-5" style={{ top: 12 }}>
          <BackButton floating />
        </View>
      </View>

      <View className="-mt-6 flex-1 rounded-t-[28px] bg-white" style={[shadow.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View className="mb-1 mt-3 h-1 w-10 self-center rounded-full bg-ink-200" />
        <Text className="mb-2 text-center text-base font-bold text-ink">Choose a ride</Text>

        <ScrollView className="flex-1" contentContainerClassName="gap-1 px-3" showsVerticalScrollIndicator={false}>
          {RIDE_OPTIONS.map((option) => (
            <RideOptionCard
              key={option.id}
              option={option}
              destination={destination}
              selected={option.id === rideId}
              onPress={() => selectRide(option.id)}
            />
          ))}
        </ScrollView>

        <View className="gap-3 border-t border-ink-100 px-5 pt-3">
          <Pressable onPress={() => router.push('/payment')} className="flex-row items-center gap-3 active:opacity-60">
            <MaterialCommunityIcons name={payment.icon} size={22} color="#0B0D12" />
            <Text className="flex-1 text-base font-semibold text-ink">{payment.label}</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#8A909C" />
          </Pressable>
          <Button title={`Choose ${ride.name}`} onPress={onBook} />
        </View>
      </View>
    </View>
  );
}
