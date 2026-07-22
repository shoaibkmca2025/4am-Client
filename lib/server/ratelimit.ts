// Fixed-window rate limiter, in-memory per serverless instance.
// Good enough for MVP abuse-damping on /api/leads, /api/newsletter,
// /api/portal/claim and /verify. NOTE: instances are ephemeral and
// unshared — for hard guarantees move to Upstash Redis in Phase 3.

interface Window { count: number; resetAt: number }
const windows = new Map<string, Window>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
}

export const rateLimit = (
  bucket: string,
  ip: string,
  limit: number,
  windowMs: number,
): RateLimitResult => {
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const w = windows.get(key);

  if (!w || now >= w.resetAt) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSec: 0 };
  }

  w.count += 1;
  if (w.count > limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.ceil((w.resetAt - now) / 1000),
    };
  }
  return { allowed: true, remaining: limit - w.count, retryAfterSec: 0 };
};

// Opportunistic cleanup so long-lived warm instances don't grow unbounded.
setInterval(() => {
  const now = Date.now();
  for (const [k, w] of windows) if (now >= w.resetAt) windows.delete(k);
}, 60_000).unref?.();
