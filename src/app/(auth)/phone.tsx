import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { BackButton } from '@/components/IconButton';
import { Screen } from '@/components/Screen';
import { COUNTRY_CODE, COUNTRY_FLAG } from '@/constants/data';
import { useAuthStore } from '@/store/auth';

const MIN_DIGITS = 10;

export default function PhoneScreen() {
  const storedPhone = useAuthStore((s) => s.phone);
  const setPhone = useAuthStore((s) => s.setPhone);
  const sendCode = useAuthStore((s) => s.sendCode);
  const [digits, setDigits] = useState(storedPhone.replace(COUNTRY_CODE, ''));
  const [loading, setLoading] = useState(false);

  const valid = digits.length >= MIN_DIGITS;

  const onContinue = async () => {
    setLoading(true);
    setPhone(`${COUNTRY_CODE}${digits}`);
    await sendCode();
    setLoading(false);
    router.push('/verify');
  };

  return (
    <Screen keyboard className="px-6">
      <View className="pt-2">
        <BackButton />
      </View>

      <View className="mt-6 flex-1 gap-6">
        <View className="gap-2">
          <Text className="text-3xl font-extrabold text-ink">What's your number?</Text>
          <Text className="text-base text-ink-600">We'll text you a code to verify your phone.</Text>
        </View>

        <View className="flex-row gap-3">
          <Pressable className="h-14 flex-row items-center gap-2 rounded-2xl bg-ink-50 px-4">
            <Text className="text-lg">{COUNTRY_FLAG}</Text>
            <Text className="text-base font-semibold text-ink">{COUNTRY_CODE}</Text>
            <MaterialCommunityIcons name="chevron-down" size={18} color="#4B5160" />
          </Pressable>
          <TextInput
            autoFocus
            value={digits}
            onChangeText={(t) => setDigits(t.replace(/\D/g, '').slice(0, 11))}
            keyboardType="phone-pad"
            placeholder="Phone number"
            placeholderTextColor="#8A909C"
            className="h-14 flex-1 rounded-2xl border border-ink bg-white px-4 text-lg font-semibold tracking-wider text-ink"
          />
        </View>

        <View className="flex-row items-center gap-3">
          <View className="h-px flex-1 bg-ink-100" />
          <Text className="text-sm text-ink-400">or</Text>
          <View className="h-px flex-1 bg-ink-100" />
        </View>

        <View className="gap-3">
          <Button title="Continue with Google" icon="google" variant="outline" />
          <Button title="Continue with Apple" icon="apple" variant="outline" />
        </View>
      </View>

      <Button title="Continue" disabled={!valid} loading={loading} onPress={onContinue} />
    </Screen>
  );
}
