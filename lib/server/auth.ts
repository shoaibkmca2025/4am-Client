import type { ApiRequest, ApiResponse } from './http';
import { json } from './http';
import { supabaseAdmin } from './supabaseAdmin';

export type Role = 'admin' | 'staff' | 'student';

export interface AuthedUser {
  id: string;
  email: string | null;
  role: Role;
  fullName: string | null;
}

const bearer = (req: ApiRequest): string | null => {
  const h = req.headers.authorization;
  if (!h || !h.startsWith('Bearer ')) return null;
  return h.slice(7).trim() || null;
};

/**
 * Resolves the caller from their Supabase access token and loads their role
 * from `profiles`. Returns null when the token is missing/invalid.
 * The role is read server-side — never taken from client-supplied claims.
 */
export const getUser = async (req: ApiRequest): Promise<AuthedUser | null> => {
  const token = bearer(req);
  if (!token) return null;

  const admin = supabaseAdmin();
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data?.user) return null;

  const { data: profile } = await admin
    .from('profiles')
    .select('role, full_name')
    .eq('id', data.user.id)
    .single();

  return {
    id: data.user.id,
    email: data.user.email ?? null,
    role: (profile?.role as Role) ?? 'student',
    fullName: profile?.full_name ?? null,
  };
};

/** Requires a signed-in user; writes 401 and returns null when absent. */
export const requireUser = async (
  req: ApiRequest,
  res: ApiResponse,
): Promise<AuthedUser | null> => {
  const user = await getUser(req);
  if (!user) {
    json(res, 401, { error: 'Sign in to continue.' });
    return null;
  }
  return user;
};

/** Requires admin or staff; writes 401/403 as appropriate. */
export const requireStaff = async (
  req: ApiRequest,
  res: ApiResponse,
): Promise<AuthedUser | null> => {
  const user = await requireUser(req, res);
  if (!user) return null;
  if (user.role !== 'admin' && user.role !== 'staff') {
    json(res, 403, { error: 'You do not have access to this area.' });
    return null;
  }
  return user;
};

export const requireAdmin = async (
  req: ApiRequest,
  res: ApiResponse,
): Promise<AuthedUser | null> => {
  const user = await requireUser(req, res);
  if (!user) return null;
  if (user.role !== 'admin') {
    json(res, 403, { error: 'Admin access required.' });
    return null;
  }
  return user;
};
