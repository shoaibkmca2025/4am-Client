import React, { useCallback, useEffect, useState } from 'react';
import { apiFetch, ApiError } from '../../lib/platform/api';
import { Badge, Button, Card, EmptyState, Field, Notice, SectionLabel, Spinner } from './ui';

interface Post {
  id: string; title: string; slug: string; excerpt: string | null;
  status: 'draft' | 'published'; published_at: string | null;
  tags: string[]; reading_minutes: number | null; created_at: string;
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 120);

const AdminPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: 'error' | 'success'; text: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const d = await apiFetch<{ posts: Post[] }>('/api/admin/posts');
      setPosts(d.posts ?? []);
    } catch (err) {
      setMsg({ tone: 'error', text: err instanceof ApiError ? err.message : 'Could not load posts.' });
      setPosts([]);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const effectiveSlug = slugTouched ? slug : slugify(title);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      await apiFetch('/api/admin/posts', {
        method: 'POST',
        body: {
          title: title.trim(),
          slug: effectiveSlug,
          excerpt: excerpt.trim(),
          content: content.trim(),
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 12),
          status: 'draft',
        },
      });
      setTitle(''); setSlug(''); setSlugTouched(false); setExcerpt(''); setContent(''); setTags('');
      setMsg({ tone: 'success', text: 'Saved as a draft. Publish it to make it live at /blog.' });
      await load();
    } catch (err) {
      setMsg({ tone: 'error', text: err instanceof ApiError ? err.message : 'Could not save.' });
    } finally { setBusy(false); }
  };

  const togglePublish = async (p: Post) => {
    try {
      await apiFetch('/api/admin/posts', {
        method: 'PATCH',
        body: { id: p.id, status: p.status === 'published' ? 'draft' : 'published' },
      });
      await load();
    } catch (err) {
      setMsg({ tone: 'error', text: err instanceof ApiError ? err.message : 'Could not update.' });
    }
  };

  const remove = async (p: Post) => {
    if (!window.confirm(`Delete “${p.title}”? This cannot be undone.`)) return;
    try {
      await apiFetch('/api/admin/posts', { method: 'DELETE', body: { id: p.id } });
      await load();
    } catch (err) {
      setMsg({ tone: 'error', text: err instanceof ApiError ? err.message : 'Could not delete.' });
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[440px_1fr] gap-8">
      <div>
        <SectionLabel>New article</SectionLabel>
        <Card>
          <form onSubmit={create} noValidate>
            <Field id="p-title" label="Title" value={title} onChange={setTitle} required />
            <Field
              id="p-slug"
              label="URL slug"
              value={effectiveSlug}
              onChange={(v) => { setSlugTouched(true); setSlug(slugify(v)); }}
            />
            <p className="mt-1 mb-2 text-[#201e1d]/50 text-[11px] font-mono break-all">
              /blog/{effectiveSlug || '…'}
            </p>
            <Field id="p-excerpt" label="Excerpt (shown in listings)" value={excerpt} onChange={setExcerpt} />
            <Field id="p-tags" label="Tags (comma separated)" value={tags} onChange={setTags} />

            <div className="relative mt-2">
              <textarea
                id="p-content"
                rows={12}
                value={content}
                onChange={(e) => setContent(e.currentTarget.value)}
                placeholder=" "
                className="peer w-full bg-transparent border-b border-[#201e1d]/10 px-0 pt-6 pb-3 text-[#201e1d] text-base md:text-sm placeholder-transparent focus:outline-none focus:border-brand-primary/40 transition-all duration-300 font-medium resize-y font-mono"
              />
              <label
                htmlFor="p-content"
                className="absolute left-0 top-0 text-[9px] font-bold tracking-[0.2em] uppercase text-[#201e1d]/60 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-[#201e1d]/55 peer-focus:top-0 peer-focus:text-[9px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:text-[#8c491a]"
              >
                Content
              </label>
            </div>
            <p className="mt-2 text-[#201e1d]/50 text-[11px] leading-relaxed">
              Supports <code className="text-[#201e1d]/60">## Heading</code>,{' '}
              <code className="text-[#201e1d]/60">**bold**</code>, <code className="text-[#201e1d]/60">*italic*</code>,{' '}
              <code className="text-[#201e1d]/60">[link](url)</code>, <code className="text-[#201e1d]/60">`code`</code> and{' '}
              <code className="text-[#201e1d]/60">- bullets</code>.
            </p>

            <div className="pt-6">
              <Button type="submit" loading={busy} disabled={title.trim().length < 3 || !effectiveSlug}>
                Save draft
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <div>
        <SectionLabel>Articles</SectionLabel>
        {msg && <div className="mb-5"><Notice tone={msg.tone}>{msg.text}</Notice></div>}

        {posts === null ? <Spinner /> : posts.length === 0 ? (
          <EmptyState title="No articles yet">
            Write your first article on the left. Published articles appear at /blog.
          </EmptyState>
        ) : (
          <div className="space-y-3">
            {posts.map((p) => (
              <Card key={p.id} className="p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-bold text-[#201e1d] text-sm">{p.title}</div>
                    <div className="text-[#201e1d]/50 text-[11px] mt-1 font-mono break-all">/blog/{p.slug}</div>
                    {p.excerpt && <p className="text-[#201e1d]/60 text-xs mt-2 max-w-xl">{p.excerpt}</p>}
                  </div>
                  <Badge tone={p.status === 'published' ? 'valid' : 'neutral'}>
                    {p.status === 'published' ? 'Live' : 'Draft'}
                  </Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => togglePublish(p)}
                    className="rounded-full border border-[#201e1d]/12 px-4 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-[#201e1d]/60 hover:border-[#201e1d]/30 hover:text-[#201e1d] transition-colors duration-300"
                  >
                    {p.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  {p.status === 'published' && (
                    <a
                      href={`/blog/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-[#201e1d]/12 px-4 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-[#201e1d]/60 hover:border-[#201e1d]/30 hover:text-[#201e1d] transition-colors duration-300"
                    >
                      View
                    </a>
                  )}
                  <button
                    onClick={() => remove(p)}
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

export default AdminPosts;
