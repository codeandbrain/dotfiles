import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from 'node:crypto';

type SessionPayload = {
  accessToken: string;
  expiresAt: number;
};

function getKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET is required in production');
  }
  return createHash('sha256').update(secret || 'orbit-development-session-secret').digest();
}

function encode(value: Buffer) {
  return value.toString('base64url');
}

function decode(value: string) {
  return Buffer.from(value, 'base64url');
}

export async function encryptSession(payload: SessionPayload) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', getKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [encode(iv), encode(tag), encode(ciphertext)].join('.');
}

export async function decryptSession(value: string): Promise<SessionPayload> {
  const [ivValue, tagValue, ciphertextValue] = value.split('.');
  if (!ivValue || !tagValue || !ciphertextValue) throw new Error('Invalid session');
  try {
    const decipher = createDecipheriv('aes-256-gcm', getKey(), decode(ivValue));
    decipher.setAuthTag(decode(tagValue));
    const plaintext = Buffer.concat([decipher.update(decode(ciphertextValue)), decipher.final()]);
    const payload = JSON.parse(plaintext.toString('utf8')) as SessionPayload;
    if (!payload.accessToken || !Number.isFinite(payload.expiresAt) || payload.expiresAt <= Date.now()) {
      throw new Error('Session expired');
    }
    return payload;
  } catch (error) {
    if (error instanceof Error && error.message === 'Session expired') throw error;
    throw new Error('Invalid session');
  }
}

export function generateOAuthState() {
  return randomBytes(32).toString('hex');
}

export function verifyOAuthState(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);
  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
}
