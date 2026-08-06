import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as ScreenCapture from 'expo-screen-capture';

import { AuthProvider } from '@/auth/AuthContext';
import { useAutoLock } from '@/auth/useAutoLock';

function AutoLockGuard() {
  useAutoLock();
  return null;
}

export default function RootLayout() {
  useEffect(() => {
    // Impede prints/gravações de tela em todo o app (equivalente ao FLAG_SECURE).
    ScreenCapture.preventScreenCaptureAsync();
    return () => {
      ScreenCapture.allowScreenCaptureAsync();
    };
  }, []);

  return (
    <AuthProvider>
      <AutoLockGuard />
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
