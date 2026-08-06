import { Redirect } from 'expo-router';

import { useAuth } from '@/auth/AuthContext';

export default function Index() {
  const { isUnlocked } = useAuth();

  return <Redirect href={isUnlocked ? '/(app)/dashboard' : '/(auth)/unlock'} />;
}
