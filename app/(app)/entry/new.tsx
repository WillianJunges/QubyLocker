import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { v4 as uuidv4 } from 'uuid';

import { PasswordField } from '@/components/PasswordField';
import { encrypt } from '@/crypto/cipher';
import { getOrCreateMasterKey } from '@/crypto/keystore';
import { insertEntry } from '@/db/passwordRepository';
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
      id: uuidv4(),
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

      <TextInput style={styles.input} placeholder="Nome do App/Site" value={appName} onChangeText={setAppName} />
      <TextInput style={styles.input} placeholder="Usuário/Login" value={username} onChangeText={setUsername} />
      <PasswordField
        value={password}
        onChangeText={setPassword}
        editable
        revealed={passwordRevealed}
        onToggleReveal={() => setPasswordRevealed((r) => !r)}
      />
      <TextInput style={styles.input} placeholder="URL (opcional)" value={url} onChangeText={setUrl} />
      <TextInput style={styles.input} placeholder="Notas (opcional)" value={notes} onChangeText={setNotes} multiline />

      <View style={styles.switchRow}>
        <Text>MFA ativo</Text>
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
    paddingTop: 60,
    paddingHorizontal: 16,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  error: {
    color: '#DC2626',
  },
  button: {
    backgroundColor: '#0369A1',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
