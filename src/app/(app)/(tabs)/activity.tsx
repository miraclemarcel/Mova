import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { RIDE_OPTIONS } from '@/constants/data';
import { formatMoney } from '@/lib/format';
import { useBookingStore, type Trip } from '@/store/booking';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) +
  ' · ' +
  new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

export default function ActivityScreen() {
  const history = useBookingStore((s) => s.history);

  return (
    <Screen edges={['top']}>
      <FlatList
        data={history}
        keyExtractor={(t) => t.id}
        contentContainerClassName="gap-3 px-5 pb-6"
        ListHeaderComponent={<Text className="mb-2 mt-4 text-3xl font-extrabold text-ink">Activity</Text>}
        ListEmptyComponent={
          <View className="items-center gap-2 pt-20">
            <MaterialCommunityIcons name="car-clock" size={48} color="#C9CDD4" />
            <Text className="text-base text-ink-400">No trips yet</Text>
          </View>
        }
        renderItem={({ item }) => <TripCard trip={item} />}
      />
    </Screen>
  );
}

function TripCard({ trip }: { trip: Trip }) {
  const ride = RIDE_OPTIONS.find((r) => r.id === trip.rideId);
  const cancelled = trip.status === 'cancelled';

  return (
    <View className="gap-3 rounded-2xl border border-ink-100 p-4">
      <View className="flex-row items-start gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-xl bg-ink-50">
          <MaterialCommunityIcons name={ride?.icon ?? 'car'} size={28} color="#0B0D12" />
        </View>
        <View className="flex-1">
          <Text numberOfLines={1} className="text-base font-bold text-ink">
            {trip.destination.name}
          </Text>
          <Text className="text-sm text-ink-400">{formatDate(trip.date)}</Text>
        </View>
        <Text className={`text-base font-bold ${cancelled ? 'text-ink-400' : 'text-ink'}`}>
          {formatMoney(trip.fare)}
        </Text>
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-sm text-ink-600">
          {ride?.name} · {trip.driverName}
        </Text>
        {cancelled ? (
          <View className="rounded-full bg-red-50 px-2.5 py-1">
            <Text className="text-xs font-semibold text-red-600">Cancelled</Text>
          </View>
        ) : (
          <View className="flex-row items-center gap-1">
            {trip.rating ? (
              <>
                <MaterialCommunityIcons name="star" size={14} color="#F5B300" />
                <Text className="text-xs font-semibold text-ink-600">{trip.rating}.0</Text>
              </>
            ) : (
              <Text className="text-xs font-semibold text-brand-600">Completed</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
