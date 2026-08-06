import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import * as ExpoCrypto from 'expo-crypto';

import { PasswordField } from '@/components/PasswordField';
import { encrypt } from '@/crypto/cipher';
import { getOrCreateMasterKey } from '@/crypto/keystore';
import { insertEntry } from '@/db/passwordRepository';
import { colors } from '@/theme/colors';
import { validateNewEntry } from '@/utils/validators';

export default function NewEntryScreen() {
  const [appName, setAppName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordRevealed, setPasswordRevealed] = useState(true);

  async function handleSave() {
    const validationError = validateNewEntry({ appName, username, password });
    if (validationError) {
      setError(validationError);
      return;
    }

    const masterKey = await getOrCreateMasterKey();
    const { cipher, iv, authTag } = encrypt(password, masterKey);
    const now = Date.now();

    await insertEntry({
      id: ExpoCrypto.randomUUID(),
      appName,
      username,
      passwordCipher: cipher,
      iv,
      authTag,
      url: url || undefined,
      notes: notes || undefined,
      mfaEnabled,
      createdAt: now,
      updatedAt: now,
    });

    router.back();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Senha</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do App/Site"
        placeholderTextColor={colors.textMuted}
        value={appName}
        onChangeText={setAppName}
      />
      <TextInput
        style={styles.input}
        placeholder="Usuário/Login"
        placeholderTextColor={colors.textMuted}
        value={username}
        onChangeText={setUsername}
      />
      <PasswordField
        value={password}
        onChangeText={setPassword}
        editable
        revealed={passwordRevealed}
        onToggleReveal={() => setPasswordRevealed((r) => !r)}
      />
      <TextInput
        style={styles.input}
        placeholder="URL (opcional)"
        placeholderTextColor={colors.textMuted}
        value={url}
        onChangeText={setUrl}
      />
      <TextInput
        style={styles.input}
        placeholder="Notas (opcional)"
        placeholderTextColor={colors.textMuted}
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>MFA ativo</Text>
        <Switch value={mfaEnabled} onValueChange={setMfaEnabled} />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Salvar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
    paddingHorizontal: 16,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    color: colors.text,
  },
  error: {
    color: colors.danger,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: colors.primaryText,
    fontWeight: '600',
  },
});
