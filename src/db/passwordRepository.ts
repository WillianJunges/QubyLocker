import { getDatabase } from '@/db/client';
import { PasswordEntry } from '@/types/PasswordEntry';

type PasswordEntryRow = {
  id: string;
  app_name: string;
  username: string;
  password_cipher: string;
  iv: string;
  auth_tag: string;
  url: string | null;
  notes: string | null;
  mfa_enabled: number;
  created_at: number;
  updated_at: number;
};

function rowToEntry(row: PasswordEntryRow): PasswordEntry {
  return {
    id: row.id,
    appName: row.app_name,
    username: row.username,
    passwordCipher: row.password_cipher,
    iv: row.iv,
    authTag: row.auth_tag,
    url: row.url ?? undefined,
    notes: row.notes ?? undefined,
    mfaEnabled: row.mfa_enabled === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listEntries(): Promise<PasswordEntry[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<PasswordEntryRow>(
    'SELECT * FROM password_entries ORDER BY app_name COLLATE NOCASE ASC;'
  );
  return rows.map(rowToEntry);
}

export async function getEntryById(id: string): Promise<PasswordEntry | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<PasswordEntryRow>(
    'SELECT * FROM password_entries WHERE id = ?;',
    [id]
  );
  return row ? rowToEntry(row) : null;
}

export async function insertEntry(entry: PasswordEntry): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO password_entries
      (id, app_name, username, password_cipher, iv, auth_tag, url, notes, mfa_enabled, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      entry.id,
      entry.appName,
      entry.username,
      entry.passwordCipher,
      entry.iv,
      entry.authTag,
      entry.url ?? null,
      entry.notes ?? null,
      entry.mfaEnabled ? 1 : 0,
      entry.createdAt,
      entry.updatedAt,
    ]
  );
}

export async function updateEntry(entry: PasswordEntry): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE password_entries SET
      app_name = ?, username = ?, password_cipher = ?, iv = ?, auth_tag = ?,
      url = ?, notes = ?, mfa_enabled = ?, updated_at = ?
     WHERE id = ?;`,
    [
      entry.appName,
      entry.username,
      entry.passwordCipher,
      entry.iv,
      entry.authTag,
      entry.url ?? null,
      entry.notes ?? null,
      entry.mfaEnabled ? 1 : 0,
      entry.updatedAt,
      entry.id,
    ]
  );
}

export async function deleteEntry(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM password_entries WHERE id = ?;', [id]);
}
