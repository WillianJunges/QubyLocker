import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/auth/AuthContext';
import { colors } from '@/theme/colors';

export default function AppLayout() {
  const { isUnlocked } = useAuth();

  if (!isUnlocked) {
    return <Redirect href="/(auth)/unlock" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
