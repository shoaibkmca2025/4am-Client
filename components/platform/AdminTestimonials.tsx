import React, { useCallback, useEffect, useState } from 'react';
import { apiFetch, ApiError } from '../../lib/platform/api';
import { Badge, Button, Card, EmptyState, Field, Notice, SectionLabel, Spinner } from './ui';

interface Testimonial {
  id: string; client_name: string; company: string | null; quote: string;
  rating: number | null; is_published: boolean; sort_order: number;
}

const AdminTestimonials: React.FC = () => {
  const [rows, setRows] = useState<Testimonial[] | null>(null);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [quote, setQuote] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: 'error' | 'success'; text: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const d = await apiFetch<{ testimonials: Testimonial[] }>('/api/admin/testimonials');
      setRows(d.testimonials ?? []);
    } catch (err) {
      setMsg({ tone: 'error', text: err instanceof ApiError ? err.message : 'Could not load.' });
      setRows([]);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      await apiFetch('/api/admin/testimonials', {
        method: 'POST',
        body: { client_name: name.trim(), company: company.trim(), quote: quote.trim(), is_published: false, sort_order: rows?.length ?? 0 },
      });
      setName(''); setCompany(''); setQuote('');
      setMsg({ tone: 'success', text: 'Saved as a draft. Publish it to show it on the website.' });
      await load();
    } catch (err) {
      setMsg({ tone: 'error', text: err instanceof ApiError ? err.message : 'Could not save.' });
    } finally { setBusy(false); }
  };

  const togglePublish = async (t: Testimonial) => {
    try {
      await apiFetch('/api/admin/testimonials', { method: 'PATCH', body: { id: t.id, is_published: !t.is_published } });
      await load();
    } catch (err) {
      setMsg({ tone: 'error', text: err instanceof ApiError ? err.message : 'Could not update.' });
    }
  };

  const remove = async (t: Testimonial) => {
    if (!window.confirm(`Delete the testimonial from ${t.client_name}?`)) return;
    try {
      await apiFetch('/api/admin/testimonials', { method: 'DELETE', body: { id: t.id } });
      await load();
    } catch (err) {
      setMsg({ tone: 'error', text: err instanceof ApiError ? err.message : 'Could not delete.' });
    }
  };

  const publishedCount = rows?.filter((r) => r.is_published).length ?? 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
      <div>
        <SectionLabel>Add testimonial</SectionLabel>
        <Card>
          <form onSubmit={create} noValidate>
            <Field id="t-name" label="Client name" value={name} onChange={setName} required />
            <Field id="t-company" label="Company / role" value={company} onChange={setCompany} />
            <div className="relative mt-2">
              <textarea
                id="t-quote"
                rows={5}
                value={quote}
                onChange={(e) => setQuote(e.currentTarget.value)}
                placeholder=" "
                className="peer w-full bg-transparent border-b border-white/[0.08] px-0 pt-6 pb-3 text-white text-base md:text-sm placeholder-transparent focus:outline-none focus:border-brand-primary/40 transition-all duration-300 font-medium resize-none"
              />
              <label
                htmlFor="t-quote"
                className="absolute left-0 top-0 text-[9px] font-bold tracking-[0.2em] uppercase text-white/50 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-white/40 peer-focus:top-0 peer-focus:text-[9px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:text-brand-secondary"
              >
                Quote *
              </label>
            </div>
            <div className="pt-6">
              <Button type="submit" loading={busy} disabled={name.trim().length < 2 || quote.trim().length < 10}>
                Save draft
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <div>
        <SectionLabel>
          Published on the website ({publishedCount}){publishedCount === 0 && ' — site is showing its default quotes'}
        </SectionLabel>
        {msg && <div className="mb-5"><Notice tone={msg.tone}>{msg.text}</Notice></div>}

        {rows === null ? <Spinner /> : rows.length === 0 ? (
          <EmptyState title="No testimonials yet">
            Until you publish at least one, the website keeps showing its original built-in quotes.
          </EmptyState>
        ) : (
          <div className="space-y-3">
            {rows.map((t) => (
              <Card key={t.id} className="p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="font-bold text-white text-sm">{t.client_name}</div>
                    {t.company && <div className="text-white/40 text-xs mt-0.5">{t.company}</div>}
                  </div>
                  <Badge tone={t.is_published ? 'valid' : 'neutral'}>{t.is_published ? 'Live' : 'Draft'}</Badge>
                </div>
                <p className="text-white/65 text-sm leading-relaxed italic">“{t.quote}”</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => togglePublish(t)}
                    className="rounded-full border border-white/[0.12] px-4 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-white/50 hover:border-white/40 hover:text-white transition-colors duration-300"
                  >
                    {t.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => remove(t)}
                    className="rounded-full border border-red-500/25 px-4 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-red-400/70 hover:border-red-500/60 hover:text-red-300 transition-colors duration-300"
                  >
                    Delete
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTestimonials;
