// app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)/index" options={{ title: 'Home' }} />
      <Stack.Screen name="DeviceToken" options={{ title: 'Device Token' }} />
    </Stack>
  );
}
