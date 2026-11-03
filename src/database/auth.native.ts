import * as SecureStore from 'expo-secure-store';

import { getDatabase } from './database';
import { createPasswordRecord, verifyPassword } from './password';

const SESSION_KEY = 'assettrack-authenticated-email';

type LocalAccount = {
  email: string;
  salt: string;
  password_hash: string;
};

export async function initializeAuthDatabase() {
  const db = await getDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS local_admin (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      email TEXT NOT NULL UNIQUE,
      salt TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function getLocalAccountEmail() {
  const db = await getDatabase();
  const account = await db.getFirstAsync<{ email: string }>(
    'SELECT email FROM local_admin WHERE id = 1'
  );
  return account?.email ?? null;
}

export async function createLocalAccount(email: string, password: string) {
  const db = await getDatabase();
  const existing = await db.getFirstAsync<{ id: number }>(
    'SELECT id FROM local_admin WHERE id = 1'
  );

  if (existing) {
    throw new Error('Akun administrator sudah terdaftar.');
  }

  const { salt, passwordHash } = await createPasswordRecord(password);
  await db.runAsync(
    `INSERT INTO local_admin (id, email, salt, password_hash)
     VALUES (1, ?, ?, ?)`,
    email,
    salt,
    passwordHash
  );
}

export async function verifyLocalCredentials(email: string, password: string) {
  const db = await getDatabase();
  const account = await db.getFirstAsync<LocalAccount>(
    'SELECT email, salt, password_hash FROM local_admin WHERE id = 1'
  );

  if (!account || account.email !== email) {
    return false;
  }

  return verifyPassword(password, account.salt, account.password_hash);
}

export async function getRememberedSession() {
  return SecureStore.getItemAsync(SESSION_KEY);
}

export async function setRememberedSession(email: string | null) {
  if (email) {
    await SecureStore.setItemAsync(SESSION_KEY, email);
    return;
  }

  await SecureStore.deleteItemAsync(SESSION_KEY);
}
