import React, { useCallback, useEffect, useState } from 'react';
import { apiFetch, ApiError } from '../../lib/platform/api';
import { useSession } from './useSession';
import AuthGate from './AuthGate';
import { Badge, Button, Card, EmptyState, Field, Notice, PageShell, SectionLabel, Spinner } from './ui';

interface CertificateRow { id: string; certificate_serial: string; issue_date: string; status: 'active' | 'revoked' }
interface EnrollmentRow {
  id: string;
  claim_status: 'pending' | 'claimed';
  claimed_at: string | null;
  courses: { title: string; start_date: string | null; end_date: string | null; venue: string | null; college: string | null } | null;
  certificates: CertificateRow | CertificateRow[] | null;
}

const one = <T,>(v: T | T[] | null): T | null => (Array.isArray(v) ? v[0] ?? null : v);

const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null;

const StudentPortal: React.FC = () => {
  const { loading, session, fullName, signOut } = useSession();
  const [rows, setRows] = useState<EnrollmentRow[] | null>(null);
  const [loadError, setLoadError] = useState('');
  const [claimKey, setClaimKey] = useState('');
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [claimOk, setClaimOk] = useState('');
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => { document.title = 'My Certificates | 4AM Global Media'; }, []);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ enrollments: EnrollmentRow[] }>('/api/portal/certificates');
      setRows(data.enrollments ?? []);
      setLoadError('');
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : 'Could not load your certificates.');
      setRows([]);
    }
  }, []);

  useEffect(() => { if (session) load(); }, [session, load]);

  if (loading) return <div className="bg-[#f5ead8] min-h-screen pt-[70px] md:pt-[80px]"><Spinner /></div>;
  if (!session) {
    return (
      <AuthGate
        eyebrow="Student Portal"
        title="YOUR"
        titleAccent="CERTIFICATES"
        intro="Sign in to claim and download the certificate for your 4AM Global Media workshop."
      />
    );
  }

  const claim = async (e: React.FormEvent) => {
    e.preventDefault();
    setClaimError(''); setClaimOk('');
    setClaiming(true);
    try {
      await apiFetch('/api/portal/claim', { method: 'POST', body: { claimKey: claimKey.trim().toUpperCase() } });
      setClaimOk('Certificate claimed. It now appears below.');
      setClaimKey('');
      await load();
    } catch (err) {
      setClaimError(err instanceof ApiError ? err.message : 'Could not claim that key.');
    } finally {
      setClaiming(false);
    }
  };

  const download = async (certId: string) => {
    setDownloading(certId);
    try {
      const { url } = await apiFetch<{ url: string }>(`/api/portal/certificates/${certId}/download`);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : 'Download failed.');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <PageShell
      eyebrow="Student Portal"
      title="MY"
      titleAccent="CERTIFICATES"
      intro={fullName ? `Signed in as ${fullName}.` : session.user.email ?? undefined}
      actions={<Button variant="line" onClick={signOut}>Sign out</Button>}
    >
      {/* Claim */}
      <div className="max-w-xl mb-12">
        <SectionLabel>Claim a certificate</SectionLabel>
        <Card>
          <form onSubmit={claim} noValidate>
            <p className="text-[#201e1d]/65 text-sm leading-relaxed mb-4">
              Enter the one-time claim key you received from your instructor.
            </p>
            {claimError && <div className="mb-4"><Notice tone="error">{claimError}</Notice></div>}
            {claimOk && <div className="mb-4"><Notice tone="success">{claimOk}</Notice></div>}
            <Field
              id="claim-key"
              label="Claim key"
              value={claimKey}
              onChange={(v) => setClaimKey(v.toUpperCase())}
              required
            />
            <p className="mt-2 text-[#201e1d]/50 text-[11px] font-mono">Format: 4AM-XXXXX-XXXXX</p>
            <div className="pt-6">
              <Button type="submit" loading={claiming} disabled={!claimKey.trim()}>Claim certificate</Button>
            </div>
          </form>
        </Card>
      </div>

      {/* List */}
      <SectionLabel>Your certificates</SectionLabel>
      {loadError && <div className="mb-5"><Notice tone="error">{loadError}</Notice></div>}
      {rows === null ? (
        <Spinner />
      ) : rows.length === 0 ? (
        <EmptyState title="No certificates yet">
          Once you claim a key above, your certificate will appear here to view and download.
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {rows.map((row) => {
            const cert = one(row.certificates);
            const course = row.courses;
            return (
              <Card key={row.id}>
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-[-0.01em] text-[#201e1d]">
                      {course?.title ?? 'Course'}
                    </h3>
                    {(course?.venue || course?.college) && (
                      <p className="text-[#201e1d]/55 text-xs mt-1.5">
                        {[course?.college, course?.venue].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                  {cert
                    ? <Badge tone={cert.status === 'active' ? 'valid' : 'revoked'}>{cert.status === 'active' ? 'Valid' : 'Revoked'}</Badge>
                    : <Badge tone="pending">Awaiting issue</Badge>}
                </div>

                {cert ? (
                  <>
                    <dl className="grid grid-cols-2 gap-4 text-sm mb-6">
                      <div>
                        <dt className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#201e1d]/50 mb-1">Serial</dt>
                        <dd className="font-mono text-[#201e1d]/80 text-xs break-all">{cert.certificate_serial}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#201e1d]/50 mb-1">Issued</dt>
                        <dd className="text-[#201e1d]/80">{fmt(cert.issue_date) ?? '—'}</dd>
                      </div>
                    </dl>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={() => download(cert.id)}
                        loading={downloading === cert.id}
                        disabled={cert.status !== 'active'}
                      >
                        Download
                      </Button>
                      <a
                        href={`/verify/${cert.certificate_serial}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase border border-[#201e1d]/15 text-[#201e1d]/70 hover:border-[#201e1d]/30 hover:text-[#201e1d] transition-all duration-300"
                      >
                        Public link
                      </a>
                    </div>
                    {cert.status !== 'active' && (
                      <p className="mt-4 text-red-400/80 text-xs">
                        This certificate was revoked and can no longer be downloaded.
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-[#201e1d]/60 text-sm">
                    Your enrollment is confirmed. The certificate will appear here once it has been issued.
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </PageShell>
  );
};

export default StudentPortal;
