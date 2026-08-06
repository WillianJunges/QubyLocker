import * as SQLite from 'expo-sqlite';

import { CREATE_PASSWORD_ENTRIES_TABLE } from '@/db/schema';

const DATABASE_NAME = 'qubylocker.db';

let database: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (database) return database;

  database = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await database.execAsync(CREATE_PASSWORD_ENTRIES_TABLE);

  return database;
}
