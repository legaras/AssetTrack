import AsyncStorage from '@react-native-async-storage/async-storage';

import { createPasswordRecord, verifyPassword } from './password';

const ACCOUNT_KEY = 'assettrack-local-admin';
const SESSION_KEY = 'assettrack-authenticated-email';

type LocalAccount = {
  email: string;
  salt: string;
  passwordHash: string;
};

async function getAccount(): Promise<LocalAccount | null> {
  const stored = await AsyncStorage.getItem(ACCOUNT_KEY);
  if (!stored) {
    return null;
  }

  const account: unknown = JSON.parse(stored);
  if (
    typeof account !== 'object' ||
    account === null ||
    !('email' in account) ||
    typeof account.email !== 'string' ||
    !('salt' in account) ||
    typeof account.salt !== 'string' ||
    !('passwordHash' in account) ||
    typeof account.passwordHash !== 'string'
  ) {
    throw new Error('Data akun lokal tidak valid.');
  }

  return {
    email: account.email,
    salt: account.salt,
    passwordHash: account.passwordHash
  };
}

export async function initializeAuthDatabase() {
  await getAccount();
}

export async function getLocalAccountEmail() {
  return (await getAccount())?.email ?? null;
}

export async function createLocalAccount(email: string, password: string) {
  if (await getAccount()) {
    throw new Error('Akun administrator sudah terdaftar.');
  }

  const { salt, passwordHash } = await createPasswordRecord(password);
  await AsyncStorage.setItem(
    ACCOUNT_KEY,
    JSON.stringify({ email, salt, passwordHash } satisfies LocalAccount)
  );
}

export async function verifyLocalCredentials(email: string, password: string) {
  const account = await getAccount();
  if (!account || account.email !== email) {
    return false;
  }

  return verifyPassword(password, account.salt, account.passwordHash);
}

export async function getRememberedSession() {
  return AsyncStorage.getItem(SESSION_KEY);
}

export async function setRememberedSession(email: string | null) {
  if (email) {
    await AsyncStorage.setItem(SESSION_KEY, email);
    return;
  }

  await AsyncStorage.removeItem(SESSION_KEY);
}
