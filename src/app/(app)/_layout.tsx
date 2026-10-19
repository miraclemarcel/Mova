import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#fff' } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="search" options={{ animation: 'fade_from_bottom' }} />
      <Stack.Screen name="payment" options={{ presentation: 'modal' }} />
      <Stack.Screen name="ride/select" />
      <Stack.Screen name="ride/searching" options={{ gestureEnabled: false, animation: 'fade' }} />
      <Stack.Screen name="ride/trip" options={{ gestureEnabled: false, animation: 'fade' }} />
      <Stack.Screen name="ride/rate" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
