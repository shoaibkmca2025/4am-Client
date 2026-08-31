import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SERVICES, PROJECTS } from '../constants';
import { scrollToSection } from '../utils/scroll';
import WorkCarousel from './WorkCarousel';
import SketchScrollHero from './SketchScrollHero';
// `SketchSlides` (the four vector pencil panels) is intentionally NOT in the
// flow: the sequence hands straight off to the work rail. The component is
// kept for whenever it is wanted back — drop it in below the hero.

const HOME_PAGE_TITLE = 'A Creative Network made for today & tomorrow | 4AM Global Media';
const HOME_PAGE_DESCRIPTION =
  '4AM Global Media provides digital marketing and software development services including web and mobile app solutions to help businesses grow online.';

// Marketplaces we onboard brands onto (real list from the onboarding service).
const MARKETPLACES = [
  'Amazon', 'Flipkart', 'Blinkit', 'Zepto', 'Swiggy Instamart',
  'BigBasket', 'JioMart', 'Meesho', 'Myntra', 'Ajio',
  'Nykaa', 'FirstCry', 'ONDC', 'Shopify', 'WooCommerce',
];

// The full client roster — the projects that carry a measured result lead the
// rail (their hover face shows the metric), the rest follow.
const WORK = [
  ...PROJECTS.filter((p) => p.result),
  ...PROJECTS.filter((p) => !p.result),
];

// Leadership — condensed from the full Founder profiles.
const LEADERS = [
  {
    name: 'Shoaib Khatik',
    role: 'Co-Founder',
    photo: '/assets/shoaib-khatik-web.jpg?v=2',
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

// Rail order — must match the <section id> list below.
const RAIL: { id: string; label: string }[] = [
  { id: 'home',    label: 'The story' },
  { id: 'work',    label: 'Work' },
  { id: 'about',   label: 'Leadership' },
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
      {/* 1 · The pencil-sketch scroll sequence — fixed canvas + its scroll
             track. Everything below scrolls over it, then it fades out. */}
      <SketchScrollHero />

      <DotRail />

      <main>
        {/* 2 · Work — first thing after the sequence finishes */}
        <section id="work" className="o-section">
          <div className="o-wide">
            <WorkCarousel
              projects={WORK}
              kicker="Our work"
              heading="Sites we've shipped."
            />

            <div className="stats reveal" style={{ marginTop: 34 }}>
              <div><b data-count={PROJECTS.length}>{PROJECTS.length}</b><small>Client sites shipped</small></div>
              <div><b data-count={SERVICES.length}>{SERVICES.length}</b><small>Core services</small></div>
              <div><b data-count={MARKETPLACES.length}>{MARKETPLACES.length}</b><small>Marketplaces</small></div>
            </div>

            <p className="lede reveal" style={{ marginTop: 26 }}>
              {PROJECTS.length} client websites delivered worldwide — and a marketplace desk that
              launches brands across India&rsquo;s leading platforms.
            </p>
            <div className="row" data-stagger style={{ gap: 8 }}>
              {MARKETPLACES.map((m) => <span key={m} className="o-tag o-tag-neutral reveal-item">{m}</span>)}
            </div>

            <div className="row reveal" style={{ marginTop: 30 }}>
              <Link className="o-btn o-btn-primary" to="/services">Explore our services</Link>
            </div>

            <blockquote className="o-quote reveal">
              &ldquo;The 4AM team brought clarity to our growth strategy and execution. They operate
              like an extension of our internal team.&rdquo;
              <cite>Head of Marketing · SaaS brand</cite>
            </blockquote>
          </div>
        </section>

        {/* 3 · Founders */}
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

        {/* 4 · Contact */}
        <section id="contact" className="o-section">
          <div className="o-wide o-contact">
            <div className="o-contact-intro">
              <p className="kicker reveal"><span className="rule" />Contact</p>
              <h2 className="reveal">It is early. Let&rsquo;s begin.</h2>
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
