import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { BackButton } from '@/components/IconButton';
import { Screen } from '@/components/Screen';
import { COUNTRY_CODE, COUNTRY_FLAG } from '@/constants/data';
import { formatLocalNumber, isValidNigerianNumber, toLocalDigits } from '@/lib/format';
import { useAuthStore } from '@/store/auth';

export default function PhoneScreen() {
  const storedPhone = useAuthStore((s) => s.phone);
  const setPhone = useAuthStore((s) => s.setPhone);
  const sendCode = useAuthStore((s) => s.sendCode);
  const [digits, setDigits] = useState(() => (storedPhone.startsWith(COUNTRY_CODE) ? toLocalDigits(storedPhone) : ''));
  const [focused, setFocused] = useState(true);
  const [loading, setLoading] = useState(false);

  const valid = isValidNigerianNumber(digits);
  const showError = digits.length === 10 && !valid;

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
          <Text className="text-3xl font-extrabold text-ink">Enter your phone number</Text>
          <Text className="text-base leading-6 text-ink-600">
            We'll send a 4-digit code by SMS to confirm it's you. New here? This also creates your account.
          </Text>
        </View>

        <View className="gap-2">
          <View
            className={`h-16 flex-row items-center rounded-2xl border-2 ${
              showError ? 'border-red-400' : focused ? 'border-ink' : 'border-transparent bg-ink-50'
            }`}
          >
            <View className="h-full flex-row items-center gap-2 border-r border-ink-200 pl-4 pr-3">
              <Text className="text-2xl">{COUNTRY_FLAG}</Text>
              <Text className="text-lg font-semibold text-ink">{COUNTRY_CODE}</Text>
            </View>
            <TextInput
              autoFocus
              value={formatLocalNumber(digits)}
              onChangeText={(t) => setDigits(toLocalDigits(t))}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              autoComplete="tel"
              placeholder="803 123 4567"
              placeholderTextColor="#8A909C"
              maxLength={13}
              className="h-full flex-1 px-4 text-lg font-semibold tracking-wider text-ink"
            />
          </View>
          {showError ? (
            <Text className="text-sm text-red-600">Enter a valid Nigerian mobile number.</Text>
          ) : (
            <Text className="text-sm text-ink-400">Nigerian numbers only. You can leave out the first 0.</Text>
          )}
        </View>
      </View>

      <Button title="Continue" disabled={!valid} loading={loading} onPress={onContinue} />
    </Screen>
  );
}
