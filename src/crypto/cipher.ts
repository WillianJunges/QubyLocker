import CryptoJS from 'crypto-js';
import * as ExpoCrypto from 'expo-crypto';

// Decisão definitiva: crypto-js não implementa AES-GCM (só CBC/CTR/CFB/OFB/ECB,
// sem tag de autenticação), então usamos Encrypt-then-MAC como equivalente:
// AES-256-CBC (confidencialidade) + HMAC-SHA256 sobre (iv + ciphertext) (integridade).
// Suficiente para um projeto pessoal offline — sem necessidade de trocar de lib.
//
// O gerador de aleatoriedade do próprio crypto-js (WordArray.random) depende de
// `crypto.getRandomValues` (browser) ou `require('crypto')` (Node) — nenhum dos
// dois existe no React Native, então ele lança erro em runtime. Por isso o IV é
// gerado via expo-crypto (RNG nativo seguro) e só convertido pro formato do
// crypto-js depois.

export type EncryptedPayload = {
  cipher: string; // base64
  iv: string; // base64
  authTag: string; // base64 (HMAC-SHA256 de iv+cipher)
};

function deriveHmacKey(masterKeyHex: string): CryptoJS.lib.WordArray {
  // Chave de MAC derivada da chave mestra, separada da chave de cifragem.
  return CryptoJS.SHA256(CryptoJS.enc.Hex.parse(masterKeyHex) + ':mac');
}

export function encrypt(plainText: string, masterKeyHex: string): EncryptedPayload {
  const key = CryptoJS.enc.Hex.parse(masterKeyHex);
  const iv = CryptoJS.lib.WordArray.create(ExpoCrypto.getRandomBytes(16));

  const encrypted = CryptoJS.AES.encrypt(plainText, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const cipherText = encrypted.ciphertext;
  const authTag = CryptoJS.HmacSHA256(iv.concat(cipherText), deriveHmacKey(masterKeyHex));

  return {
    cipher: CryptoJS.enc.Base64.stringify(cipherText),
    iv: CryptoJS.enc.Base64.stringify(iv),
    authTag: CryptoJS.enc.Base64.stringify(authTag),
  };
}

export function decrypt(payload: EncryptedPayload, masterKeyHex: string): string {
  const key = CryptoJS.enc.Hex.parse(masterKeyHex);
  const iv = CryptoJS.enc.Base64.parse(payload.iv);
  const cipherText = CryptoJS.enc.Base64.parse(payload.cipher);

  const expectedTag = CryptoJS.HmacSHA256(iv.concat(cipherText), deriveHmacKey(masterKeyHex));
  const expectedTagBase64 = CryptoJS.enc.Base64.stringify(expectedTag);

  if (expectedTagBase64 !== payload.authTag) {
    throw new Error('Falha de integridade: dados corrompidos ou adulterados.');
  }

  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: cipherText } as CryptoJS.lib.CipherParams,
    key,
    { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  );

  return decrypted.toString(CryptoJS.enc.Utf8);
}
