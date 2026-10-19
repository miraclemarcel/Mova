import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { useAuthStore } from '@/store/auth';

export default function ProfileSetupScreen() {
  const completeProfile = useAuthStore((s) => s.completeProfile);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const valid = firstName.trim().length > 0 && lastName.trim().length > 0;

  // Setting the user flips the auth guard in the root layout, which routes into the app.
  const onSubmit = () =>
    completeProfile({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() });

  return (
    <Screen keyboard className="px-6">
      <ScrollView className="flex-1" contentContainerClassName="gap-6 pt-14" keyboardShouldPersistTaps="handled">
        <View className="gap-2">
          <Text className="text-3xl font-extrabold text-ink">Tell us about you</Text>
          <Text className="text-base text-ink-600">Drivers will see your first name when you ride.</Text>
        </View>

        <View className="gap-4">
          <TextField label="First name" value={firstName} onChangeText={setFirstName} placeholder="Jane" autoFocus />
          <TextField label="Last name" value={lastName} onChangeText={setLastName} placeholder="Doe" />
          <TextField
            label="Email (optional)"
            value={email}
            onChangeText={setEmail}
            placeholder="jane@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </ScrollView>

      <Button title="Finish sign up" disabled={!valid} onPress={onSubmit} />
    </Screen>
  );
}
