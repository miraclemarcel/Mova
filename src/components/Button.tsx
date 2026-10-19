import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, Text } from 'react-native';

import type { IconName } from '@/constants/data';

type Variant = 'primary' | 'brand' | 'secondary' | 'outline' | 'danger';

const containerStyles: Record<Variant, string> = {
  primary: 'bg-ink',
  brand: 'bg-brand',
  secondary: 'bg-ink-100',
  outline: 'bg-white border border-ink-200',
  danger: 'bg-red-50',
};

const textStyles: Record<Variant, string> = {
  primary: 'text-white',
  brand: 'text-white',
  secondary: 'text-ink',
  outline: 'text-ink',
  danger: 'text-red-600',
};

const iconColors: Record<Variant, string> = {
  primary: '#fff',
  brand: '#fff',
  secondary: '#0B0D12',
  outline: '#0B0D12',
  danger: '#DC2626',
};

type Props = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

export function Button({ title, onPress, variant = 'primary', icon, loading, disabled, className = '' }: Props) {
  const inactive = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      className={`h-14 flex-row items-center justify-center gap-2 rounded-2xl px-5 active:opacity-80 ${containerStyles[variant]} ${
        disabled ? 'opacity-40' : ''
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={iconColors[variant]} />
      ) : (
        <>
          {icon && <MaterialCommunityIcons name={icon} size={20} color={iconColors[variant]} />}
          <Text className={`text-base font-semibold ${textStyles[variant]}`}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}
