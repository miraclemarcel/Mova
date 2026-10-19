import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { FakeMap, type DriverPosition } from '@/components/FakeMap';
import type { IconName } from '@/constants/data';
import { estimateFare, estimateTripMin, formatMoney, initials } from '@/lib/format';
import { shadow } from '@/lib/shadow';
import { useBookingStore, useSelectedPayment, useSelectedRide, type TripStatus } from '@/store/booking';

// How long each simulated stage lasts before advancing.
const STAGE_MS: Partial<Record<TripStatus, number>> = {
  arriving: 5000,
  arrived: 4000,
  in_progress: 6000,
};

const STEPS: TripStatus[] = ['arriving', 'arrived', 'in_progress'];

const DRIVER_AT: Partial<Record<TripStatus, DriverPosition>> = {
  arriving: 'approaching',
  arrived: 'pickup',
  in_progress: 'enRoute',
};

export default function TripScreen() {
  const insets = useSafeAreaInsets();
  const status = useBookingStore((s) => s.status);
  const driver = useBookingStore((s) => s.driver);
  const pickup = useBookingStore((s) => s.pickup);
  const destination = useBookingStore((s) => s.destination);
  const advanceTrip = useBookingStore((s) => s.advanceTrip);
  const cancelRide = useBookingStore((s) => s.cancelRide);
  const ride = useSelectedRide();
  const payment = useSelectedPayment();

  useEffect(() => {
    if (status === 'completed') {
      router.replace('/ride/rate');
      return;
    }
    const ms = STAGE_MS[status];
    if (!ms) return;
    const id = setTimeout(advanceTrip, ms);
    return () => clearTimeout(id);
  }, [status, advanceTrip]);

  // Rendering nothing avoids racing the cancel navigation once the store resets.
  if (!destination || !driver) return null;

  const arrivalTime = new Date(Date.now() + estimateTripMin(destination) * 60_000).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  const header = {
    arriving: { title: `Arriving in ${ride.etaMin} min`, subtitle: `${driver.name.split(' ')[0]} is on the way to you` },
    arrived: { title: 'Your driver is here', subtitle: `Meet at ${pickup.name}` },
    in_progress: { title: `Heading to ${destination.name}`, subtitle: `Arrive by ${arrivalTime}` },
  }[status as 'arriving' | 'arrived' | 'in_progress'] ?? { title: 'Wrapping up…', subtitle: '' };

  const onCancel = () => {
    cancelRide();
    router.dismissAll();
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-1">
        <FakeMap route pickupLabel={pickup.name} dropoffLabel={destination.name} driver={DRIVER_AT[status]} />
        <View className="absolute right-5 rounded-full bg-white px-3 py-2" style={[shadow.md, { top: 12 }]}>
          <View className="flex-row items-center gap-1.5">
            <MaterialCommunityIcons name="shield-check" size={16} color="#12B76A" />
            <Text className="text-xs font-semibold text-ink">Trip protected</Text>
          </View>
        </View>
      </View>

      <View className="-mt-6 rounded-t-[28px] bg-white px-5 pt-5" style={[shadow.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="text-2xl font-extrabold text-ink">{header.title}</Text>
            <Text className="mt-0.5 text-base text-ink-600">{header.subtitle}</Text>
          </View>
          {status === 'arrived' && (
            <View className="rounded-full bg-brand-50 px-3 py-1.5">
              <Text className="text-xs font-bold text-brand-700">PIN 4821</Text>
            </View>
          )}
        </View>

        <View className="mt-4 flex-row gap-1.5">
          {STEPS.map((step, i) => (
            <View
              key={step}
              className={`h-1.5 flex-1 rounded-full ${STEPS.indexOf(status) >= i ? 'bg-brand' : 'bg-ink-100'}`}
            />
          ))}
        </View>

        <View className="mt-5 flex-row items-center gap-4">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-ink-100">
            <Text className="text-lg font-bold text-ink">{initials(...(driver.name.split(' ') as [string, string]))}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-ink">{driver.name}</Text>
            <View className="flex-row items-center gap-1">
              <MaterialCommunityIcons name="star" size={14} color="#F5B300" />
              <Text className="text-sm text-ink-600">
                {driver.rating.toFixed(2)} · {driver.trips.toLocaleString()} trips
              </Text>
            </View>
          </View>
          <View className="items-end">
            <View className="rounded-lg border border-ink-200 bg-ink-50 px-2.5 py-1">
              <Text className="text-sm font-extrabold tracking-wider text-ink">{driver.plate}</Text>
            </View>
            <Text className="mt-1 text-xs text-ink-400">
              {driver.color} {driver.car}
            </Text>
          </View>
        </View>

        <View className="mt-5 flex-row gap-3">
          <Action icon="phone" label="Call" />
          <Action icon="message-text" label="Message" />
          <Action icon="share-variant" label="Share trip" />
          <Action icon="alarm-light-outline" label="Safety" />
        </View>

        <View className="mt-5 flex-row items-center justify-between rounded-2xl bg-ink-50 px-4 py-3">
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons name={payment.icon} size={20} color="#4B5160" />
            <Text className="text-sm text-ink-600">{payment.label}</Text>
          </View>
          <Text className="text-base font-bold text-ink">{formatMoney(estimateFare(ride, destination))}</Text>
        </View>

        {status !== 'in_progress' && (
          <Button title="Cancel ride" variant="danger" className="mt-4" onPress={onCancel} />
        )}
      </View>
    </View>
  );
}

function Action({ icon, label }: { icon: IconName; label: string }) {
  return (
    <Pressable className="flex-1 items-center gap-1.5 active:opacity-60">
      <View className="h-12 w-12 items-center justify-center rounded-full bg-ink-50">
        <MaterialCommunityIcons name={icon} size={22} color="#0B0D12" />
      </View>
      <Text className="text-xs font-medium text-ink-600">{label}</Text>
    </Pressable>
  );
}
