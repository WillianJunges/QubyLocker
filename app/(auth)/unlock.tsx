import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { useAuth } from '@/auth/AuthContext';
import { authenticate, isBiometricAvailable } from '@/auth/biometrics';
import { getOrCreateMasterKey, hasMasterKey } from '@/crypto/keystore';
import { colors } from '@/theme/colors';

export default function UnlockScreen() {
  const { unlock } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [isFirstAccess, setIsFirstAccess] = useState(false);

  useEffect(() => {
    async function checkSetup() {
      const exists = await hasMasterKey();
      setIsFirstAccess(!exists);
      setCheckingSetup(false);
    }
    checkSetup();
  }, []);

  async function handleUnlock() {
    setError(null);

    const available = await isBiometricAvailable();
    if (!available) {
      setError('Configure biometria ou PIN/padrão de tela no celular para usar o QubyLocker.');
      return;
    }

    try {
      if (isFirstAccess) {
        // Criar a chave mestra já pede biometria/PIN por conta própria
        // (SecureStore com requireAuthentication) — pedir de novo aqui em
        // cima seria uma segunda autenticação redundante em sequência.
        await getOrCreateMasterKey();
      } else {
        // expo-local-authentication usa a biometria do aparelho e cai
        // automaticamente para o PIN/padrão/senha do Android caso a
        // biometria falhe ou não esteja disponível.
        const ok = await authenticate('Desbloqueie o QubyLocker');
        if (!ok) return;
      }

      unlock();
      router.replace('/(app)/dashboard');
    } catch {
      setError('Não foi possível autenticar. Tente novamente.');
    }
  }

  if (checkingSetup) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QubyLocker</Text>

      {isFirstAccess && (
        <Text style={styles.subtitle}>
          Bem-vindo! Toque abaixo para configurar seu cofre usando a biometria/PIN do celular.
        </Text>
      )}

      <Pressable style={styles.button} onPress={handleUnlock}>
        <Text style={styles.buttonText}>{isFirstAccess ? 'Configurar' : 'Desbloquear'}</Text>
      </Pressable>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: colors.textMuted,
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.primaryText,
    fontWeight: '600',
  },
  error: {
    color: colors.danger,
    textAlign: 'center',
  },
});
