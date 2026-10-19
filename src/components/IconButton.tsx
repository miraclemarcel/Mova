import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable } from 'react-native';

import type { IconName } from '@/constants/data';
import { shadow } from '@/lib/shadow';

type Props = {
  icon: IconName;
  onPress?: () => void;
  floating?: boolean;
  className?: string;
};

export function IconButton({ icon, onPress, floating, className = '' }: Props) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={floating ? shadow.md : undefined}
      className={`h-11 w-11 items-center justify-center rounded-full active:opacity-70 ${
        floating ? 'bg-white' : 'bg-ink-50'
      } ${className}`}
    >
      <MaterialCommunityIcons name={icon} size={22} color="#0B0D12" />
    </Pressable>
  );
}

export function BackButton({ floating, icon = 'arrow-left' }: { floating?: boolean; icon?: IconName }) {
  return <IconButton icon={icon} floating={floating} onPress={() => router.back()} />;
}
