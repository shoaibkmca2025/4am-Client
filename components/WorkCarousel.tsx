import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Project } from '../types';

/**
 * Horizontal rail of tall project cards.
 *
 * Resting state shows the client line + title with an arrow pill. Hovering
 * (or keyboard-focusing) a card shrinks its media panel and cross-fades in
 * the measured result, the stack and a CTA — the reveal itself is pure CSS
 * (see `.wc-*` in index.css) so it stays instant and never re-renders.
 *
 * Paging is transform-based on purpose: Lenis owns the wheel on desktop
 * (components/SmoothScroll.tsx), so a nested scroll container would fight
 * it. Touch users swipe via the pointer handlers below.
 */

type Props = {
  projects: Project[];
  /** Small uppercase line above the heading. */
  kicker: string;
  /** Section heading — sits opposite the prev/next arrows. */
  heading: string;
  /** Label on the reveal CTA pill. */
  cta?: string;
};

const SWIPE_THRESHOLD = 44;

const Arrow: React.FC = () => (
  <svg width="30" height="12" viewBox="0 0 30 12" fill="none" aria-hidden="true">
    <path d="M1 6h27.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M23.5 1L29 6l-5.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const initials = (title: string) =>
  title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

/** WordPress mShots thumbnail of a client's own site (free, no API key). */
const mshot = (url: string, retry = 0) =>
  `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=800&h=600${retry ? `&r=${retry}` : ''}`;

/**
 * Screenshot of the client's site. mShots serves a 400×300 grey "generating"
 * placeholder until WordPress has rendered the page, then the real 800×600
 * shot. We keep the <img> transparent — so the warm monogram plate underneath
 * shows through — until a real frame lands, retrying on a fresh cache-key each
 * time (re-requesting the *same* URL just re-serves the cached placeholder).
 * A local `project.image`, if one is ever added, short-circuits all of this.
 */
const Thumb: React.FC<{ project: Project }> = ({ project }) => {
  const [tries, setTries] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const local = project.image;

  if (failed) return null; // monogram plate stays visible

  return (
    <img
      src={local ?? mshot(project.url, tries)}
      alt=""
      loading="lazy"
      decoding="async"
      draggable={false}
      className={ready ? 'is-ready' : undefined}
      onLoad={(e) => {
        const im = e.currentTarget;
        const generating = !local && im.naturalWidth === 400 && im.naturalHeight === 300;
        if (generating && tries < 8) {
          window.setTimeout(() => setTries((t) => t + 1), 1600 + tries * 700);
        } else {
          setReady(true);
        }
      }}
      onError={() => setFailed(true)}
    />
  );
};

const WorkCarousel: React.FC<Props> = ({ projects, kicker, heading, cta = 'Visit site' }) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Card width + gap are authored in CSS (they change per breakpoint), so we
  // measure them rather than duplicating the numbers here.
  const [metrics, setMetrics] = useState({ step: 0, gap: 0, view: 0 });
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track) return;

    const measure = () => {
      const card = track.firstElementChild as HTMLElement | null;
      if (!card) return;
      const cs = getComputedStyle(track);
      const gap = parseFloat(cs.columnGap || cs.gap || '0') || 0;
      setMetrics({ step: card.getBoundingClientRect().width + gap, gap, view: vp.clientWidth });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    return () => ro.disconnect();
  }, [projects.length]);

  const { step, gap, view } = metrics;
  const count = projects.length;
  const perView = step > 0 ? Math.max(1, Math.round(view / step)) : 1;
  const maxIndex = Math.max(0, count - perView);
  const current = Math.min(index, maxIndex);

  // Clamp when the breakpoint changes and more cards fit than before.
  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const maxOffset = Math.max(0, count * step - gap - view);
  const offset = Math.min(current * step, maxOffset);
  const atStart = current <= 0;
  const atEnd = current >= maxIndex;

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => Math.min(maxIndex, Math.max(0, Math.min(i, maxIndex) + dir))),
    [maxIndex],
  );

  // Tabbing into an off-screen card pages it into view.
  const ensureVisible = useCallback(
    (i: number) => setIndex((prev) => {
      const c = Math.min(prev, maxIndex);
      if (i < c) return i;
      if (i >= c + perView) return Math.min(maxIndex, i - perView + 1);
      return prev;
    }),
    [maxIndex, perView],
  );

  // ── Touch swipe. `touch-action: pan-y` keeps vertical page scroll native;
  // mouse drags are left alone so clicking a card still opens it. ──
  const drag = useRef({ id: -1, x: 0, dx: 0 });
  const swiped = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    swiped.current = false;
    if (e.pointerType === 'mouse') return;
    drag.current = { id: e.pointerId, x: e.clientX, dx: 0 };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (drag.current.id !== e.pointerId) return;
    drag.current.dx = e.clientX - drag.current.x;
  };
  const onPointerEnd = (e: React.PointerEvent) => {
    if (drag.current.id !== e.pointerId) return;
    const { dx } = drag.current;
    drag.current.id = -1;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      swiped.current = true; // swallow the click this gesture would fire
      go(dx < 0 ? 1 : -1);
    }
  };
  const onClickCapture = (e: React.MouseEvent) => {
    if (!swiped.current) return;
    swiped.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      <div className="wc-head">
        <div>
          <p className="kicker reveal"><span className="rule" />{kicker}</p>
          <h2 className="reveal">{heading}</h2>
        </div>
        <div className="wc-nav reveal">
          <button
            type="button"
            className="wc-arrow wc-arrow-prev"
            onClick={() => go(-1)}
            disabled={atStart}
            aria-label="Previous projects"
          >
            <Arrow />
          </button>
          <button
            type="button"
            className="wc-arrow"
            onClick={() => go(1)}
            disabled={atEnd}
            aria-label="Next projects"
          >
            <Arrow />
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="wc-viewport reveal"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClickCapture={onClickCapture}
      >
        <div
          ref={trackRef}
          className="wc-track"
          style={{ transform: `translate3d(${-offset}px, 0, 0)` }}
        >
          {projects.map((p, i) => (
            <a
              key={p.id}
              className="wc-card"
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              onFocus={() => ensureVisible(i)}
              aria-label={`${p.title} — ${p.result ?? p.category}. Opens in a new tab.`}
            >
              <div className="wc-media">
                <span className="wc-mono" aria-hidden="true">{initials(p.title)}</span>
                <Thumb project={p} />
                <span className="wc-chip">{p.industry ?? p.category}</span>
              </div>

              <div className="wc-body">
                {/* Resting face */}
                <div className="wc-face wc-face-rest">
                  <span className="wc-meta">
                    <span className="wc-client">{p.category}</span>
                    <span className="wc-name">{p.title}</span>
                  </span>
                  <span className="wc-pill" aria-hidden="true"><Arrow /></span>
                </div>

                {/* Hover / focus face */}
                <div className="wc-face wc-face-hover">
                  {p.result && <span className="wc-result">{p.result}</span>}
                  <span className="wc-stack">
                    {p.technologies.slice(0, 3).map((t) => (
                      <span key={t} className="o-tag o-tag-neutral">{t}</span>
                    ))}
                  </span>
                  <span className="wc-cta">{cta}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default WorkCarousel;
