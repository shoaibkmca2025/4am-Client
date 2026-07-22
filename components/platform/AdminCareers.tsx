import React, { useCallback, useEffect, useState } from 'react';
import { apiFetch, ApiError } from '../../lib/platform/api';
import { Badge, Button, Card, EmptyState, Field, Notice, SectionLabel, Spinner } from './ui';

interface Opening {
  id: string; title: string; slug: string; department: string | null; location: string | null;
  employment_type: string; status: 'draft' | 'open' | 'closed';
  job_applications?: { count: number }[];
}
interface Application {
  id: string; name: string; email: string; phone: string | null; portfolio_url: string | null;
  resume_url: string | null; cover_note: string | null; created_at: string;
  status: 'new' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';
  job_openings: { title: string } | null;
}

const STAGES = ['new', 'reviewing', 'shortlisted', 'rejected', 'hired'] as const;
const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 120);

const stageTone = (s: Application['status']) =>
  s === 'hired' ? 'valid' : s === 'rejected' ? 'revoked' : s === 'new' ? 'pending' : 'neutral';

const AdminCareers: React.FC = () => {
  const [openings, setOpenings] = useState<Opening[] | null>(null);
  const [apps, setApps] = useState<Application[] | null>(null);
  const [title, setTitle] = useState('');
  const [dept, setDept] = useState('');
  const [loc, setLoc] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: 'error' | 'success'; text: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const [o, a] = await Promise.all([
        apiFetch<{ openings: Opening[] }>('/api/admin/openings'),
        apiFetch<{ applications: Application[] }>('/api/admin/applications'),
      ]);
      setOpenings(o.openings ?? []);
      setApps(a.applications ?? []);
    } catch (err) {
      setMsg({ tone: 'error', text: err instanceof ApiError ? err.message : 'Could not load careers data.' });
      setOpenings([]); setApps([]);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const createOpening = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      await apiFetch('/api/admin/openings', {
        method: 'POST',
        body: { title: title.trim(), slug: slugify(title), department: dept.trim(), location: loc.trim(), status: 'draft' },
      });
      setTitle(''); setDept(''); setLoc('');
      setMsg({ tone: 'success', text: 'Draft created. Open it to publish at /careers.' });
      await load();
    } catch (err) {
      setMsg({ tone: 'error', text: err instanceof ApiError ? err.message : 'Could not create.' });
    } finally { setBusy(false); }
  };

  const cycleStatus = async (o: Opening) => {
    const next = o.status === 'draft' ? 'open' : o.status === 'open' ? 'closed' : 'open';
    try {
      await apiFetch('/api/admin/openings', { method: 'PATCH', body: { id: o.id, status: next } });
      await load();
    } catch (err) {
      setMsg({ tone: 'error', text: err instanceof ApiError ? err.message : 'Could not update.' });
    }
  };

  const setStage = async (id: string, status: Application['status']) => {
    try {
      await apiFetch('/api/admin/applications', { method: 'PATCH', body: { id, status } });
      setApps((prev) => prev?.map((a) => (a.id === id ? { ...a, status } : a)) ?? null);
    } catch (err) {
      setMsg({ tone: 'error', text: err instanceof ApiError ? err.message : 'Could not update.' });
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-8">
      <div>
        <SectionLabel>Openings</SectionLabel>
        {msg && <div className="mb-5"><Notice tone={msg.tone}>{msg.text}</Notice></div>}
        {openings === null ? <Spinner /> : (
          <div className="space-y-2 mb-8">
            {openings.length === 0 && <p className="text-white/40 text-sm mb-4">No roles yet.</p>}
            {openings.map((o) => (
              <Card key={o.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-bold text-white text-sm">{o.title}</div>
                    <div className="text-white/35 text-[11px] mt-0.5">
                      {[o.department, o.location, o.employment_type].filter(Boolean).join(' · ')}
                      {' · '}{o.job_applications?.[0]?.count ?? 0} applicant{(o.job_applications?.[0]?.count ?? 0) === 1 ? '' : 's'}
                    </div>
                  </div>
                  <Badge tone={o.status === 'open' ? 'valid' : o.status === 'closed' ? 'revoked' : 'neutral'}>{o.status}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => cycleStatus(o)}
                    className="rounded-full border border-white/[0.12] px-4 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-white/50 hover:border-white/40 hover:text-white transition-colors duration-300"
                  >
                    {o.status === 'draft' ? 'Publish' : o.status === 'open' ? 'Close' : 'Reopen'}
                  </button>
                  {o.status === 'open' && (
                    <a href={`/careers/${o.slug}`} target="_blank" rel="noopener noreferrer"
                      className="rounded-full border border-white/[0.12] px-4 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-white/50 hover:border-white/40 hover:text-white transition-colors duration-300">
                      View
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        <SectionLabel>New opening</SectionLabel>
        <Card>
          <form onSubmit={createOpening} noValidate>
            <Field id="o-title" label="Role title" value={title} onChange={setTitle} required />
            <Field id="o-dept" label="Department" value={dept} onChange={setDept} />
            <Field id="o-loc" label="Location" value={loc} onChange={setLoc} />
            <div className="pt-6">
              <Button type="submit" loading={busy} disabled={title.trim().length < 3}>Create draft</Button>
            </div>
          </form>
          <p className="mt-4 text-white/30 text-[11px]">
            Add the full description and requirements from the API or a follow-up edit — publishing makes the role live at /careers.
          </p>
        </Card>
      </div>

      <div>
        <SectionLabel>Applications</SectionLabel>
        {apps === null ? <Spinner /> : apps.length === 0 ? (
          <EmptyState title="No applications yet">
            Applications from /careers land here with résumé links and pipeline stages.
          </EmptyState>
        ) : (
          <div className="space-y-3">
            {apps.map((a) => (
              <Card key={a.id} className="p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-bold text-white text-sm">{a.name}</div>
                    <div className="text-white/45 text-xs mt-1 break-all">
                      <a href={`mailto:${a.email}`} className="hover:text-white transition-colors">{a.email}</a>
                      {a.phone && <> · {a.phone}</>}
                    </div>
                    <div className="text-white/35 text-[11px] mt-1">
                      {a.job_openings?.title ?? 'General application'} ·{' '}
                      {new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                  <Badge tone={stageTone(a.status)}>{a.status}</Badge>
                </div>

                {a.cover_note && (
                  <p className="mt-3 text-white/60 text-sm leading-relaxed whitespace-pre-wrap">{a.cover_note}</p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {a.resume_url && (
                    <a href={a.resume_url} target="_blank" rel="noopener noreferrer"
                      className="rounded-full border border-brand-secondary/30 px-4 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-brand-secondary/90 hover:border-brand-secondary/60 transition-colors duration-300">
                      Résumé
                    </a>
                  )}
                  {a.portfolio_url && (
                    <a href={a.portfolio_url} target="_blank" rel="noopener noreferrer"
                      className="rounded-full border border-white/[0.12] px-4 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-white/50 hover:border-white/40 hover:text-white transition-colors duration-300">
                      Portfolio
                    </a>
                  )}
                  {STAGES.filter((s) => s !== a.status).map((s) => (
                    <button key={s} onClick={() => setStage(a.id, s)}
                      className="rounded-full border border-white/[0.1] px-4 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-white/40 hover:border-white/40 hover:text-white transition-colors duration-300">
                      {s}
                    </button>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCareers;
