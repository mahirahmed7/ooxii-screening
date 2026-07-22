import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/components/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.ink,
          headerTitleStyle: { fontWeight: '800' },
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'OOXii Screen' }} />
        <Stack.Screen name="profile" options={{ title: 'Profile' }} />
        <Stack.Screen name="calibration" options={{ title: 'Calibration' }} />
        <Stack.Screen name="screening/new" options={{ title: 'New screening' }} />
        <Stack.Screen
          name="screening/[id]/distance"
          options={{ title: 'Distance vision', headerBackVisible: false }}
        />
        <Stack.Screen
          name="screening/[id]/near"
          options={{ title: 'Near vision', headerBackVisible: false }}
        />
        <Stack.Screen
          name="screening/[id]/paddle"
          options={{ title: 'Paddle test', headerBackVisible: false }}
        />
        <Stack.Screen
          name="screening/[id]/results"
          options={{ title: 'Result', headerBackVisible: false }}
        />
      </Stack>
    </>
  );
}
