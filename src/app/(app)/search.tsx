import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';

import { BackButton } from '@/components/IconButton';
import { PlaceRow } from '@/components/PlaceRow';
import { Screen } from '@/components/Screen';
import { PLACES, RECENT_PLACES, SAVED_PLACES, type IconName, type Place } from '@/constants/data';
import { useBookingStore } from '@/store/booking';

export default function SearchScreen() {
  const pickup = useBookingStore((s) => s.pickup);
  const setDestination = useBookingStore((s) => s.setDestination);
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...SAVED_PLACES, ...RECENT_PLACES];
    return PLACES.filter((p) => `${p.name} ${p.address}`.toLowerCase().includes(q));
  }, [query]);

  const choose = (place: Place) => {
    setDestination(place);
    router.replace('/ride/select');
  };

  const iconFor = (place: Place): IconName =>
    SAVED_PLACES.find((s) => s.id === place.id)?.icon ?? (query ? 'map-marker-outline' : 'history');

  return (
    <Screen keyboard edges={['top']}>
      <View className="flex-row items-center gap-3 px-5 pt-2">
        <BackButton icon="close" />
        <Text className="text-lg font-bold text-ink">Plan your ride</Text>
      </View>

      <View className="mx-5 mt-4 flex-row items-center gap-3">
        <View className="items-center py-5">
          <View className="h-2.5 w-2.5 rounded-full bg-ink" />
          <View className="my-1 h-10 w-0.5 bg-ink-200" />
          <View className="h-2.5 w-2.5 bg-ink" />
        </View>
        <View className="flex-1 gap-2">
          <View className="h-12 justify-center rounded-xl bg-ink-50 px-4">
            <Text numberOfLines={1} className="text-base text-ink">
              {pickup.name}
            </Text>
          </View>
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="Where to?"
            placeholderTextColor="#8A909C"
            returnKeyType="search"
            className="h-12 rounded-xl border border-ink bg-white px-4 text-base text-ink"
          />
        </View>
      </View>

      <FlatList
        className="mt-4"
        data={results}
        keyExtractor={(p) => p.id}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="px-5 pb-8"
        ListHeaderComponent={
          <Text className="mb-1 text-xs font-bold uppercase tracking-widest text-ink-400">
            {query ? 'Results' : 'Saved & recent'}
          </Text>
        }
        ListEmptyComponent={<Text className="py-8 text-center text-base text-ink-400">No places match “{query}”</Text>}
        renderItem={({ item }) => <PlaceRow place={item} icon={iconFor(item)} showDistance onPress={() => choose(item)} />}
      />
    </Screen>
  );
}
