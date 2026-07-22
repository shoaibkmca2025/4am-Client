import React, { useCallback, useEffect, useState } from 'react';
import { apiFetch, ApiError } from '../../lib/platform/api';
import { supabase } from '../../lib/platform/supabaseClient';
import { useSession } from './useSession';
import AuthGate from './AuthGate';
import AdminLeads from './AdminLeads';
import AdminTestimonials from './AdminTestimonials';
import AdminPosts from './AdminPosts';
import AdminAudit from './AdminAudit';
import AdminCareers from './AdminCareers';
import { Badge, Button, Card, EmptyState, Field, Notice, PageShell, SectionLabel, Spinner } from './ui';

type Tab = 'certificates' | 'leads' | 'testimonials' | 'posts' | 'careers' | 'audit';
interface Metrics {
  courses: number; students: number; issued: number; claimed: number;
  revoked: number; leadsNew: number; leadsTotal: number; subscribers: number;
}

const MetricStrip: React.FC<{ m: Metrics | null }> = ({ m }) => {
  const items: Array<[string, number | string]> = m
    ? [
        ['Courses', m.courses],
        ['Students', m.students],
        ['Certificates issued', m.issued],
        ['Claimed', `${m.claimed}/${m.students}`],
        ['New enquiries', m.leadsNew],
        ['Subscribers', m.subscribers],
      ]
    : [];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-10">
      {(m ? items : Array.from({ length: 6 }, () => ['', ''] as [string, string])).map(([label, value], i) => (
        <div key={label || i} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-4">
          <div className="text-2xl md:text-3xl font-black tracking-[-0.02em] text-gradient-brand tabular-nums">
            {value === '' ? '—' : value}
          </div>
          <div className="mt-1 text-[9px] font-bold tracking-[0.2em] uppercase text-white/35">
            {label || ' '}
          </div>
        </div>
      ))}
    </div>
  );
};

interface Course {
  id: string; title: string; slug: string; status: string;
  venue: string | null; college: string | null; start_date: string | null; end_date: string | null;
  enrollments?: { count: number }[];
}
interface Cert { id: string; certificate_serial: string; status: 'active' | 'revoked'; issue_date: string }
interface Enrollment {
  id: string; student_name: string; student_email: string;
  claim_status: 'pending' | 'claimed'; claimed_at: string | null; course_id: string;
  certificates: Cert | Cert[] | null;
}

const one = <T,>(v: T | T[] | null): T | null => (Array.isArray(v) ? v[0] ?? null : v);
const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);

const AdminPanel: React.FC = () => {
  const { loading, session, role, fullName, signOut } = useSession();
  const [tab, setTab] = useState<Tab>('certificates');
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [roster, setRoster] = useState<Enrollment[] | null>(null);
  const [banner, setBanner] = useState<{ tone: 'error' | 'success'; text: string } | null>(null);

  // new course
  const [cTitle, setCTitle] = useState('');
  const [cVenue, setCVenue] = useState('');
  const [cCollege, setCCollege] = useState('');
  const [creating, setCreating] = useState(false);

  // new student
  const [sName, setSName] = useState('');
  const [sEmail, setSEmail] = useState('');
  const [adding, setAdding] = useState(false);
  const [revealedKey, setRevealedKey] = useState<{ key: string; student: string } | null>(null);

  // bulk CSV import
  interface BulkRow { name: string; email: string; claimKey: string }
  const [importing, setImporting] = useState(false);
  const [bulkResult, setBulkResult] = useState<{ created: BulkRow[]; skipped: Array<{ row: number; reason: string }> } | null>(null);

  // issue
  const [issuingFor, setIssuingFor] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { document.title = 'Admin | 4AM Global Media'; }, []);

  const loadCourses = useCallback(async () => {
    try {
      const d = await apiFetch<{ courses: Course[] }>('/api/admin/courses');
      setCourses(d.courses ?? []);
      if (!selected && d.courses?.length) setSelected(d.courses[0].id);
    } catch (err) {
      setBanner({ tone: 'error', text: err instanceof ApiError ? err.message : 'Could not load courses.' });
      setCourses([]);
    }
  }, [selected]);

  const loadRoster = useCallback(async (courseId: string) => {
    setRoster(null);
    try {
      const d = await apiFetch<{ enrollments: Enrollment[] }>(`/api/admin/enrollments?course_id=${courseId}`);
      setRoster(d.enrollments ?? []);
    } catch {
      setRoster([]);
    }
  }, []);

  const loadMetrics = useCallback(async () => {
    try {
      const d = await apiFetch<{ metrics: Metrics }>('/api/admin/metrics');
      setMetrics(d.metrics);
    } catch { /* strip shows placeholders */ }
  }, []);

  useEffect(() => {
    if (session && (role === 'admin' || role === 'staff')) { loadCourses(); loadMetrics(); }
  }, [session, role, loadCourses, loadMetrics]);
  useEffect(() => { if (selected) loadRoster(selected); }, [selected, loadRoster]);

  if (loading) return <div className="bg-black min-h-screen pt-[70px] md:pt-[80px]"><Spinner /></div>;
  if (!session) {
    return <AuthGate eyebrow="Admin" title="4AM" titleAccent="ADMIN" intro="Sign in with your staff account to manage courses and certificates." />;
  }
  if (role !== 'admin' && role !== 'staff') {
    return (
      <PageShell eyebrow="Admin" title="ACCESS" titleAccent="RESTRICTED"
        actions={<Button variant="line" onClick={signOut}>Sign out</Button>}>
        <Notice tone="error">
          This account does not have staff access. If you are a student, go to the{' '}
          <a href="/portal" className="underline hover:text-white">student portal</a>.
        </Notice>
      </PageShell>
    );
  }

  const createCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true); setBanner(null);
    try {
      const d = await apiFetch<{ course: Course }>('/api/admin/courses', {
        method: 'POST',
        body: { title: cTitle.trim(), slug: slugify(cTitle), venue: cVenue.trim(), college: cCollege.trim(), status: 'active' },
      });
      setCTitle(''); setCVenue(''); setCCollege('');
      setBanner({ tone: 'success', text: `Course “${d.course.title}” created.` });
      await loadCourses();
      setSelected(d.course.id);
    } catch (err) {
      setBanner({ tone: 'error', text: err instanceof ApiError ? err.message : 'Could not create course.' });
    } finally { setCreating(false); }
  };

  const addStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setAdding(true); setBanner(null); setRevealedKey(null);
    try {
      const d = await apiFetch<{ claimKey: string; enrollment: { student_name: string } }>('/api/admin/enrollments', {
        method: 'POST',
        body: { course_id: selected, student_name: sName.trim(), student_email: sEmail.trim() },
      });
      setRevealedKey({ key: d.claimKey, student: d.enrollment.student_name });
      setSName(''); setSEmail('');
      await loadRoster(selected);
    } catch (err) {
      setBanner({ tone: 'error', text: err instanceof ApiError ? err.message : 'Could not add student.' });
    } finally { setAdding(false); }
  };

  const bulkImport = async (file: File) => {
    if (!selected) return;
    setImporting(true); setBanner(null); setRevealedKey(null);
    try {
      const csv = await file.text();
      const d = await apiFetch<{ created: BulkRow[]; skipped: Array<{ row: number; reason: string }> }>(
        '/api/admin/enrollments-bulk',
        { method: 'POST', body: { course_id: selected, csv } },
      );
      setBulkResult(d);
      await loadRoster(selected);
      await loadMetrics();
    } catch (err) {
      setBanner({ tone: 'error', text: err instanceof ApiError ? err.message : 'Import failed.' });
    } finally { setImporting(false); }
  };

  // Keys can never be recovered from the server — offer a one-time download.
  const downloadKeys = (rows: BulkRow[]) => {
    const csv = ['name,email,claim_key', ...rows.map((r) => `"${r.name}","${r.email}",${r.claimKey}`)].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `claim-keys-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Upload the file to the private bucket, then issue against its path.
  const issueCertificate = async (enrollmentId: string, file: File) => {
    setUploading(true); setBanner(null);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'pdf';
      const path = `certs/${enrollmentId}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('certificates').upload(path, file, {
        contentType: file.type || 'application/pdf', upsert: false,
      });
      if (upErr) throw new Error(upErr.message);

      const d = await apiFetch<{ verifyUrl: string }>('/api/admin/certificates', {
        method: 'POST',
        body: { enrollment_id: enrollmentId, file_path: path, show_file_publicly: false },
      });
      setBanner({ tone: 'success', text: `Certificate issued. Verify at ${d.verifyUrl}` });
      setIssuingFor(null);
      if (selected) await loadRoster(selected);
    } catch (err) {
      setBanner({ tone: 'error', text: err instanceof Error ? err.message : 'Could not issue certificate.' });
    } finally { setUploading(false); }
  };

  const revoke = async (certId: string) => {
    const reason = window.prompt('Reason for revoking this certificate?');
    if (!reason || reason.trim().length < 3) return;
    try {
      await apiFetch('/api/admin/certificates', { method: 'PATCH', body: { action: 'revoke', certificate_id: certId, reason: reason.trim() } });
      setBanner({ tone: 'success', text: 'Certificate revoked.' });
      if (selected) await loadRoster(selected);
    } catch (err) {
      setBanner({ tone: 'error', text: err instanceof ApiError ? err.message : 'Could not revoke.' });
    }
  };

  const activeCourse = courses?.find((c) => c.id === selected) ?? null;

  return (
    <PageShell
      eyebrow="Admin"
      title="COURSES &"
      titleAccent="CERTIFICATES"
      intro={fullName ? `Signed in as ${fullName} (${role}).` : `Signed in as ${role}.`}
      actions={<Button variant="line" onClick={signOut}>Sign out</Button>}
    >
      <MetricStrip m={metrics} />

      {/* Section tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-white/[0.07] pb-4">
        {([
          ['certificates', 'Courses & certificates'],
          ['leads', metrics?.leadsNew ? `Enquiries (${metrics.leadsNew} new)` : 'Enquiries'],
          ['posts', 'Articles'],
          ['careers', 'Careers'],
          ['testimonials', 'Testimonials'],
          ...(role === 'admin' ? [['audit', 'Activity log'] as [Tab, string]] : []),
        ] as Array<[Tab, string]>).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`rounded-full px-5 py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${
              tab === id
                ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-black'
                : 'border border-white/[0.1] text-white/50 hover:text-white/80'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {banner && <div className="mb-6"><Notice tone={banner.tone}>{banner.text}</Notice></div>}

      {tab === 'leads' && <AdminLeads />}
      {tab === 'testimonials' && <AdminTestimonials />}
      {tab === 'posts' && <AdminPosts />}
      {tab === 'careers' && <AdminCareers />}
      {tab === 'audit' && role === 'admin' && <AdminAudit />}
      {tab === 'certificates' && (<>

      {/* One-time claim key reveal */}
      {revealedKey && (
        <div className="mb-8">
          <Card className="border-brand-secondary/40 bg-brand-secondary/[0.04]">
            <SectionLabel className="text-brand-secondary/80">Claim key — shown once</SectionLabel>
            <p className="text-white/70 text-sm mb-4">
              Give this key to <strong className="text-white">{revealedKey.student}</strong>. It is stored only as a
              hash and <strong className="text-white">cannot be shown again</strong>.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <code className="font-mono text-2xl md:text-3xl font-black tracking-[0.08em] text-gradient-brand">
                {revealedKey.key}
              </code>
              <Button variant="line" onClick={() => navigator.clipboard?.writeText(revealedKey.key)}>Copy</Button>
              <Button variant="line" onClick={() => setRevealedKey(null)}>Done</Button>
            </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
        {/* Courses */}
        <div>
          <SectionLabel>Courses</SectionLabel>
          {courses === null ? <Spinner /> : (
            <div className="space-y-2 mb-8">
              {courses.length === 0 && <p className="text-white/40 text-sm">No courses yet.</p>}
              {courses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  className={`w-full text-left rounded-xl border px-5 py-4 transition-colors duration-300 ${
                    selected === c.id
                      ? 'border-brand-primary/50 bg-brand-primary/[0.06]'
                      : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-white text-sm uppercase tracking-[0.02em]">{c.title}</div>
                  <div className="text-white/40 text-xs mt-1">
                    {c.enrollments?.[0]?.count ?? 0} student{(c.enrollments?.[0]?.count ?? 0) === 1 ? '' : 's'} · {c.status}
                  </div>
                </button>
              ))}
            </div>
          )}

          <SectionLabel>New course</SectionLabel>
          <Card>
            <form onSubmit={createCourse} noValidate>
              <Field id="c-title" label="Course title" value={cTitle} onChange={setCTitle} required />
              <Field id="c-college" label="College / client" value={cCollege} onChange={setCCollege} />
              <Field id="c-venue" label="Venue" value={cVenue} onChange={setCVenue} />
              <div className="pt-6">
                <Button type="submit" loading={creating} disabled={cTitle.trim().length < 2}>Create course</Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Roster */}
        <div>
          <SectionLabel>{activeCourse ? `Roster — ${activeCourse.title}` : 'Roster'}</SectionLabel>

          {!activeCourse ? (
            <EmptyState title="Select a course">Create a course, then add students to it.</EmptyState>
          ) : (
            <>
              <Card className="mb-6">
                <form onSubmit={addStudent} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <Field id="s-name" label="Student name" value={sName} onChange={setSName} required />
                  <Field id="s-email" label="Student email" type="email" value={sEmail} onChange={setSEmail} required />
                  <div className="pt-6 md:col-span-2 flex flex-wrap items-center gap-4">
                    <Button type="submit" loading={adding} disabled={!sName.trim() || !sEmail.trim()}>
                      Add student & generate key
                    </Button>
                    <label className="inline-flex items-center gap-3 text-[10px] font-bold tracking-[0.15em] uppercase text-white/45 cursor-pointer hover:text-white/70 transition-colors">
                      or import CSV
                      <input
                        type="file"
                        accept=".csv,text/csv"
                        disabled={importing}
                        onChange={(e) => {
                          const f = e.currentTarget.files?.[0];
                          if (f) bulkImport(f);
                          e.currentTarget.value = '';
                        }}
                        className="text-[10px] file:mr-2 file:rounded-full file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-[10px] file:font-bold file:uppercase file:tracking-[0.15em] file:text-white hover:file:bg-white/20 file:cursor-pointer"
                      />
                      {importing && 'Importing…'}
                    </label>
                  </div>
                </form>
                <p className="mt-4 text-white/30 text-[11px]">
                  CSV columns: <code className="text-white/50">name, email</code> — header row optional, max 500 rows.
                </p>
              </Card>

              {/* Bulk import result — every key shown once, then gone */}
              {bulkResult && (
                <Card className="mb-6 border-brand-secondary/40 bg-brand-secondary/[0.04]">
                  <SectionLabel className="text-brand-secondary/80">
                    Imported {bulkResult.created.length} student{bulkResult.created.length === 1 ? '' : 's'} — keys shown once
                  </SectionLabel>
                  <div className="max-h-72 overflow-y-auto rounded-xl border border-white/[0.08]">
                    <table className="w-full text-left text-xs">
                      <tbody className="divide-y divide-white/[0.06]">
                        {bulkResult.created.map((r) => (
                          <tr key={r.email}>
                            <td className="px-4 py-2.5 text-white/80">{r.name}</td>
                            <td className="px-4 py-2.5 text-white/40 break-all">{r.email}</td>
                            <td className="px-4 py-2.5 font-mono font-bold text-brand-secondary whitespace-nowrap">{r.claimKey}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {bulkResult.skipped.length > 0 && (
                    <p className="mt-3 text-white/45 text-[11px]">
                      Skipped {bulkResult.skipped.length}: {bulkResult.skipped.slice(0, 5).map((s) => `row ${s.row} (${s.reason})`).join(', ')}
                      {bulkResult.skipped.length > 5 && '…'}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button variant="line" onClick={() => downloadKeys(bulkResult.created)}>Download keys as CSV</Button>
                    <Button variant="line" onClick={() => setBulkResult(null)}>Done</Button>
                  </div>
                </Card>
              )}

              {roster === null ? <Spinner /> : roster.length === 0 ? (
                <EmptyState title="No students yet">Add a student above to generate their claim key.</EmptyState>
              ) : (
                <div className="space-y-3">
                  {roster.map((r) => {
                    const cert = one(r.certificates);
                    return (
                      <Card key={r.id} className="p-5 md:p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="font-bold text-white text-sm">{r.student_name}</div>
                            <div className="text-white/40 text-xs mt-0.5 break-all">{r.student_email}</div>
                            {cert && (
                              <div className="font-mono text-[11px] text-white/50 mt-2 break-all">
                                {cert.certificate_serial}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge tone={r.claim_status === 'claimed' ? 'valid' : 'pending'}>
                              {r.claim_status === 'claimed' ? 'Claimed' : 'Key pending'}
                            </Badge>
                            {cert && (
                              <Badge tone={cert.status === 'active' ? 'valid' : 'revoked'}>
                                {cert.status === 'active' ? 'Issued' : 'Revoked'}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-3">
                          {!cert ? (
                            issuingFor === r.id ? (
                              <label className="inline-flex items-center gap-3 text-xs text-white/60">
                                <input
                                  type="file"
                                  accept="application/pdf,image/png,image/jpeg"
                                  disabled={uploading}
                                  onChange={(e) => {
                                    const f = e.currentTarget.files?.[0];
                                    if (f) issueCertificate(r.id, f);
                                  }}
                                  className="text-xs file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-[10px] file:font-bold file:uppercase file:tracking-[0.15em] file:text-white hover:file:bg-white/20"
                                />
                                {uploading && 'Uploading…'}
                              </label>
                            ) : (
                              <Button onClick={() => setIssuingFor(r.id)} className="px-6 py-2.5">
                                Issue certificate
                              </Button>
                            )
                          ) : (
                            <>
                              <a
                                href={`/verify/${cert.certificate_serial}`}
                                target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase border border-white/[0.14] text-white/70 hover:border-white/40 hover:text-white transition-all duration-300"
                              >
                                Verify page
                              </a>
                              {cert.status === 'active' && (
                                <button
                                  onClick={() => revoke(cert.id)}
                                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase border border-red-500/30 text-red-400/80 hover:border-red-500/60 hover:text-red-300 transition-all duration-300"
                                >
                                  Revoke
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      </>)}
    </PageShell>
  );
};

export default AdminPanel;
