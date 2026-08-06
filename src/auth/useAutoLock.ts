import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { useAuth } from '@/auth/AuthContext';

/**
 * Bloqueia o app automaticamente sempre que ele sai de foreground
 * (equivalente ao OnPause/OnStop do Android citado no roteiro original).
 */
export function useAutoLock(): void {
  const { lock, isUnlocked } = useAuth();
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const wasActive = appState.current === 'active';
      const goingToBackground = nextState !== 'active';

      if (wasActive && goingToBackground && isUnlocked) {
        lock();
      }

      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [lock, isUnlocked]);
}
