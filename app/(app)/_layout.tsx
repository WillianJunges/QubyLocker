import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/auth/AuthContext';
import { useTheme } from '@/theme/ThemeContext';

export default function AppLayout() {
  const { isUnlocked } = useAuth();
  const { colors } = useTheme();

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
