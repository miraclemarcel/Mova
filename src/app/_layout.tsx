import '../global.css';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useState } from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AnimatedSplash } from '@/components/AnimatedSplash';
import { useAuthStore } from '@/store/auth';

// Keep the native splash up until the animated one has mounted and taken over.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isSignedIn = useAuthStore((s) => s.user !== null);
  const [splashDone, setSplashDone] = useState(false);
  const finishSplash = useCallback(() => setSplashDone(true), []);

  return (
    <SafeAreaProvider>
      {/*
        Transparent + translucent so the app always draws behind the status bar;
        each screen paints that area white (or ink, for the splash).
      */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={splashDone ? 'dark-content' : 'light-content'}
        animated
      />
      <View className="flex-1 bg-white">
        {hasHydrated && (
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#fff' } }}>
            <Stack.Protected guard={isSignedIn}>
              <Stack.Screen name="(app)" />
            </Stack.Protected>
            <Stack.Protected guard={!isSignedIn}>
              <Stack.Screen name="(auth)" />
            </Stack.Protected>
          </Stack>
        )}
        {!splashDone && <AnimatedSplash ready={hasHydrated} onFinish={finishSplash} />}
      </View>
    </SafeAreaProvider>
  );
}
