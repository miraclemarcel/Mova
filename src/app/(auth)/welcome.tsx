import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { FakeMap } from '@/components/FakeMap';
import { Screen } from '@/components/Screen';

export default function WelcomeScreen() {
  return (
    <Screen edges={['bottom']}>
      <View className="flex-1">
        <FakeMap showCars />
        <View className="absolute inset-x-0 bottom-0 h-40 bg-white/80" />
      </View>

      <View className="gap-6 px-6 pt-6">
        <View className="flex-row items-center gap-2">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-ink">
            <MaterialCommunityIcons name="navigation-variant" size={22} color="#12B76A" />
          </View>
          <Text className="text-2xl font-extrabold tracking-tight text-ink">mova</Text>
        </View>

        <View className="gap-2">
          <Text className="text-4xl font-extrabold leading-tight text-ink">Go anywhere,{'\n'}in minutes.</Text>
          <Text className="text-base leading-6 text-ink-600">
            Request a ride, hop in, and relax. Safe, reliable trips at fair prices, any time of day.
          </Text>
        </View>

        <View className="gap-3">
          <Button title="Get started" onPress={() => router.push('/phone')} />
          <Text className="text-center text-xs leading-5 text-ink-400">
            By continuing you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>
      </View>
    </Screen>
  );
}
