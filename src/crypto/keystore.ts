import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const MASTER_KEY_ALIAS = 'qubylocker_master_key';
// Marcador simples, sem biometria, só para saber se o cofre já foi
// configurado — no Android, um item salvo com requireAuthentication:true
// exige biometria em TODA leitura, mesmo passando requireAuthentication:false,
// então não dá pra usar a própria chave mestra para essa checagem.
const SETUP_MARKER_ALIAS = 'qubylocker_setup_complete';

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Retorna a chave mestra (256 bits, hex) usada para cifrar/decifrar as senhas.
 * Gera e persiste uma nova chave no primeiro acesso.
 *
 * `requireAuthentication: true` amarra a leitura da chave à biometria/PIN do
 * dispositivo (Android Keystore / iOS Keychain) — não existe PIN próprio do
 * app: quem autentica é sempre o sistema operacional.
 */
const AUTHENTICATION_PROMPT = 'Confirme sua identidade para continuar';

export async function getOrCreateMasterKey(): Promise<string> {
  const alreadySetUp = await hasMasterKey();

  const existing = await SecureStore.getItemAsync(MASTER_KEY_ALIAS, {
    requireAuthentication: true,
    authenticationPrompt: AUTHENTICATION_PROMPT,
  });
  if (existing) return existing;

  if (alreadySetUp) {
    // A chave mestra já existe, mas não conseguimos lê-la agora (autenticação
    // falhou/foi cancelada). NUNCA gerar uma nova aqui — isso trocaria a
    // chave e tornaria todas as senhas já salvas indecifráveis para sempre.
    throw new Error('Não foi possível acessar a chave mestra. Tente novamente.');
  }

  const randomBytes = await Crypto.getRandomBytesAsync(32); // 256 bits
  const newKey = bytesToHex(randomBytes);

  await SecureStore.setItemAsync(MASTER_KEY_ALIAS, newKey, {
    requireAuthentication: true,
    authenticationPrompt: AUTHENTICATION_PROMPT,
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  await SecureStore.setItemAsync(SETUP_MARKER_ALIAS, 'true');

  return newKey;
}

/** Não exige biometria: só olha o marcador de setup, nunca a chave em si. */
export async function hasMasterKey(): Promise<boolean> {
  const marker = await SecureStore.getItemAsync(SETUP_MARKER_ALIAS);
  return marker === 'true';
}
