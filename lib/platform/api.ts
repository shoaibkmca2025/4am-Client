import { supabase } from './supabaseClient';

export class ApiError extends Error {
  status: number;
  issues?: Array<{ field: string; message: string }>;
  constructor(status: number, message: string, issues?: Array<{ field: string; message: string }>) {
    super(message);
    this.status = status;
    this.issues = issues;
  }
}

/**
 * Calls an /api route with the caller's Supabase access token attached.
 * Server handlers resolve the user and role from that token — the client
 * never asserts its own role.
 */
export const apiFetch = async <T>(
  path: string,
  init: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> => {
  const { method = 'GET', body, auth = true } = init;
  const headers: Record<string, string> = {};

  if (auth) {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new ApiError(401, 'Your session has expired. Please sign in again.');
    headers.Authorization = `Bearer ${token}`;
  }
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const res = await fetch(path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const payload = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(
      res.status,
      payload?.error ?? 'Something went wrong. Please try again.',
      payload?.issues,
    );
  }
  return payload as T;
};
