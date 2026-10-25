import test from 'node:test';
import assert from 'node:assert/strict';
import { decryptSession, encryptSession, generateOAuthState, verifyOAuthState } from './github-session';

test('encrypts and decrypts an unexpired GitHub session', async () => {
  process.env.SESSION_SECRET = 'test-secret-that-is-long-enough-for-a-session';
  const encrypted = await encryptSession({ accessToken: 'gho_test', expiresAt: Date.now() + 60_000 });

  assert.notEqual(encrypted, 'gho_test');
  const decrypted = await decryptSession(encrypted);
  assert.equal(decrypted.accessToken, 'gho_test');
  assert.equal(typeof decrypted.expiresAt, 'number');
});

test('rejects a tampered or expired session', async () => {
  process.env.SESSION_SECRET = 'test-secret-that-is-long-enough-for-a-session';
  const encrypted = await encryptSession({ accessToken: 'gho_test', expiresAt: Date.now() - 1 });

  await assert.rejects(() => decryptSession(`${encrypted.slice(0, -1)}x`));
  await assert.rejects(() => decryptSession(encrypted), /expired/i);
});

test('creates and verifies a one-time OAuth state value', () => {
  const state = generateOAuthState();
  assert.equal(state.length, 64);
  assert.equal(verifyOAuthState(state, state), true);
  assert.equal(verifyOAuthState(state, `${state.slice(0, -1)}x`), false);
});
