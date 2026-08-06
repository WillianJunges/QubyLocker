import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { PasswordField } from '@/components/PasswordField';
import { decrypt, encrypt } from '@/crypto/cipher';
import { getOrCreateMasterKey } from '@/crypto/keystore';
import { deleteEntry, getEntryById, updateEntry } from '@/db/passwordRepository';
import { colors } from '@/theme/colors';
import { PasswordEntry } from '@/types/PasswordEntry';

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [entry, setEntry] = useState<PasswordEntry | null>(null);

  const [appName, setAppName] = useState('');
  const [username, setUsername] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const [password, setPassword] = useState('');
  const [passwordLoaded, setPasswordLoaded] = useState(false);
  const [passwordRevealed, setPasswordRevealed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const found = await getEntryById(id);
      if (!found) return;

      setEntry(found);
      setAppName(found.appName);
      setUsername(found.username);
      setUrl(found.url ?? '');
      setNotes(found.notes ?? '');
      setMfaEnabled(found.mfaEnabled);
    }
    load();
  }, [id]);

  async function handleLoadPassword() {
    if (!entry) return;
    setError(null);
    try {
      // Único ponto que exige biometria nesta tela: decifrar a senha guardada.
      const masterKey = await getOrCreateMasterKey();
      const plain = decrypt(
        { cipher: entry.passwordCipher, iv: entry.iv, authTag: entry.authTag },
        masterKey
      );
      setPassword(plain);
      setPasswordLoaded(true);
      setPasswordRevealed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar a senha.');
    }
  }

  async function handleSave() {
    // Sem a senha carregada não há o que re-cifrar com segurança — evita
    // sobrescrever a senha salva com uma string vazia.
    if (!entry || !passwordLoaded) return;
    setError(null);

    try {
      const masterKey = await getOrCreateMasterKey();
      const { cipher, iv, authTag } = encrypt(password, masterKey);

      await updateEntry({
        ...entry,
        appName,
        username,
        passwordCipher: cipher,
        iv,
        authTag,
        url: url || undefined,
        notes: notes || undefined,
        mfaEnabled,
        updatedAt: Date.now(),
      });

      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar as alterações.');
    }
  }

  function handleDelete() {
    if (!entry) return;
    Alert.alert(
      'Excluir senha',
      `Tem certeza que deseja excluir "${entry.appName}"? Essa ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteEntry(entry.id);
            router.back();
          },
        },
      ]
    );
  }

  if (!entry) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Senha</Text>

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

      {passwordLoaded ? (
        <PasswordField
          value={password}
          onChangeText={setPassword}
          editable
          revealed={passwordRevealed}
          onToggleReveal={() => setPasswordRevealed((r) => !r)}
        />
      ) : (
        <Pressable onPress={handleLoadPassword}>
          <Text style={styles.link}>Carregar senha (requer biometria)</Text>
        </Pressable>
      )}

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

      <Pressable
        style={[styles.button, !passwordLoaded && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={!passwordLoaded}
      >
        <Text style={styles.buttonText}>Salvar alterações</Text>
      </Pressable>
      {!passwordLoaded && (
        <Text style={styles.hint}>Carregue a senha acima antes de salvar alterações.</Text>
      )}
      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable style={[styles.button, styles.buttonDanger]} onPress={handleDelete}>
        <Text style={styles.buttonText}>Excluir</Text>
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
  link: {
    color: colors.link,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
  error: {
    color: colors.danger,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
  },
  buttonText: {
    color: colors.primaryText,
    fontWeight: '600',
  },
});
