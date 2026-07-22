import { createHash, createHmac, randomInt, timingSafeEqual } from 'node:crypto';
import { env } from './env.js';

// Unambiguous alphabet (no 0/O, 1/I/L) — keys get read aloud and retyped.
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

const randomChars = (n: number): string => {
  let out = '';
  for (let i = 0; i < n; i++) out += ALPHABET[randomInt(ALPHABET.length)];
  return out;
};

/**
 * Single-use claim key, e.g. 4AM-7K9X2-M3PQR.
 * 10 chars over a 31-char alphabet ≈ 8×10^14 combinations — non-guessable
 * behind the claim endpoint's rate limit. Shown to the admin exactly once.
 */
export const generateClaimKey = (): string =>
  `4AM-${randomChars(5)}-${randomChars(5)}`;

/** Normalized sha256 of a claim key — the only form ever persisted. */
export const hashClaimKey = (key: string): string =>
  createHash('sha256').update(key.trim().toUpperCase()).digest('hex');

/** Public certificate serial, e.g. 4AM-2026-A7K3M2 (unique-checked by DB). */
export const generateCertificateSerial = (year = new Date().getFullYear()): string =>
  `4AM-${year}-${randomChars(6)}`;

/**
 * verification_hash = HMAC(secret, serial:enrollmentId).
 * The public verify page recomputes this server-side, so a tampered or
 * guessed serial can never masquerade as an issued certificate.
 */
export const verificationHash = (serial: string, enrollmentId: string): string =>
  createHmac('sha256', env.serverHmacSecret)
    .update(`${serial}:${enrollmentId}`)
    .digest('hex');

export const verifyHash = (
  serial: string,
  enrollmentId: string,
  candidate: string,
): boolean => {
  const expected = Buffer.from(verificationHash(serial, enrollmentId), 'hex');
  const given = Buffer.from(candidate, 'hex');
  return expected.length === given.length && timingSafeEqual(expected, given);
};
