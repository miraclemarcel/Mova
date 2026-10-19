import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { FakeMap } from '@/components/FakeMap';
import { estimateFare, formatMoney } from '@/lib/format';
import { shadow } from '@/lib/shadow';
import { useBookingStore, useSelectedPayment, useSelectedRide } from '@/store/booking';

const MATCH_DELAY_MS = 3500;

export default function SearchingScreen() {
  const insets = useSafeAreaInsets();
  const pickup = useBookingStore((s) => s.pickup);
  const destination = useBookingStore((s) => s.destination);
  const assignDriver = useBookingStore((s) => s.assignDriver);
  const cancelRide = useBookingStore((s) => s.cancelRide);
  const ride = useSelectedRide();
  const payment = useSelectedPayment();

  // Simulated matching: a real app would subscribe to a dispatch event here.
  useEffect(() => {
    const id = setTimeout(() => {
      assignDriver();
      router.replace('/ride/trip');
    }, MATCH_DELAY_MS);
    return () => clearTimeout(id);
  }, [assignDriver]);

  // Rendering nothing avoids racing the cancel navigation once the store resets.
  if (!destination) return null;

  const onCancel = () => {
    cancelRide();
    router.dismissAll();
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-[1.1]">
        <FakeMap route pickupLabel={pickup.name} dropoffLabel={destination.name} />
        <View className="absolute inset-0 items-center justify-center">
          <Radar />
        </View>
      </View>

      <View className="-mt-6 rounded-t-[28px] bg-white px-5 pt-5" style={[shadow.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Text className="text-2xl font-extrabold text-ink">Finding your driver…</Text>
        <Text className="mt-1 text-base text-ink-600">Matching you with a nearby {ride.name}</Text>
        <ProgressBar />

        <View className="mt-5 gap-4 rounded-2xl bg-ink-50 p-4">
          <TripLine icon="circle-slice-8" label="Pickup" value={pickup.name} />
          <TripLine icon="square-rounded" label="Drop-off" value={destination.name} />
          <View className="flex-row items-center justify-between border-t border-ink-100 pt-3">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons name={payment.icon} size={20} color="#4B5160" />
              <Text className="text-sm text-ink-600">{payment.label}</Text>
            </View>
            <Text className="text-base font-bold text-ink">{formatMoney(estimateFare(ride, destination))}</Text>
          </View>
        </View>

        <Button title="Cancel request" variant="secondary" className="mt-5" onPress={onCancel} />
      </View>
    </View>
  );
}

function TripLine({ icon, label, value }: { icon: 'circle-slice-8' | 'square-rounded'; label: string; value: string }) {
  return (
    <View className="flex-row items-center gap-3">
      <MaterialCommunityIcons name={icon} size={14} color="#0B0D12" />
      <View className="flex-1">
        <Text className="text-xs text-ink-400">{label}</Text>
        <Text numberOfLines={1} className="text-base font-semibold text-ink">
          {value}
        </Text>
      </View>
    </View>
  );
}

function Radar() {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(pulse, { toValue: 1, duration: 2000, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const ring = (offset: number) => {
    const progress = Animated.modulo(Animated.add(pulse, offset), 1);
    return (
      <Animated.View
        style={{
          position: 'absolute',
          width: 220,
          height: 220,
          borderRadius: 110,
          backgroundColor: '#12B76A',
          opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0] }),
          transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }) }],
        }}
      />
    );
  };

  return (
    <View className="h-56 w-56 items-center justify-center">
      {ring(0)}
      {ring(0.5)}
      <View className="h-14 w-14 items-center justify-center rounded-full bg-ink" style={shadow.md}>
        <MaterialCommunityIcons name="car" size={28} color="#12B76A" />
      </View>
    </View>
  );
}

function ProgressBar() {
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, { toValue: 1, duration: MATCH_DELAY_MS, useNativeDriver: false }).start();
  }, [progress]);

  return (
    <View className="mt-4 h-1.5 overflow-hidden rounded-full bg-ink-100">
      <Animated.View
        style={{
          height: '100%',
          backgroundColor: '#12B76A',
          width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
        }}
      />
    </View>
  );
}
