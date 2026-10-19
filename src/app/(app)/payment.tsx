import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { BackButton } from '@/components/IconButton';
import { Screen } from '@/components/Screen';
import { PAYMENT_METHODS } from '@/constants/data';
import { useBookingStore } from '@/store/booking';

export default function PaymentScreen() {
  const paymentId = useBookingStore((s) => s.paymentId);
  const selectPayment = useBookingStore((s) => s.selectPayment);

  return (
    <Screen className="px-5">
      <View className="flex-row items-center gap-3 pt-2">
        <BackButton icon="close" />
        <Text className="text-lg font-bold text-ink">Payment method</Text>
      </View>

      <View className="mt-6 flex-1 gap-3">
        {PAYMENT_METHODS.map((method) => {
          const selected = method.id === paymentId;
          return (
            <Pressable
              key={method.id}
              onPress={() => selectPayment(method.id)}
              className={`flex-row items-center gap-4 rounded-2xl border-2 p-4 ${
                selected ? 'border-ink' : 'border-ink-100'
              }`}
            >
              <View className="h-11 w-11 items-center justify-center rounded-xl bg-ink-50">
                <MaterialCommunityIcons name={method.icon} size={24} color="#0B0D12" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-ink">{method.label}</Text>
                <Text className="text-sm text-ink-400">{method.detail}</Text>
              </View>
              <MaterialCommunityIcons
                name={selected ? 'radiobox-marked' : 'radiobox-blank'}
                size={24}
                color={selected ? '#0B0D12' : '#C9CDD4'}
              />
            </Pressable>
          );
        })}

        <Pressable className="flex-row items-center gap-4 rounded-2xl border-2 border-dashed border-ink-200 p-4 active:opacity-60">
          <View className="h-11 w-11 items-center justify-center rounded-xl bg-ink-50">
            <MaterialCommunityIcons name="plus" size={24} color="#0B0D12" />
          </View>
          <Text className="text-base font-semibold text-ink">Add debit or credit card</Text>
        </Pressable>
      </View>

      <Button title="Done" onPress={() => router.back()} />
    </Screen>
  );
}
