import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type AuthContextValue = {
  isUnlocked: boolean;
  unlock: () => void;
  lock: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const unlock = useCallback(() => setIsUnlocked(true), []);
  const lock = useCallback(() => setIsUnlocked(false), []);

  const value = useMemo(() => ({ isUnlocked, unlock, lock }), [isUnlocked, unlock, lock]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>.');
  return ctx;
}
