import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SERVICES } from '../constants';
import { optimizeImageUrl } from '../utils/image';
import { scrollToSection } from '../utils/scroll';

gsap.registerPlugin(ScrollTrigger);

/**
 * `/services` — the capability index, split out of the landing page so the
 * nav's SERVICES link goes somewhere instead of scrolling to an accordion.
 *
 * Editorial rows rather than a card grid: each service is a full-width line
 * that reveals on scroll, with a cursor-tracked preview panel on desktop
 * (pointer: fine only — on touch the image sits inline instead). Individual
 * services still live at `/services/:slug` via `ServicePage`.
 */

const PAGE_TITLE = 'Services — Marketing, Branding & Software | 4AM Global Media';
const PAGE_DESCRIPTION =
  'Digital marketing, branding, social media growth, SEO, web development, content creation and marketplace onboarding from 4AM Global Media.';

/* What every engagement runs through, regardless of which service opens it. */
const HOW = [
  { n: '01', title: 'Diagnose', body: 'Audience, funnel and product surface get audited before anything is designed. The brief comes out of the data, not the kickoff call.' },
  { n: '02', title: 'Design',   body: 'Direction, layout and messaging decided in the open — you see the work while it is still cheap to change.' },
  { n: '03', title: 'Build',    body: 'Short cycles, visible decisions. Campaigns go live in waves and code ships behind a review, never over a weekend.' },
  { n: '04', title: 'Grow',     body: 'Measurement from day one, then the compounding part: iterate what worked, cut what did not, expand the budget that earns.' },
];

const Arrow: React.FC = () => (
  <svg width="34" height="12" viewBox="0 0 34 12" fill="none" aria-hidden="true">
    <path d="M1 6h31" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M27 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ServicesPage: React.FC = () => {
  const rootRef    = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const railRef    = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    document.title = PAGE_TITLE;
    const tag = document.querySelector('meta[name="description"]');
    if (tag) tag.setAttribute('content', PAGE_DESCRIPTION);

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Services — 4AM Global Media',
      itemListElement: SERVICES.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: s.title,
        url: `${window.location.origin}/services/${s.slug}`,
      })),
    });
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, []);

  /* ── Entrance + scroll animation ─────────────────────────────────── */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.svx-hero > *, .svx-row, .svx-step, .svx-cta > *', { autoAlpha: 1, y: 0 });
        if (railRef.current) gsap.set(railRef.current, { scaleY: 1 });
        return;
      }

      // Hero
      gsap.from('.svx-hero > *', {
        y: 46, autoAlpha: 0, duration: 1.05, ease: 'expo.out', stagger: 0.09, delay: 0.15,
      });

      // Service rows — each line lifts in, its rule wipes across.
      gsap.utils.toArray<HTMLElement>('.svx-row').forEach((row) => {
        gsap.from(row, {
          y: 54, autoAlpha: 0, duration: 0.95, ease: 'expo.out',
          scrollTrigger: { trigger: row, start: 'top 88%', once: true },
        });
        const rule = row.querySelector('.svx-rule');
        if (rule) {
          gsap.fromTo(rule,
            { scaleX: 0, transformOrigin: 'left center' },
            { scaleX: 1, duration: 1.1, ease: 'expo.out',
              scrollTrigger: { trigger: row, start: 'top 88%', once: true } });
        }
      });

      // Process rail fills as the steps pass — the page's one scrubbed element.
      if (railRef.current) {
        gsap.fromTo(railRef.current,
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', transformOrigin: 'top center',
            scrollTrigger: { trigger: '.svx-how', start: 'top 70%', end: 'bottom 80%', scrub: 0.5 } });
      }
      gsap.utils.toArray<HTMLElement>('.svx-step').forEach((step, i) => {
        gsap.from(step, {
          y: 40, autoAlpha: 0, duration: 0.85, delay: i * 0.05, ease: 'expo.out',
          scrollTrigger: { trigger: step, start: 'top 88%', once: true },
        });
      });

      gsap.from('.svx-cta > *', {
        y: 38, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08,
        scrollTrigger: { trigger: '.svx-cta', start: 'top 85%', once: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  /* ── Cursor-tracked preview (desktop pointers only) ──────────────── */
  useEffect(() => {
    const list = rootRef.current?.querySelector<HTMLElement>('.svx-list');
    const panel = previewRef.current;
    if (!list || !panel) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const quickX = gsap.quickTo(panel, 'x', { duration: 0.55, ease: 'power3' });
    const quickY = gsap.quickTo(panel, 'y', { duration: 0.55, ease: 'power3' });

    const move = (e: PointerEvent) => {
      quickX(e.clientX + 28);
      quickY(e.clientY - 130);
    };
    list.addEventListener('pointermove', move);
    return () => list.removeEventListener('pointermove', move);
  }, []);

  return (
    <div className="organic svx" ref={rootRef}>
      <div className="o-vignette" aria-hidden="true" />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="o-section svx-hero-wrap">
        <div className="o-wide svx-hero">
          <p className="kicker is-in"><span className="rule" />Capability</p>
          <h1>Everything it takes,<br />under one roof.</h1>
          <p className="lede">
            Seven disciplines, one accountable team. Marketing that fills the funnel, design that
            earns the click, and software that survives the traffic it brings.
          </p>
          <div className="svx-hero-meta">
            <div><b>{SERVICES.length}</b><small>Core services</small></div>
            <div><b>1</b><small>Accountable team</small></div>
            <div><b>Global</b><small>Remote by default</small></div>
          </div>
        </div>
      </section>

      {/* ── Service rows ─────────────────────────────────────────── */}
      <section className="o-section svx-list-wrap" id="capabilities">
        <div className="o-wide">
          <ul className="svx-list" onPointerLeave={() => setActive(null)}>
            {SERVICES.map((s, i) => (
              <li key={s.id} className="svx-row" onPointerEnter={() => setActive(i)}>
                <Link to={`/services/${s.slug}`} className="svx-link">
                  <span className="svx-rule" aria-hidden="true" />
                  <span className="svx-num">{String(i + 1).padStart(2, '0')}</span>

                  <span className="svx-main">
                    <span className="svx-title">{s.title}</span>
                    <span className="svx-desc">{s.description}</span>
                    <span className="svx-tags">
                      {s.features.slice(0, 3).map((f) => (
                        <span key={f} className="o-tag o-tag-outline">{f}</span>
                      ))}
                    </span>
                  </span>

                  {/* Inline art for touch — the hover panel never runs there. */}
                  <span className="svx-thumb" aria-hidden="true">
                    <img src={optimizeImageUrl(s.image, { width: 420, height: 300 })} alt="" loading="lazy" decoding="async" />
                  </span>

                  <span className="svx-go"><Arrow /></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Floating preview that follows the cursor across the list. */}
        <div
          className={`svx-preview${active !== null ? ' is-on' : ''}`}
          ref={previewRef}
          aria-hidden="true"
        >
          {SERVICES.map((s, i) => (
            <img
              key={s.id}
              src={optimizeImageUrl(s.image, { width: 520, height: 380 })}
              alt=""
              loading="lazy"
              decoding="async"
              style={{ opacity: active === i ? 1 : 0 }}
            />
          ))}
        </div>
      </section>

      {/* ── How every engagement runs ────────────────────────────── */}
      <section className="o-section svx-how">
        <div className="o-wide">
          <p className="kicker is-in"><span className="rule" />Method</p>
          <h2>However it starts, it runs like this.</h2>
          <div className="svx-steps">
            <span className="svx-rail" aria-hidden="true"><span ref={railRef} /></span>
            {HOW.map((h) => (
              <article key={h.n} className="svx-step">
                <span className="svx-step-n">{h.n}</span>
                <h3>{h.title}</h3>
                <p>{h.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="o-section svx-cta-wrap">
        <div className="o-wide svx-cta">
          <p className="kicker is-in"><span className="rule" />Next</p>
          <h2>Not sure which one you need?</h2>
          <p className="lede">
            Most engagements start with two of these and grow into four. Tell us what you are
            trying to move and we will tell you what it takes.
          </p>
          <div className="row">
            <Link
              className="o-btn o-btn-primary"
              to="/"
              state={{ scrollTo: 'contact' }}
              onClick={() => { if (window.location.pathname === '/') scrollToSection('contact'); }}
            >
              Start a project
            </Link>
            <Link className="o-btn o-btn-ghost" to="/" state={{ scrollTo: 'work' }}>
              See the work →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
