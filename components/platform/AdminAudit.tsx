import React, { useCallback, useEffect, useState } from 'react';
import { apiFetch, ApiError } from '../../lib/platform/api';
import { Card, EmptyState, Notice, Spinner } from './ui';

interface Entry {
  id: number; action: string; entity: string; entity_id: string | null;
  meta: Record<string, unknown>; created_at: string; actor: string;
}

const FILTERS: Array<[string, string]> = [
  ['', 'All'],
  ['certificate', 'Certificates'],
  ['enrollment', 'Enrolments'],
  ['course', 'Courses'],
  ['lead', 'Enquiries'],
  ['post', 'Articles'],
  ['testimonial', 'Testimonials'],
];

// Colour by risk: destructive actions stand out.
const toneFor = (action: string): string => {
  if (/revoke|delete/.test(action)) return 'text-red-400';
  if (/issue|create|bulk_import/.test(action)) return 'text-[#56633f]';
  if (/claim|download/.test(action)) return 'text-[#3d6a63]';
  return 'text-[#8c491a]';
};

const AdminAudit: React.FC = () => {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setEntries(null);
    try {
      const qs = filter ? `?action=${encodeURIComponent(filter)}` : '';
      const d = await apiFetch<{ entries: Entry[] }>(`/api/admin/audit${qs}`);
      setEntries(d.entries ?? []);
      setError('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load the activity log.');
      setEntries([]);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {FILTERS.map(([value, label]) => (
          <button
            key={value || 'all'}
            onClick={() => setFilter(value)}
            className={`rounded-full border px-4 py-2 text-[10px] font-bold tracking-[0.15em] uppercase transition-colors duration-300 ${
              filter === value
                ? 'border-brand-primary/50 bg-brand-primary/[0.08] text-[#8c491a]'
                : 'border-[#201e1d]/12 bg-[#ebddc5] text-[#201e1d]/60 hover:text-[#201e1d]/80'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && <div className="mb-5"><Notice tone="error">{error}</Notice></div>}

      {entries === null ? <Spinner /> : entries.length === 0 ? (
        <EmptyState title="Nothing recorded yet">
          Issuing, revoking, claiming and publishing actions are logged here with who did them.
        </EmptyState>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="divide-y divide-[#201e1d]/10">
            {entries.map((e) => (
              <div key={e.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-3.5 md:px-6">
                <span className={`font-mono text-xs font-bold ${toneFor(e.action)}`}>{e.action}</span>
                <span className="text-[#201e1d]/60 text-xs">{e.actor}</span>
                {typeof e.meta?.serial === 'string' && (
                  <span className="font-mono text-[11px] text-[#201e1d]/50">{e.meta.serial}</span>
                )}
                {typeof e.meta?.slug === 'string' && (
                  <span className="font-mono text-[11px] text-[#201e1d]/50">/{e.meta.slug}</span>
                )}
                {typeof e.meta?.created === 'number' && (
                  <span className="text-[11px] text-[#201e1d]/50">
                    {e.meta.created} added{typeof e.meta.skipped === 'number' && e.meta.skipped > 0 ? `, ${e.meta.skipped} skipped` : ''}
                  </span>
                )}
                <span className="ml-auto text-[#201e1d]/45 text-[11px] tabular-nums">
                  {new Date(e.created_at).toLocaleString('en-IN', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  );
};

export default AdminAudit;
