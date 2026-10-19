import { router } from 'expo-router';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { BackButton } from '@/components/IconButton';
import { Screen } from '@/components/Screen';
import { useAuthStore } from '@/store/auth';

const CODE_LENGTH = 4;
const RESEND_SECONDS = 30;

export default function VerifyScreen() {
  const phone = useAuthStore((s) => s.phone);
  const verifyCode = useAuthStore((s) => s.verifyCode);
  const sendCode = useAuthStore((s) => s.sendCode);
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  const submit = async (value: string) => {
    setLoading(true);
    setError('');
    const ok = await verifyCode(value);
    setLoading(false);
    if (ok) router.replace('/profile');
    else setError('That code is incorrect. Try again.');
  };

  const onChange = (text: string) => {
    const next = text.replace(/\D/g, '').slice(0, CODE_LENGTH);
    setCode(next);
    if (next.length === CODE_LENGTH) submit(next);
  };

  const resend = async () => {
    setCode('');
    setSecondsLeft(RESEND_SECONDS);
    await sendCode();
  };

  return (
    <Screen keyboard className="px-6">
      <View className="pt-2">
        <BackButton />
      </View>

      <View className="mt-6 flex-1 gap-8">
        <View className="gap-2">
          <Text className="text-3xl font-extrabold text-ink">Enter the code</Text>
          <Text className="text-base text-ink-600">
            Sent by SMS to <Text className="font-semibold text-ink">{phone}</Text>
          </Text>
        </View>

        <Pressable onPress={() => inputRef.current?.focus()} className="flex-row gap-3">
          {Array.from({ length: CODE_LENGTH }).map((_, i) => {
            const active = i === code.length;
            return (
              <View
                key={i}
                className={`h-16 flex-1 items-center justify-center rounded-2xl border-2 ${
                  error ? 'border-red-400 bg-red-50' : active ? 'border-ink bg-white' : 'border-transparent bg-ink-50'
                }`}
              >
                <Text className="text-2xl font-bold text-ink">{code[i] ?? ''}</Text>
              </View>
            );
          })}
        </Pressable>
        <TextInput
          ref={inputRef}
          autoFocus
          value={code}
          onChangeText={onChange}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          maxLength={CODE_LENGTH}
          className="absolute h-0 w-0 opacity-0"
        />

        {error ? <Text className="-mt-4 text-sm text-red-600">{error}</Text> : null}

        <View className="flex-row items-center">
          <Text className="text-sm text-ink-600">Didn't get it? </Text>
          {secondsLeft > 0 ? (
            <Text className="text-sm font-semibold text-ink-400">Resend in 0:{String(secondsLeft).padStart(2, '0')}</Text>
          ) : (
            <Pressable onPress={resend}>
              <Text className="text-sm font-semibold text-brand-600">Resend code</Text>
            </Pressable>
          )}
        </View>
      </View>

      <Button
        title="Verify"
        disabled={code.length < CODE_LENGTH}
        loading={loading}
        onPress={() => submit(code)}
      />
    </Screen>
  );
}
