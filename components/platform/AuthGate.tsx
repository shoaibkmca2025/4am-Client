import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/platform/supabaseClient';
import { Button, Card, Field, Notice, PageShell } from './ui';

// Sign-in / sign-up for the platform surfaces.
// Registration is OPEN: an account with no claimed enrollment can see
// nothing (RLS), and the claim key already gates everything of value.
const AuthGate: React.FC<{ eyebrow: string; title: string; titleAccent?: string; intro?: string }> = ({
  eyebrow, title, titleAccent, intro,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  if (!isSupabaseConfigured) {
    return (
      <PageShell eyebrow={eyebrow} title={title} titleAccent={titleAccent}>
        <Notice tone="error">
          Sign-in is not configured yet. Add <code>VITE_SUPABASE_URL</code> and{' '}
          <code>VITE_SUPABASE_ANON_KEY</code> to the environment and redeploy.
        </Notice>
      </PageShell>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setInfo('');
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setBusy(true);
    try {
      if (mode === 'signup') {
        const { error: err } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: fullName.trim() } },
        });
        if (err) throw err;
        setInfo('Account created. If email confirmation is on, check your inbox — otherwise sign in below.');
        setMode('signin');
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (err) throw err;
        // onAuthStateChange re-renders the parent — nothing else to do.
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Sign in failed.';
      setError(/invalid login/i.test(msg) ? 'Incorrect email or password.' : msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell eyebrow={eyebrow} title={title} titleAccent={titleAccent} intro={intro}>
      <div className="max-w-md">
        <Card>
          <form onSubmit={submit} noValidate className="space-y-1">
            {error && <div className="mb-5"><Notice tone="error">{error}</Notice></div>}
            {info && <div className="mb-5"><Notice tone="success">{info}</Notice></div>}

            {mode === 'signup' && (
              <Field id="auth-name" label="Full name" value={fullName} onChange={setFullName} autoComplete="name" />
            )}
            <Field id="auth-email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
            <Field
              id="auth-password" label="Password" type="password" value={password} onChange={setPassword}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} required
            />

            <div className="pt-8">
              <Button type="submit" loading={busy} className="w-full">
                {mode === 'signin' ? 'Sign in' : 'Create account'}
              </Button>
            </div>
          </form>

          <button
            type="button"
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setInfo(''); }}
            className="mt-6 text-[#201e1d]/55 text-[10px] font-bold uppercase tracking-[0.25em] hover:text-[#201e1d] transition-colors"
          >
            {mode === 'signin' ? 'Need an account? Register →' : 'Already registered? Sign in →'}
          </button>
        </Card>
      </div>
    </PageShell>
  );
};

export default AuthGate;
