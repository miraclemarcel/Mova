import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import type { Place, RideOption } from '@/constants/data';
import { estimateFare, formatMoney } from '@/lib/format';

type Props = {
  option: RideOption;
  destination: Place;
  selected: boolean;
  onPress: () => void;
};

export function RideOptionCard({ option, destination, selected, onPress }: Props) {
  const arrival = new Date(Date.now() + option.etaMin * 60_000).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-4 rounded-2xl border-2 px-3 py-3 ${
        selected ? 'border-ink bg-white' : 'border-transparent'
      }`}
    >
      <View className="h-14 w-16 items-center justify-center rounded-xl bg-ink-50">
        <MaterialCommunityIcons name={option.icon} size={34} color="#0B0D12" />
      </View>
      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <Text className="text-base font-bold text-ink">{option.name}</Text>
          <View className="flex-row items-center gap-0.5">
            <MaterialCommunityIcons name="account" size={14} color="#4B5160" />
            <Text className="text-xs text-ink-600">{option.seats}</Text>
          </View>
        </View>
        <Text className="text-sm text-ink-400">
          {arrival} · {option.etaMin} min away
        </Text>
        {selected && <Text className="mt-0.5 text-xs text-ink-600">{option.description}</Text>}
      </View>
      <Text className="text-base font-bold text-ink">{formatMoney(estimateFare(option, destination))}</Text>
    </Pressable>
  );
}
