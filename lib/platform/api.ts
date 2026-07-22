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

  let res: Response;
  try {
    res = await fetch(path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    // Network-level failure (offline, DNS, CORS).
    throw new ApiError(0, 'Could not reach the server. Check your connection and try again.');
  }

  // The API always answers JSON. If we got HTML instead, the serverless
  // function isn't running — almost always because the deploy hasn't
  // published the API yet, or the Vercel environment variables are missing.
  // Surface that plainly instead of a generic "something went wrong".
  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new ApiError(
      res.status,
      'The server API is not responding. If the site was just deployed, wait a minute and retry — otherwise the backend needs its environment variables set in Vercel.',
    );
  }

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
