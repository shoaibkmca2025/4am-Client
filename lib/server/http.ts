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
  status: (code: number) => ApiResponse;
  json: (data: unknown) => void;
  send: (data: string | Buffer) => void;
  redirect: (statusOrUrl: number | string, url?: string) => void;
}

export const json = (res: ApiResponse, code: number, data: unknown): void => {
  res.status(code).json(data);
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
