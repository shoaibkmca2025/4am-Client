import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

// Service-role client: bypasses RLS. Server-only (see env.ts warning).
let cached: SupabaseClient | null = null;

export const supabaseAdmin = (): SupabaseClient => {
  if (!cached) {
    cached = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
};

/** Client bound to a user's JWT — RLS applies as that user. */
export const supabaseForToken = (accessToken: string): SupabaseClient =>
  createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
