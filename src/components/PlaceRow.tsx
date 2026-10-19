import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import type { IconName, Place } from '@/constants/data';

type Props = {
  place: Place;
  icon?: IconName;
  onPress?: () => void;
  showDistance?: boolean;
};

export function PlaceRow({ place, icon = 'map-marker-outline', onPress, showDistance }: Props) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center gap-4 py-3 active:opacity-60">
      <View className="h-11 w-11 items-center justify-center rounded-full bg-ink-100">
        <MaterialCommunityIcons name={icon} size={20} color="#1C1F26" />
      </View>
      <View className="flex-1 border-b border-ink-100 pb-3 pt-1">
        <Text numberOfLines={1} className="text-base font-semibold text-ink">
          {place.name}
        </Text>
        <Text numberOfLines={1} className="mt-0.5 text-sm text-ink-400">
          {place.address}
        </Text>
      </View>
      {showDistance && <Text className="text-sm text-ink-400">{place.distanceKm.toFixed(1)} km</Text>}
    </Pressable>
  );
}
