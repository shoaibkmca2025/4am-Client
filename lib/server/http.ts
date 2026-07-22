import type { IncomingMessage, ServerResponse } from 'node:http';

// Minimal typings for Vercel's Node runtime request/response helpers.
// (Replaces @vercel/node, which pulled a vulnerable transitive tree just
// for these two interfaces.)
export interface ApiRequest extends IncomingMessage {
  query: Record<string, string | string[] | undefined>;
  body: unknown;
  cookies: Record<string, string>;
}

export interface ApiResponse extends ServerResponse {
  status?: (code: number) => ApiResponse;
  json?: (data: unknown) => void;
  send?: (data: string | Buffer) => void;
  redirect?: (statusOrUrl: number | string, url?: string) => void;
}

// Write JSON using RAW Node methods, not Vercel's res.status()/res.json()
// sugar. Those helpers are not guaranteed to be present on every runtime
// path, and depending on them made every JSON endpoint crash with
// FUNCTION_INVOCATION_FAILED in production. Raw statusCode/end always work.
export const json = (res: ApiResponse, code: number, data: unknown): void => {
  res.statusCode = code;
  // setHeader only — no getHeader probe, so this works with any minimal
  // response object (Vercel runtime, Node server, or a test double).
  res.setHeader?.('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
};

/** 405 + Allow header unless the request method is in the allowlist. */
export const allowMethods = (
  req: ApiRequest,
  res: ApiResponse,
  methods: string[],
): boolean => {
  if (methods.includes(req.method ?? '')) return true;
  res.setHeader('Allow', methods.join(', '));
  json(res, 405, { error: 'Method not allowed' });
  return false;
};

/** Client IP for rate limiting (Vercel sets x-forwarded-for). */
export const clientIp = (req: ApiRequest): string => {
  const fwd = req.headers['x-forwarded-for'];
  const first = Array.isArray(fwd) ? fwd[0] : fwd;
  return (first ?? '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
};
