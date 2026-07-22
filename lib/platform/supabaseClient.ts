import { createClient } from '@supabase/supabase-js';

// Browser client. Uses the PUBLISHABLE key only — every query it makes is
// filtered by Row-Level Security. The service-role key must never appear
// in client code (see lib/server/env.ts).
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = createClient(url ?? 'http://localhost', anonKey ?? 'missing', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: '4am-auth',
  },
});
