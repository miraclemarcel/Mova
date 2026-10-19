import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { RIDE_OPTIONS } from '@/constants/data';
import { estimateFare, formatMoney, initials } from '@/lib/format';
import { useBookingStore } from '@/store/booking';

const TIPS = [0, 1, 2, 5];
const COMPLIMENTS = ['Great driving', 'Clean car', 'Friendly', 'Good music', 'Knew the route'];

export default function RateScreen() {
  // Snapshot the trip so the summary stays put while finishTrip resets the store.
  const [trip] = useState(() => useBookingStore.getState());
  const finishTrip = useBookingStore((s) => s.finishTrip);
  const [rating, setRating] = useState(0);
  const [tip, setTip] = useState(0);
  const [tags, setTags] = useState<string[]>([]);

  const { destination, driver, pickup, rideId } = trip;
  const ride = RIDE_OPTIONS.find((r) => r.id === rideId);
  if (!destination || !ride) return <Redirect href="/" />;

  const fare = estimateFare(ride, destination);
  const toggleTag = (tag: string) =>
    setTags((t) => (t.includes(tag) ? t.filter((x) => x !== tag) : [...t, tag]));

  const onDone = () => {
    finishTrip(rating || null, tip);
    router.dismissAll();
  };

  return (
    <Screen>
      <ScrollView contentContainerClassName="px-5 pb-6 pt-6">
        <View className="items-center">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-brand-50">
            <MaterialCommunityIcons name="check-circle" size={40} color="#12B76A" />
          </View>
          <Text className="mt-3 text-2xl font-extrabold text-ink">You've arrived!</Text>
          <Text className="mt-1 text-base text-ink-600">{destination.name}</Text>
        </View>

        <View className="mt-6 gap-3 rounded-2xl bg-ink-50 p-4">
          <Row label={`${ride.name} fare`} value={formatMoney(fare)} />
          <Row label="Tip" value={formatMoney(tip)} />
          <View className="h-px bg-ink-200" />
          <Row label="Total" value={formatMoney(fare + tip)} bold />
          <Text className="text-xs text-ink-400">
            {pickup.name} → {destination.name}
          </Text>
        </View>

        <View className="mt-6 items-center">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-ink">
            <Text className="text-lg font-bold text-white">
              {driver ? initials(...(driver.name.split(' ') as [string, string])) : '?'}
            </Text>
          </View>
          <Text className="mt-2 text-lg font-bold text-ink">How was your trip with {driver?.name.split(' ')[0] ?? 'your driver'}?</Text>
          <View className="mt-3 flex-row gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable key={n} onPress={() => setRating(n)} hitSlop={4}>
                <MaterialCommunityIcons name={n <= rating ? 'star' : 'star-outline'} size={40} color={n <= rating ? '#F5B300' : '#C9CDD4'} />
              </Pressable>
            ))}
          </View>
        </View>

        {rating >= 4 && (
          <View className="mt-5 flex-row flex-wrap justify-center gap-2">
            {COMPLIMENTS.map((tag) => {
              const on = tags.includes(tag);
              return (
                <Pressable
                  key={tag}
                  onPress={() => toggleTag(tag)}
                  className={`rounded-full border px-3.5 py-2 ${on ? 'border-ink bg-ink' : 'border-ink-200 bg-white'}`}
                >
                  <Text className={`text-sm font-medium ${on ? 'text-white' : 'text-ink'}`}>{tag}</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <Text className="mb-3 mt-6 text-base font-bold text-ink">Add a tip</Text>
        <View className="flex-row gap-3">
          {TIPS.map((amount) => (
            <Pressable
              key={amount}
              onPress={() => setTip(amount)}
              className={`h-12 flex-1 items-center justify-center rounded-xl border-2 ${
                tip === amount ? 'border-ink bg-white' : 'border-transparent bg-ink-50'
              }`}
            >
              <Text className="text-base font-semibold text-ink">{amount === 0 ? 'None' : formatMoney(amount)}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View className="px-5">
        <Button title={rating ? 'Submit' : 'Skip'} variant={rating ? 'primary' : 'secondary'} onPress={onDone} />
      </View>
    </Screen>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View className="flex-row justify-between">
      <Text className={`text-base ${bold ? 'font-bold text-ink' : 'text-ink-600'}`}>{label}</Text>
      <Text className={`text-base ${bold ? 'font-bold text-ink' : 'text-ink'}`}>{value}</Text>
    </View>
  );
}
