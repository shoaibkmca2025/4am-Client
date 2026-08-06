import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SERVICES, PROJECTS } from '../constants';
import { scrollToSection } from '../utils/scroll';
const SculptureBackground = React.lazy(() => import('./SculptureBackground'));

const HOME_PAGE_TITLE = 'A Creative Network made for today & tomorrow | 4AM Global Media';
const HOME_PAGE_DESCRIPTION =
  '4AM Global Media provides digital marketing and software development services including web and mobile app solutions to help businesses grow online.';

// Marketplaces we onboard brands onto (real list from the onboarding service).
const MARKETPLACES = [
  'Amazon', 'Flipkart', 'Blinkit', 'Zepto', 'Swiggy Instamart',
  'BigBasket', 'JioMart', 'Meesho', 'Myntra', 'Ajio',
  'Nykaa', 'FirstCry', 'ONDC', 'Shopify', 'WooCommerce',
];

// Featured case studies — the six projects that carry a measured result.
const FEATURED_WORK = PROJECTS.filter((p) => p.result).slice(0, 6);

// Leadership — condensed from the full Founder profiles.
const LEADERS = [
  {
    name: 'Vaibhav Pasi',
    role: 'Co-Founder',
    photo: '/assets/vaibhav-pasi.jpg',
    tags: ['Digital Marketing', 'AI Consulting', 'Product Onboarding'],
    bio: 'Technology entrepreneur and growth strategist leading 4AM’s vision — pairing creativity, engineering and business intelligence to scale brands across web, software and the marketplaces.',
    accent: 'accent' as const,
  },
  {
    name: 'Shoaib Khatik',
    role: 'Co-Founder',
    photo: '/assets/shoaib-khatik-web.jpg',
    tags: ['Full-Stack', 'MERN · Python', 'AI Solutions'],
    bio: 'Leads the technology vision and product engineering — building scalable, user-focused digital products with Python, the MERN stack, React Native and cloud technologies.',
    accent: 'accent-2' as const,
  },
  {
    name: 'Abhishek Prasad',
    role: 'Chief Technology Officer',
    photo: '/assets/abhishek-prasad-web.jpg',
    tags: ['Android', 'Java & .NET', 'Product Engineering'],
    bio: 'Owns the technical roadmap and engineering excellence — high-performance mobile and enterprise apps, clean architecture, secure APIs and cloud-ready systems.',
    accent: 'accent' as const,
  },
];

const FEATURED_IN = [
  { name: 'Dailyhunt',              href: 'https://m.dailyhunt.in/news/india/english/punjabbytes-epaper-dhb7faabc774324241990251ac4336f653/-newsid-dhb7faabc774324241990251ac4336f653_9e048369b0044e30a55581dd34c09d1f' },
  { name: 'Smart Bharat News',      href: 'https://www.smartbharatnews.top/2026/05/vaibhav-pasi-visionary-entrepreneur.html' },
  { name: 'National Outlook Daily', href: 'https://www.nationaloutlookdaily.top/2026/05/vaibhav-pasi-visionary-entrepreneur.html' },
  { name: 'Bharat Biz Wire',        href: 'https://www.bharatbizwire.top/2026/05/vaibhav-pasi-visionary-entrepreneur.html' },
  { name: 'The Republic News',      href: 'https://www.therepublicnews.co.in/2026/05/vaibhav-pasi-visionary-entrepreneur.html' },
  { name: 'Times News Express',     href: 'http://www.timesnewsexpress.co.in/2026/05/vaibhav-pasi-visionary-entrepreneur.html' },
];

// Where the sculpture should sit per section so it lands in the EMPTY half
// beside the text (never behind it). `side` = target world-x fed to the
// sculpture (+ = right / - = left, opposite the text column); `o` = opacity
// (dimmed on the full-width content sections where there is no empty half).
// `side` is a SCREEN-space target: how far toward a frame edge the object's
// centre should sit (~0.42 ≈ 42% from centre toward the edge; + = right).
// The render loop converts this to world-x for the current camera and clamps
// it so the object's edge never leaves the frame — same apparent size, always
// in view. Full-width content sections push a bit further and dim.
const PLACE: Record<string, { side: number; o: number }> = {
  home:        { side: 0.42,  o: 1 },    // text left  → object right
  why:         { side: -0.42, o: 1 },    // text right → object left
  focus:       { side: 0.42,  o: 1 },
  services:    { side: -0.42, o: 1 },
  software:    { side: 0.42,  o: 1 },
  reach:       { side: -0.42, o: 1 },
  method:      { side: 0.42,  o: 1 },
  network:     { side: -0.42, o: 1 },
  work:        { side: 0.58,  o: 0.16 },
  about:       { side: 0.58,  o: 0.14 },
  testimonials:{ side: 0.42,  o: 1 },
  contact:     { side: -0.58, o: 0.26 },
};

// Rail order — must match the <section id> list below.
const RAIL: { id: string; label: string }[] = [
  { id: 'home', label: 'Intro' },
  { id: 'why', label: 'Why 4AM' },
  { id: 'focus', label: 'Focus' },
  { id: 'services', label: 'Capability' },
  { id: 'software', label: 'Software' },
  { id: 'reach', label: 'Reach' },
  { id: 'method', label: 'Method' },
  { id: 'network', label: 'Network' },
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'Leadership' },
  { id: 'testimonials', label: 'Voices' },
  { id: 'contact', label: 'Contact' },
];

/* ── Right-edge dot rail ─────────────────────────────────────────── */
const DotRail: React.FC = () => {
  const [active, setActive] = useState('home');
  useEffect(() => {
    const observed = RAIL.map((r) => document.getElementById(r.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );
    observed.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <div id="o-rail" aria-hidden="true">
      {RAIL.map((r) => (
        <button
          key={r.id}
          type="button"
          aria-label={r.label}
          aria-current={active === r.id ? 'true' : 'false'}
          onClick={() => scrollToSection(r.id)}
        />
      ))}
    </div>
  );
};

/* ── Scroll cue (bottom-left, fades after first scroll) ──────────── */
const ScrollCue: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => { if (ref.current) ref.current.style.opacity = window.scrollY > 60 ? '0' : '1'; };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="o-cue" ref={ref}>Scroll</div>;
};

/* ── Contact form — preserves the working /api/leads integration ─── */
type FormErrors = Partial<Record<keyof FormState, string>>;
interface FormState {
  fullName: string; workEmail: string; phone: string; company: string;
  interestedIn: string; budget: string; message: string;
}
const isIndianVisitor = (): boolean => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') return true;
  } catch { /* older browsers: fall through to locale */ }
  return (navigator.languages ?? [navigator.language]).some((l) => /-IN$/i.test(l));
};
const BUDGETS_USD = ['Under $500', '$500 – $1,500', '$1,500 – $5,000', '$5,000 – $15,000', '$15,000+'];
const BUDGETS_INR = ['Under ₹40,000', '₹40,000 – ₹1,25,000', '₹1,25,000 – ₹4,00,000', '₹4,00,000 – ₹12,00,000', '₹12,00,000+'];
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[a-zA-Z\s'.-]{2,}$/;
const PHONE_DIGITS_REGEX = /\d/g;
const validate = (form: FormState): FormErrors => {
  const errors: FormErrors = {};
  if (!form.fullName.trim()) errors.fullName = 'Name is required';
  else if (!NAME_REGEX.test(form.fullName.trim())) errors.fullName = 'Enter a valid name';
  if (!form.workEmail.trim()) errors.workEmail = 'Email is required';
  else if (!EMAIL_REGEX.test(form.workEmail.trim())) errors.workEmail = 'Enter a valid email';
  if (form.phone.trim()) {
    const digits = form.phone.match(PHONE_DIGITS_REGEX);
    if (!digits || digits.length < 7 || digits.length > 15) errors.phone = 'Enter a valid phone number';
  }
  if (!form.interestedIn) errors.interestedIn = 'Please select a service';
  if (!form.budget) errors.budget = 'Please select a budget range';
  if (!form.message.trim()) errors.message = 'Message is required';
  else if (form.message.trim().length < 10) errors.message = 'Min 10 characters';
  return errors;
};

const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [serverMessage, setServerMessage] = useState('');
  const [form, setForm] = useState<FormState>({
    fullName: '', workEmail: '', phone: '', company: '', interestedIn: '', budget: '', message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [budgetOptions] = useState<string[]>(() => (isIndianVisitor() ? BUDGETS_INR : BUDGETS_USD));

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setErrors({});
    setStatus('submitting');
    setServerMessage('');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.fullName, email: form.workEmail, phone: form.phone, company: form.company,
          service: form.interestedIn, budget: form.budget, message: form.message, source: 'website-contact',
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || data?.ok !== true) {
        setServerMessage(String(data?.error ?? ''));
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="o-card" style={{ alignItems: 'center', textAlign: 'center', padding: '48px 28px' }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', border: '1px solid var(--color-divider)', display: 'grid', placeItems: 'center', marginBottom: 8 }}>
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none"><path d="M4 8l3 3 5-6" stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h3 className="o-card-title">Message sent</h3>
        <p className="text-muted" style={{ maxWidth: '30ch', margin: 0 }}>We’ll review your request and reply within 24 hours.</p>
        <button
          type="button"
          className="o-btn o-btn-ghost"
          onClick={() => { setForm({ fullName: '', workEmail: '', phone: '', company: '', interestedIn: '', budget: '', message: '' }); setStatus('idle'); }}
        >
          Send another →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="o-form">
      {status === 'error' && (
        <div className="o-form-error" role="alert">
          {serverMessage || 'Something went wrong. Please try again — or email us directly at Info@4amglobalmedia.com.'}
        </div>
      )}
      <div className="o-form-grid">
        <div className="o-field">
          <label htmlFor="cf-name">Full name *</label>
          <input id="cf-name" className="o-input" type="text" autoComplete="name" placeholder="Jane Cooper"
            value={form.fullName} onChange={(e) => updateField('fullName', e.currentTarget.value)} />
          {errors.fullName && <span className="o-field-err">{errors.fullName}</span>}
        </div>
        <div className="o-field">
          <label htmlFor="cf-email">Work email *</label>
          <input id="cf-email" className="o-input" type="email" autoComplete="email" placeholder="jane@company.com"
            value={form.workEmail} onChange={(e) => updateField('workEmail', e.currentTarget.value)} />
          {errors.workEmail && <span className="o-field-err">{errors.workEmail}</span>}
        </div>
        <div className="o-field">
          <label htmlFor="cf-phone">Phone</label>
          <input id="cf-phone" className="o-input" type="tel" autoComplete="tel" placeholder="Optional"
            value={form.phone} onChange={(e) => updateField('phone', e.currentTarget.value)} />
          {errors.phone && <span className="o-field-err">{errors.phone}</span>}
        </div>
        <div className="o-field">
          <label htmlFor="cf-company">Company</label>
          <input id="cf-company" className="o-input" type="text" autoComplete="organization" placeholder="Optional"
            value={form.company} onChange={(e) => updateField('company', e.currentTarget.value)} />
        </div>
        <div className="o-field">
          <label htmlFor="cf-interest">Interested in *</label>
          <select id="cf-interest" className="o-input" value={form.interestedIn} onChange={(e) => updateField('interestedIn', e.currentTarget.value)}>
            <option value="">Select a service…</option>
            <option value="web-development">Web Development</option>
            <option value="social-media">Social Media</option>
            <option value="seo">SEO</option>
            <option value="paid-ads">Paid Ads</option>
            <option value="branding">Branding</option>
            <option value="content-creation">Content Creation</option>
            <option value="marketplace-product-onboarding">Marketplace Product Onboarding</option>
            <option value="other">Other</option>
          </select>
          {errors.interestedIn && <span className="o-field-err">{errors.interestedIn}</span>}
        </div>
        <div className="o-field">
          <label htmlFor="cf-budget">Budget range *</label>
          <select id="cf-budget" className="o-input" value={form.budget} onChange={(e) => updateField('budget', e.currentTarget.value)}>
            <option value="">Select a budget…</option>
            {budgetOptions.map((label) => <option key={label} value={label}>{label}</option>)}
          </select>
          {errors.budget && <span className="o-field-err">{errors.budget}</span>}
        </div>
      </div>
      <div className="o-field" style={{ marginTop: 16 }}>
        <label htmlFor="cf-message">Tell us about your project *</label>
        <textarea id="cf-message" className="o-input" rows={4} placeholder="What are you trying to move?"
          value={form.message} onChange={(e) => updateField('message', e.currentTarget.value)} />
        {errors.message && <span className="o-field-err">{errors.message}</span>}
      </div>
      <div className="row" style={{ marginTop: 22 }}>
        <button type="submit" className="o-btn o-btn-primary" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Send message'}
          {status !== 'submitting' && (
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          )}
        </button>
        <a className="o-btn o-btn-secondary" href="mailto:Info@4amglobalmedia.com">Or email us</a>
      </div>
    </form>
  );
};

/* ── Page ────────────────────────────────────────────────────────── */
const LandingPage: React.FC = () => {
  const location = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);
  const [show3D, setShow3D] = useState(false);

  // Desktop / idle gate for the WebGL sculpture — never on phones,
  // reduced-motion, save-data or weak CPUs (matches the app's perf policy).
  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 1024px)').matches ||
      window.matchMedia('(pointer: coarse)').matches ||
      (navigator.hardwareConcurrency || 8) < 4 ||
      nav.connection?.saveData
    ) return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId: number | undefined; let timeoutId: number | undefined;
    const enable = () => setShow3D(true);
    if (w.requestIdleCallback) idleId = w.requestIdleCallback(enable, { timeout: 1200 });
    else timeoutId = window.setTimeout(enable, 800);
    return () => {
      if (idleId !== undefined && w.cancelIdleCallback) w.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  // Route-state driven scroll (Navbar/Footer navigate('/', { state:{scrollTo} }))
  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (!state?.scrollTo) return;
    setTimeout(() => scrollToSection(state.scrollTo!), 120);
  }, [location.state]);

  useEffect(() => {
    document.title = HOME_PAGE_TITLE;
    const tag = document.querySelector('meta[name="description"]');
    if (tag) tag.setAttribute('content', HOME_PAGE_DESCRIPTION);
  }, []);

  // Move the sculpture into the empty half of the active section so it sits
  // beside the text, and dim it on the full-width content sections. Re-runs
  // once the canvas mounts (show3D) — observing fires an initial callback,
  // so the opening placement is set without waiting for a scroll.
  useEffect(() => {
    if (!show3D) return;
    const sections = RAIL.map((r) => document.getElementById(r.id)).filter(Boolean) as HTMLElement[];
    const apply = (id: string) => {
      const pl = PLACE[id] ?? { side: 0, o: 1 };
      (window as unknown as { __sculptSideX?: number }).__sculptSideX = pl.side;
      const canvas = document.getElementById('o-scene');
      if (canvas) canvas.style.opacity = String(pl.o);
    };
    const io = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) apply(e.target.id); }); },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [show3D]);

  // Scroll reveal — `.reveal` (single blocks) + `.reveal-item` (staggered
  // grid/list/tag children inside a [data-stagger] container).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>('.reveal, .reveal-item'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    els.forEach((el) => {
      const parent = el.parentElement;
      if (parent && parent.hasAttribute('data-stagger')) {
        const sibs = Array.from(parent.children).filter((c) => c.classList.contains('reveal-item') || c.classList.contains('reveal'));
        const i = Math.min(Math.max(0, sibs.indexOf(el)), 9); // cap so long groups don't crawl
        if (el.classList.contains('reveal-item')) el.style.animationDelay = `${i * 65}ms`;
        else if (i > 0) el.style.transitionDelay = `${i * 85}ms`;
      }
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Count-up for [data-count] numbers when they scroll into view.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const nums = Array.from(root.querySelectorAll<HTMLElement>('[data-count]'));
    if (!nums.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nums.forEach((el) => { el.textContent = el.dataset.count ?? el.textContent; });
      return;
    }
    nums.forEach((el) => { el.textContent = '0'; });
    const run = (el: HTMLElement) => {
      const to = parseFloat(el.dataset.count ?? '0'); const t0 = performance.now(); const dur = 1300;
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / dur); const e = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(to * e));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { run(e.target as HTMLElement); io.unobserve(e.target); } });
    }, { threshold: 0.5 });
    nums.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Subtle magnetic pull on the primary buttons (desktop, fine pointer only).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const btns = Array.from(root.querySelectorAll<HTMLElement>('.o-btn-primary'));
    const cleanups: (() => void)[] = [];
    btns.forEach((b) => {
      const move = (e: PointerEvent) => {
        const r = b.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2), my = e.clientY - (r.top + r.height / 2);
        b.style.transform = `translate(${mx * 0.22}px, ${my * 0.32}px)`;
      };
      const leave = () => { b.style.transform = ''; };
      b.addEventListener('pointermove', move);
      b.addEventListener('pointerleave', leave);
      cleanups.push(() => { b.removeEventListener('pointermove', move); b.removeEventListener('pointerleave', leave); });
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div ref={rootRef} className="organic">
      {show3D && (
        <React.Suspense fallback={null}>
          <SculptureBackground />
        </React.Suspense>
      )}
      <div className="o-vignette" aria-hidden="true" />
      <DotRail />
      <ScrollCue />

      <main>
        {/* 1 · Hero */}
        <section id="home" className="o-section">
          <div className="o-col">
            <p className="kicker reveal"><span className="rule" />4AM Global Media</p>
            <h1 className="reveal text-gradient-4am">A creative network made for today &amp; tomorrow.</h1>
            <p className="lede reveal">
              We power founders, operators and teams across the globe with strategy, design,
              engineering and growth marketing that compounds.
            </p>
            <div className="row reveal">
              <button className="o-btn o-btn-primary" onClick={() => scrollToSection('contact')}>Start a project</button>
              <button className="o-btn o-btn-ghost" onClick={() => scrollToSection('services')}>See how we work →</button>
            </div>
          </div>
        </section>

        {/* 2 · Why 4AM */}
        <section id="why" className="o-section">
          <div className="o-col right">
            <p className="kicker reveal"><span className="rule" />Why 4AM</p>
            <h2 className="reveal">The hour before everyone else starts.</h2>
            <p className="lede reveal">
              4AM is the quiet edge of the day — the head start. It is how we work and what we sell:
              momentum, before the market notices.
            </p>
          </div>
        </section>

        {/* 3 · Focus + stats */}
        <section id="focus" className="o-section">
          <div className="o-col">
            <p className="kicker reveal"><span className="rule" />Focus</p>
            <h2 className="reveal">We look closely, then we build.</h2>
            <p className="lede reveal">
              Every engagement opens with a diagnostic — audience, funnel, product surface — so the
              work that follows is aimed, not decorative.
            </p>
            <div className="stats reveal">
              <div><b data-count={PROJECTS.length}>{PROJECTS.length}</b><small>Client sites shipped</small></div>
              <div><b data-count={SERVICES.length}>{SERVICES.length}</b><small>Core services</small></div>
              <div><b data-count={MARKETPLACES.length}>{MARKETPLACES.length}</b><small>Marketplaces</small></div>
            </div>
          </div>
        </section>

        {/* 4 · Capability (services) */}
        <section id="services" className="o-section">
          <div className="o-col right">
            <p className="kicker reveal"><span className="rule" />Capability</p>
            <h2 className="reveal">One team, taken apart.</h2>
            <p className="lede reveal" style={{ marginBottom: 8 }}>
              Seven capabilities, one team — tap any to see how we deliver it.
            </p>
            <div className="o-services" data-stagger>
              {SERVICES.map((s, i) => (
                <Link key={s.slug} to={`/services/${s.slug}`} className="o-service reveal-item" aria-label={`${s.title} — view service`}>
                  <span className="o-service-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="o-service-title">{s.title}</span>
                  <span className="o-service-arrow" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 5 · Software */}
        <section id="software" className="o-section">
          <div className="o-col">
            <p className="kicker reveal"><span className="rule" />Software</p>
            <h2 className="reveal">Products that hold up under real traffic.</h2>
            <p className="lede reveal">
              Web platforms, mobile apps and the integrations behind them — designed, shipped and
              maintained by the same people.
            </p>
            <div className="row" data-stagger>
              {['React', 'React Native', 'Node', 'Python', 'Cloud'].map((t) => (
                <span key={t} className="o-tag o-tag-outline reveal-item">{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* 6 · Reach */}
        <section id="reach" className="o-section">
          <div className="o-col right">
            <p className="kicker reveal"><span className="rule" />Reach</p>
            <h2 className="reveal">Built to broadcast.</h2>
            <p className="lede reveal">
              Paid, organic, owned. We put your message where the attention already is and measure
              every hop it makes.
            </p>
            <div className="row" data-stagger>
              {['Performance ads', 'SEO', 'Social', 'Content & film'].map((t) => (
                <span key={t} className="o-tag o-tag-accent-2 reveal-item">{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* 7 · Method */}
        <section id="method" className="o-section">
          <div className="o-col">
            <p className="kicker reveal"><span className="rule" />Method</p>
            <h2 className="reveal">Straight through the middle of the problem.</h2>
            <p className="lede reveal">
              Short cycles, visible decisions, no theatre. You see the work while it is still cheap to change.
            </p>
            <ul className="ed-list reveal">
              {['Diagnose', 'Design', 'Build', 'Launch & grow'].map((step, i) => (
                <li key={step}><i>{String(i + 1).padStart(2, '0')}</i><span>{step}</span></li>
              ))}
            </ul>
          </div>
        </section>

        {/* 8 · Network + marketplaces */}
        <section id="network" className="o-section">
          <div className="o-col right">
            <p className="kicker reveal"><span className="rule" />Network</p>
            <h2 className="reveal">Specialists, on the day you need them.</h2>
            <p className="lede reveal">
              A distributed bench of engineers, strategists, editors and media buyers — and a
              marketplace desk that launches brands across India’s leading platforms.
            </p>
            <div className="row" data-stagger style={{ gap: 8 }}>
              {MARKETPLACES.map((m) => <span key={m} className="o-tag o-tag-neutral reveal-item">{m}</span>)}
            </div>
          </div>
        </section>

        {/* 9 · Work */}
        <section id="work" className="o-section">
          <div className="o-wide">
            <p className="kicker reveal"><span className="rule" />Selected work</p>
            <h2 className="reveal">Results we can point to.</h2>
            <div className="o-cards" data-stagger>
              {FEATURED_WORK.map((p) => (
                <a key={p.id} className="o-card reveal-item" href={p.url} target="_blank" rel="noopener noreferrer">
                  <span className="o-card-kicker">{p.industry ?? p.category}</span>
                  <span className="o-card-title">{p.title}</span>
                  {p.result && <span className="o-card-result">{p.result}</span>}
                  <span className="o-card-link">Visit site →</span>
                </a>
              ))}
            </div>
            <p className="lede reveal" style={{ marginTop: 26, marginBottom: 0 }}>
              …and {PROJECTS.length - FEATURED_WORK.length}+ more client sites shipped worldwide.
            </p>
          </div>
        </section>

        {/* 10 · Leadership */}
        <section id="about" className="o-section">
          <div className="o-wide">
            <p className="kicker reveal"><span className="rule" />Leadership</p>
            <h2 className="reveal">The people behind 4AM.</h2>
            <div className="o-cards" data-stagger>
              {LEADERS.map((l) => (
                <article key={l.name} className="o-card o-leader reveal-item">
                  <div className="o-leader-photo">
                    <img src={l.photo} alt={l.name} loading="lazy" />
                  </div>
                  <span className={`o-card-kicker ${l.accent === 'accent-2' ? 'is-sage' : ''}`}>{l.role}</span>
                  <span className="o-card-title">{l.name}</span>
                  <p className="text-muted" style={{ fontSize: 14, margin: '4px 0 8px' }}>{l.bio}</p>
                  <div className="row" style={{ gap: 6 }}>
                    {l.tags.map((t) => (
                      <span key={t} className={`o-tag ${l.accent === 'accent-2' ? 'o-tag-accent-2' : 'o-tag-accent'}`}>{t}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <div className="o-featured reveal">
              <span className="o-featured-label">As featured in</span>
              <div className="row" data-stagger style={{ gap: 8 }}>
                {FEATURED_IN.map((o) => (
                  <a key={o.name} className="o-tag o-tag-neutral reveal-item" href={o.href} target="_blank" rel="noopener noreferrer">{o.name}</a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 11 · Quote */}
        <section id="testimonials" className="o-section">
          <div className="o-col">
            <blockquote className="reveal">
              “The 4AM team brought clarity to our growth strategy and execution. They operate like an
              extension of our internal team.”
            </blockquote>
            <cite className="reveal">Head of Marketing · SaaS brand</cite>
          </div>
        </section>

        {/* 12 · Contact */}
        <section id="contact" className="o-section">
          <div className="o-wide o-contact">
            <div className="o-contact-intro">
              <p className="kicker reveal"><span className="rule" />Contact</p>
              <h2 className="reveal">It is early. Let’s begin.</h2>
              <p className="lede reveal">Tell us what you are trying to move, and we will tell you what it takes.</p>
              <dl className="o-contact-meta reveal">
                <div><dt>Email</dt><dd><a href="mailto:Info@4amglobalmedia.com">Info@4amglobalmedia.com</a></dd></div>
                <div><dt>Phone</dt><dd><a href="tel:8826406545">8826406545</a></dd></div>
                <div><dt>Location</dt><dd>Global / Remote Team</dd></div>
              </dl>
            </div>
            <div className="o-contact-form reveal">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
