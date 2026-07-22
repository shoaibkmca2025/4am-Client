// Server-only environment access. NEVER import this from client code —
// the service-role key bypasses RLS and must not reach the browser bundle.
// (Vite only exposes VITE_-prefixed vars to the client, so a leak would
// also require a client import of this module — don't add one.)

const required = (name: string): string => {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
};

export const env = {
  get supabaseUrl() { return required('SUPABASE_URL'); },
  get supabaseServiceRoleKey() { return required('SUPABASE_SERVICE_ROLE_KEY'); },
  get supabaseAnonKey() { return required('SUPABASE_ANON_KEY'); },
  get serverHmacSecret() { return required('SERVER_HMAC_SECRET'); },
  get resendApiKey() { return process.env.RESEND_API_KEY ?? ''; },       // optional until Phase 2
  get leadNotifyTo() { return process.env.LEAD_NOTIFY_TO ?? ''; },       // optional until Phase 2
  get siteUrl() { return process.env.SITE_URL ?? 'https://4amglobalmedia.com'; },
};

/** Presence flags only (safe for health checks — never values). */
export const envPresence = () => ({
  SUPABASE_URL: !!process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
  SERVER_HMAC_SECRET: !!process.env.SERVER_HMAC_SECRET,
  RESEND_API_KEY: !!process.env.RESEND_API_KEY,
});
