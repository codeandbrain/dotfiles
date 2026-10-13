import { Redis } from 'ioredis';

// Cache adapter interface using Redis when REDIS_URL is set, otherwise in-memory maps.

type TokenEntry = { token: string; expiresAt: number };

const REDIS_URL = process.env.REDIS_URL;
let redis: Redis | null = null;

if (REDIS_URL) {
  redis = new Redis(REDIS_URL);
}

// In-memory fallbacks
const tokenMap = new Map<number, TokenEntry>();
const ownerMap = new Map<string, number>();

// Helper functions
export async function getCachedToken(installationId: number): Promise<TokenEntry | null> {
  if (redis) {
    const key = `installation:token:${installationId}`;
    const raw = await redis.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as TokenEntry;
    } catch {
      return null;
    }
  }

  const v = tokenMap.get(installationId) || null;
  if (!v) return null;
  // return null if expired
  if (v.expiresAt - 30 <= Math.floor(Date.now() / 1000)) {
    tokenMap.delete(installationId);
    return null;
  }
  return v;
}

export async function setCachedToken(installationId: number, token: string, expiresAt: number): Promise<void> {
  if (redis) {
    const key = `installation:token:${installationId}`;
    const ttl = Math.max(1, Math.floor(expiresAt - Date.now() / 1000));
    await redis.set(key, JSON.stringify({ token, expiresAt }), 'EX', ttl);
    return;
  }

  tokenMap.set(installationId, { token, expiresAt });
}

export async function deleteCachedToken(installationId: number): Promise<void> {
  if (redis) {
    const key = `installation:token:${installationId}`;
    await redis.del(key);
    return;
  }
  tokenMap.delete(installationId);
}

export async function getCachedOwnerInstallation(owner: string): Promise<number | null> {
  const key = owner.toLowerCase();
  if (redis) {
    const val = await redis.get(`owner:installation:${key}`);
    return val ? Number(val) : null;
  }
  return ownerMap.get(key) ?? null;
}

export async function setCachedOwnerInstallation(owner: string, installationId: number): Promise<void> {
  const key = owner.toLowerCase();
  if (redis) {
    // set a TTL of 24 hours for owner->installation mapping; will be refreshed on next lookup
    await redis.set(`owner:installation:${key}`, String(installationId), 'EX', 24 * 60 * 60);
    return;
  }
  ownerMap.set(key, installationId);
}

export async function deleteCachedOwnerInstallation(owner: string): Promise<void> {
  const key = owner.toLowerCase();
  if (redis) {
    await redis.del(`owner:installation:${key}`);
    return;
  }
  ownerMap.delete(key);
}
