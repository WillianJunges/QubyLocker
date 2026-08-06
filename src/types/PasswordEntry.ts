export type PasswordEntry = {
  id: string;
  appName: string;
  username: string;
  /** Ciphertext em base64 — nunca a senha em texto puro. */
  passwordCipher: string;
  /** IV/nonce usado na cifragem, em base64. */
  iv: string;
  /** Tag de autenticação (Encrypt-then-MAC), em base64. Ver src/crypto/cipher.ts. */
  authTag: string;
  url?: string;
  notes?: string;
  mfaEnabled: boolean;
  createdAt: number;
  updatedAt: number;
};

export type NewPasswordEntryInput = {
  appName: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  mfaEnabled: boolean;
};
