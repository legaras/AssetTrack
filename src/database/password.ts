import { getRandomBytesAsync } from 'expo-crypto';
import { pbkdf2Async } from '@noble/hashes/pbkdf2';
import { sha256 } from '@noble/hashes/sha2';

const ITERATIONS = 600_000;

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

function equalHex(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return difference === 0;
}

async function deriveHash(password: string, salt: string) {
  const hash = await pbkdf2Async(sha256, password, salt, {
    c: ITERATIONS,
    dkLen: 32,
    asyncTick: 50
  });

  return toHex(hash);
}

export async function createPasswordRecord(password: string) {
  const salt = toHex(await getRandomBytesAsync(16));
  return {
    salt,
    passwordHash: await deriveHash(password, salt)
  };
}

export async function verifyPassword(
  password: string,
  salt: string,
  expectedHash: string
) {
  return equalHex(await deriveHash(password, salt), expectedHash);
}
