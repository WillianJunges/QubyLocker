export const CREATE_PASSWORD_ENTRIES_TABLE = `
CREATE TABLE IF NOT EXISTS password_entries (
  id TEXT PRIMARY KEY NOT NULL,
  app_name TEXT NOT NULL,
  username TEXT NOT NULL,
  password_cipher TEXT NOT NULL,
  iv TEXT NOT NULL,
  auth_tag TEXT NOT NULL,
  url TEXT,
  notes TEXT,
  mfa_enabled INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
`;
