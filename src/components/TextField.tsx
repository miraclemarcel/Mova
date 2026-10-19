import { useState } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

type Props = TextInputProps & { label?: string };

export function TextField({ label, className = '', onFocus, onBlur, ...props }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <View className="gap-2">
      {label && <Text className="text-sm font-medium text-ink-600">{label}</Text>}
      <TextInput
        placeholderTextColor="#8A909C"
        className={`h-14 rounded-2xl border px-4 text-base text-ink ${
          focused ? 'border-ink bg-white' : 'border-transparent bg-ink-50'
        } ${className}`}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
    </View>
  );
}
