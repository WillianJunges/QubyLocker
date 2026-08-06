import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as ScreenCapture from 'expo-screen-capture';

import { AuthProvider } from '@/auth/AuthContext';
import { useAutoLock } from '@/auth/useAutoLock';
import { colors } from '@/theme/colors';

function AutoLockGuard() {
  useAutoLock();
  return null;
}

export default function RootLayout() {
  useEffect(() => {
    // Impede prints/gravações de tela em todo o app (equivalente ao FLAG_SECURE).
    ScreenCapture.preventScreenCaptureAsync();
    return () => {
      // Em recarregamentos durante o desenvolvimento (Fast Refresh) a activity
      // pode já não existir mais quando esse cleanup roda — não é um erro real.
      ScreenCapture.allowScreenCaptureAsync().catch(() => {});
    };
  }, []);

  return (
    <AuthProvider>
      <AutoLockGuard />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </AuthProvider>
  );
}
