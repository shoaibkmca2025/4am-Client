import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/platform/supabaseClient';

export type Role = 'admin' | 'staff' | 'student';

export interface SessionState {
  loading: boolean;
  session: Session | null;
  role: Role | null;
  fullName: string | null;
}

/**
 * Current auth session + the role read from `profiles`.
 * The role is advisory for UI only — every API route re-derives it
 * server-side, and RLS enforces it again in the database.
 */
export const useSession = (): SessionState & { signOut: () => Promise<void> } => {
  const [state, setState] = useState<SessionState>({
    loading: true, session: null, role: null, fullName: null,
  });

  useEffect(() => {
    let active = true;

    const hydrate = async (session: Session | null) => {
      if (!session) {
        if (active) setState({ loading: false, session: null, role: null, fullName: null });
        return;
      }
      const { data } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', session.user.id)
        .maybeSingle();
      if (!active) return;
      setState({
        loading: false,
        session,
        role: (data?.role as Role) ?? 'student',
        fullName: data?.full_name ?? null,
      });
    };

    supabase.auth.getSession().then(({ data }) => hydrate(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => { hydrate(session); });

    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);

  const signOut = async () => { await supabase.auth.signOut(); };

  return { ...state, signOut };
};
