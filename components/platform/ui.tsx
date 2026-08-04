import React from 'react';

// Brand primitives for the platform surfaces (admin / portal / verify).
// Warm "Organic" theme: cream ground, terracotta accent, sage/ink support —
// matching the marketing site's editorial redesign. Caprasimo display,
// Figtree body (both inherited globally).

const SERIF = { fontFamily: 'Caprasimo, Georgia, serif' } as const;

export const PageShell: React.FC<{
  eyebrow: string;
  title: string;
  titleAccent?: string;
  intro?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}> = ({ eyebrow, title, titleAccent, intro, actions, children }) => (
  <div className="bg-[#f5ead8] min-h-screen text-[#201e1d] pt-[70px] md:pt-[80px]">
    <section className="relative py-12 md:py-16 border-b border-[#201e1d]/10">
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10">
        <span className="text-[10px] md:text-[11px] font-semibold tracking-[0.32em] uppercase text-[#8c491a] block mb-5">
          {eyebrow}
        </span>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h1 style={SERIF} className="text-[8vw] md:text-[4vw] lg:text-[3vw] tracking-[-0.01em] leading-[1.02]">
            {title}
            {titleAccent && <> <span className="text-[#c67139]">{titleAccent}</span></>}
          </h1>
          {actions}
        </div>
        {intro && (
          <p className="mt-5 text-[#201e1d]/65 text-base leading-relaxed font-medium max-w-2xl">{intro}</p>
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
  <div className={`rounded-2xl border border-[#201e1d]/10 bg-[#ebddc5] p-6 md:p-8 ${className}`}>
    {children}
  </div>
);

export const SectionLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <h2 className={`text-[10px] font-semibold tracking-[0.28em] uppercase text-[#201e1d]/45 mb-4 ${className}`}>
    {children}
  </h2>
);

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'solid' | 'line'; loading?: boolean }
> = ({ variant = 'solid', loading, children, className = '', disabled, ...rest }) => {
  const base =
    'inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full text-[11px] font-semibold tracking-[0.18em] uppercase transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed';
  const styles =
    variant === 'solid'
      ? 'bg-[#c67139] text-[#f5ead8] hover:bg-[#b2622d]'
      : 'border border-[#201e1d]/15 text-[#201e1d]/70 hover:border-[#201e1d]/40 hover:text-[#201e1d]';
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
        error ? 'border-red-500/60' : 'border-[#201e1d]/15'
      } px-0 pt-6 pb-3 text-[#201e1d] text-base md:text-sm placeholder-transparent focus:outline-none focus:border-[#c67139] transition-all duration-300 font-medium`}
    />
    <label
      htmlFor={id}
      className="absolute left-0 top-0 text-[9px] font-semibold tracking-[0.2em] uppercase text-[#201e1d]/55 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-[#201e1d]/45 peer-focus:top-0 peer-focus:text-[9px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:text-[#8c491a]"
    >
      {label}
      {required && ' *'}
    </label>
    {error && <p className="text-red-600 text-[10px] mt-1">{error}</p>}
  </div>
);

export const Badge: React.FC<{ tone: 'valid' | 'revoked' | 'pending' | 'neutral'; children: React.ReactNode }> = ({
  tone,
  children,
}) => {
  const tones = {
    valid: 'border-[#7a8a5e]/45 bg-[#7a8a5e]/12 text-[#56633f]',
    revoked: 'border-red-500/40 bg-red-500/10 text-red-600',
    pending: 'border-[#c67139]/40 bg-[#c67139]/12 text-[#8c491a]',
    neutral: 'border-[#201e1d]/15 bg-[#201e1d]/[0.04] text-[#201e1d]/60',
  };
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.15em] uppercase ${tones[tone]}`}
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
    error: 'border-red-500/30 bg-red-500/[0.08] text-red-700',
    success: 'border-[#7a8a5e]/35 bg-[#7a8a5e]/[0.1] text-[#56633f]',
    info: 'border-[#201e1d]/12 bg-[#201e1d]/[0.03] text-[#201e1d]/70',
  };
  return (
    <div className={`rounded-xl border px-5 py-4 text-sm font-medium ${tones[tone]}`} role="status">
      {children}
    </div>
  );
};

export const EmptyState: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-2xl border border-dashed border-[#201e1d]/15 px-6 py-16 text-center">
    <p className="text-[#201e1d]/70 font-semibold uppercase tracking-[0.1em] text-sm">{title}</p>
    {children && <p className="mt-2 text-[#201e1d]/45 text-sm max-w-md mx-auto">{children}</p>}
  </div>
);

export const Spinner: React.FC<{ label?: string }> = ({ label = 'Loading…' }) => (
  <div className="flex items-center justify-center gap-3 py-16 text-[#201e1d]/45 text-sm">
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="opacity-20" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
    {label}
  </div>
);
