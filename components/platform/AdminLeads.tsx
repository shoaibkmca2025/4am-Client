import React, { useCallback, useEffect, useState } from 'react';
import { apiFetch, ApiError } from '../../lib/platform/api';
import { Badge, Card, EmptyState, Notice, SectionLabel, Spinner } from './ui';

interface Lead {
  id: string; name: string; email: string; phone: string | null; company: string | null;
  service: string | null; budget: string | null; message: string; source: string;
  status: 'new' | 'contacted' | 'closed'; created_at: string;
}

const STATUSES = ['new', 'contacted', 'closed'] as const;

const AdminLeads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLeads(null);
    try {
      const qs = filter === 'all' ? '' : `?status=${filter}`;
      const d = await apiFetch<{ leads: Lead[] }>(`/api/admin/leads${qs}`);
      setLeads(d.leads ?? []);
      setError('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load enquiries.');
      setLeads([]);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const setStatus = async (id: string, status: Lead['status']) => {
    try {
      await apiFetch('/api/admin/leads', { method: 'PATCH', body: { id, status } });
      setLeads((prev) => prev?.map((l) => (l.id === id ? { ...l, status } : l)) ?? null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not update.');
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {(['all', ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-4 py-2 text-[10px] font-bold tracking-[0.15em] uppercase transition-colors duration-300 ${
              filter === s
                ? 'border-brand-primary/50 bg-brand-primary/[0.08] text-[#8c491a]'
                : 'border-[#201e1d]/12 bg-[#ebddc5] text-[#201e1d]/60 hover:text-[#201e1d]/80'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {error && <div className="mb-5"><Notice tone="error">{error}</Notice></div>}

      {leads === null ? <Spinner /> : leads.length === 0 ? (
        <EmptyState title="No enquiries here">
          Messages sent through the website contact form appear in this inbox.
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {leads.map((l) => (
            <Card key={l.id} className="p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-bold text-[#201e1d] text-sm">{l.name}</div>
                  <div className="text-[#201e1d]/60 text-xs mt-1 break-all">
                    <a href={`mailto:${l.email}`} className="hover:text-[#201e1d] transition-colors">{l.email}</a>
                    {l.phone && <> · <a href={`tel:${l.phone}`} className="hover:text-[#201e1d] transition-colors">{l.phone}</a></>}
                  </div>
                  {(l.company || l.service || l.budget) && (
                    <div className="text-[#201e1d]/50 text-[11px] mt-1.5">
                      {[l.company, l.service, l.budget].filter(Boolean).join(' · ')}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={l.status === 'new' ? 'pending' : l.status === 'contacted' ? 'neutral' : 'valid'}>
                    {l.status}
                  </Badge>
                  <span className="text-[#201e1d]/45 text-[11px]">
                    {new Date(l.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-[#201e1d]/70 text-sm leading-relaxed whitespace-pre-wrap">{l.message}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {STATUSES.filter((s) => s !== l.status).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(l.id, s)}
                    className="rounded-full border border-[#201e1d]/12 px-4 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-[#201e1d]/60 hover:border-[#201e1d]/30 hover:text-[#201e1d] transition-colors duration-300"
                  >
                    Mark {s}
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default AdminLeads;
