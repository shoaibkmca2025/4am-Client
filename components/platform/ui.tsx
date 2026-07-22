import React from 'react';

// Brand primitives for the platform surfaces (admin / portal / verify).
// Every value here is lifted from the existing marketing design — the
// tailwind `brand` palette, the rounded-2xl + white/[0.08] card, the
// gradient pill button, the 0.35em-tracked eyebrow. No new design system
// (design.md §3).

export const PageShell: React.FC<{
  eyebrow: string;
  title: string;
  titleAccent?: string;
  intro?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}> = ({ eyebrow, title, titleAccent, intro, actions, children }) => (
  <div className="bg-black min-h-screen text-white pt-[70px] md:pt-[80px]">
    <section className="relative py-12 md:py-16 border-b border-white/[0.07]">
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10">
        <span className="text-[10px] md:text-[11px] font-bold tracking-[0.35em] uppercase text-brand-primary/80 block mb-5">
          {eyebrow}
        </span>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h1 className="text-[9vw] md:text-[4.2vw] lg:text-[3.2vw] font-black uppercase tracking-[-0.03em] leading-[0.95]">
            {title}
            {titleAccent && <> <span className="text-gradient-brand">{titleAccent}</span></>}
          </h1>
          {actions}
        </div>
        {intro && (
          <p className="mt-5 text-white/60 text-base leading-relaxed font-medium max-w-2xl">{intro}</p>
        )}
      </div>
    </section>
    <section className="py-10 md:py-14">
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10">{children}</div>
    </section>
  </div>
);

export const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = '',
  children,
}) => (
  <div className={`rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8 ${className}`}>
    {children}
  </div>
);

export const SectionLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <h2 className={`text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 mb-4 ${className}`}>
    {children}
  </h2>
);

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'solid' | 'line'; loading?: boolean }
> = ({ variant = 'solid', loading, children, className = '', disabled, ...rest }) => {
  const base =
    'inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed';
  const styles =
    variant === 'solid'
      ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-black hover:brightness-110 hover:shadow-[0_0_30px_rgba(255,106,61,0.35)]'
      : 'border border-white/[0.14] text-white/70 hover:border-white/40 hover:text-white';
  return (
    <button className={`${base} ${styles} ${className}`} disabled={disabled || loading} {...rest}>
      {loading && (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="opacity-20" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
      {children}
    </button>
  );
};

/** Floating-label input — same peer pattern as the contact form. */
export const Field: React.FC<{
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: string;
  required?: boolean;
  className?: string;
}> = ({ id, label, type = 'text', value, onChange, error, autoComplete, required, className = '' }) => (
  <div className={`relative ${className}`}>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      placeholder=" "
      autoComplete={autoComplete}
      aria-required={required}
      aria-invalid={!!error}
      className={`peer w-full bg-transparent border-b ${
        error ? 'border-red-500/50' : 'border-white/[0.08]'
      } px-0 pt-6 pb-3 text-white text-base md:text-sm placeholder-transparent focus:outline-none focus:border-brand-primary/40 transition-all duration-300 font-medium`}
    />
    <label
      htmlFor={id}
      className="absolute left-0 top-0 text-[9px] font-bold tracking-[0.2em] uppercase text-white/50 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-white/40 peer-focus:top-0 peer-focus:text-[9px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:text-brand-secondary"
    >
      {label}
      {required && ' *'}
    </label>
    {error && <p className="text-red-400 text-[10px] mt-1">{error}</p>}
  </div>
);

export const Badge: React.FC<{ tone: 'valid' | 'revoked' | 'pending' | 'neutral'; children: React.ReactNode }> = ({
  tone,
  children,
}) => {
  const tones = {
    valid: 'border-brand-lime/40 bg-brand-lime/10 text-brand-lime',
    revoked: 'border-red-500/40 bg-red-500/10 text-red-400',
    pending: 'border-brand-secondary/40 bg-brand-secondary/10 text-brand-secondary',
    neutral: 'border-white/[0.12] bg-white/[0.03] text-white/60',
  };
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase ${tones[tone]}`}
    >
      {children}
    </span>
  );
};

export const Notice: React.FC<{ tone: 'error' | 'success' | 'info'; children: React.ReactNode }> = ({
  tone,
  children,
}) => {
  const tones = {
    error: 'border-red-500/30 bg-red-500/[0.06] text-red-300',
    success: 'border-brand-lime/30 bg-brand-lime/[0.06] text-brand-lime',
    info: 'border-white/[0.1] bg-white/[0.03] text-white/70',
  };
  return (
    <div className={`rounded-xl border px-5 py-4 text-sm font-medium ${tones[tone]}`} role="status">
      {children}
    </div>
  );
};

export const EmptyState: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-2xl border border-dashed border-white/[0.1] px-6 py-16 text-center">
    <p className="text-white/70 font-bold uppercase tracking-[0.1em] text-sm">{title}</p>
    {children && <p className="mt-2 text-white/40 text-sm max-w-md mx-auto">{children}</p>}
  </div>
);

export const Spinner: React.FC<{ label?: string }> = ({ label = 'Loading…' }) => (
  <div className="flex items-center justify-center gap-3 py-16 text-white/40 text-sm">
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="opacity-20" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
    {label}
  </div>
);
