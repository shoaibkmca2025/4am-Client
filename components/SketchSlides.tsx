import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Pencil-sketch slides — the same hand-drawn language as the opening frame
 * sequence, continued in vector so it costs kilobytes instead of megabytes.
 *
 * Every stroke is a path that draws ITSELF as the slide scrolls through the
 * viewport (`stroke-dashoffset` scrubbed by ScrollTrigger), which is the
 * whiteboard-animation effect the frame sequence gets from 140 bitmaps.
 * A displacement filter roughs the lines up so they read as graphite rather
 * than as clean vector.
 *
 * Scrubbed but never pinned — the page has no scroll-jacked sections and
 * this does not introduce one.
 */

type Slide = {
  n: string;
  kicker: string;
  title: string;
  body: string;
  /** Hand-lettered note that lands beside the drawing. */
  note: string;
  /** Ordered strokes — they draw in this order. */
  strokes: string[];
  /** Shaded/hatched bits: these fade in instead of drawing. */
  shade?: string[];
  flip?: boolean;
};

const SLIDES: Slide[] = [
  {
    n: '01',
    kicker: 'Discover',
    title: 'Got a business idea?',
    body:
      'Every engagement opens the way the sketch does — two people and a problem. We audit the audience, the funnel and the product surface before anyone opens a design file, so the work that follows is aimed rather than decorative.',
    note: 'the brief',
    strokes: [
      // notepad
      'M40 96 L40 250 L150 250 L150 96 Z',
      'M40 96 C60 88 130 88 150 96',
      'M58 130 L132 130', 'M58 156 L124 156', 'M58 182 L134 182', 'M58 208 L108 208',
      // arrow notepad → bulb
      'M164 150 C200 120 214 118 244 132',
      'M232 122 L246 133 L231 142',
      // bulb glass
      'M300 96 C270 96 254 118 254 140 C254 160 268 170 274 184 L326 184 C332 170 346 160 346 140 C346 118 330 96 300 96 Z',
      // filament
      'M284 150 L292 138 L300 152 L308 138 L316 150',
      // base
      'M274 194 L326 194', 'M277 204 L323 204', 'M282 214 L318 214',
      'M288 214 L288 226 C288 234 312 234 312 226 L312 214',
      // rays
      'M300 74 L300 58', 'M352 104 L366 92', 'M248 104 L234 92',
      'M368 148 L384 148', 'M232 148 L216 148',
    ],
    shade: ['M262 158 L276 176', 'M268 150 L284 172', 'M324 172 L340 152', 'M316 176 L334 158'],
  },
  {
    n: '02',
    kicker: 'Design',
    title: 'Web design that earns the second scroll.',
    body:
      'Layout, type and motion are decided together, in the browser, at the sizes people actually use. You see the interface while it is still cheap to change — the same way the pencil lays out a page before it commits.',
    note: 'web design',
    flip: true,
    strokes: [
      // browser frame
      'M32 74 L306 74 L306 236 L32 236 Z',
      'M32 102 L306 102',
      'M46 88 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0',
      'M64 88 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0',
      'M82 88 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0',
      // hero block + text lines
      'M52 120 L166 120 L166 176 L52 176 Z',
      'M182 122 L288 122', 'M182 138 L268 138', 'M182 154 L286 154', 'M182 170 L240 170',
      // cards row
      'M52 192 L112 192 L112 220 L52 220 Z',
      'M124 192 L184 192 L184 220 L124 220 Z',
      'M196 192 L256 192 L256 220 L196 220 Z',
      // phone
      'M330 108 L330 250 C330 258 336 264 344 264 L388 264 C396 264 402 258 402 250 L402 108 C402 100 396 94 388 94 L344 94 C336 94 330 100 330 108 Z',
      'M342 118 L390 118 L390 240 L342 240 Z',
      'M354 252 L378 252',
      // pencil
      'M236 40 L286 62', 'M236 40 L230 56 L244 62 Z', 'M280 26 L290 48 L286 62 L276 40 Z',
    ],
    shade: ['M60 128 L156 168', 'M60 144 L140 176', 'M78 122 L164 158'],
  },
  {
    n: '03',
    kicker: 'Build',
    title: 'Software that holds up under real traffic.',
    body:
      'React and React Native on the front, Node and Python behind it, deployed on infrastructure that scales without drama. Web platforms, mobile apps and the integrations between them — shipped and maintained by the same people who designed them.',
    note: 'software designing',
    strokes: [
      // editor window
      'M34 66 L300 66 L300 224 L34 224 Z',
      'M34 92 L300 92',
      'M48 79 L62 79', 'M72 79 L86 79',
      // </> glyph
      'M118 122 L94 152 L118 182',
      'M216 122 L240 152 L216 182',
      'M186 112 L148 192',
      // stacked layers
      'M330 100 L392 82 L454 100 L392 118 Z',
      'M330 100 L330 122 L392 140 L454 122 L454 100',
      'M330 138 L392 120 L454 138 L392 156 Z',
      'M330 138 L330 160 L392 178 L454 160 L454 138',
      // gear
      'M150 262 m-30 0 a30 30 0 1 0 60 0 a30 30 0 1 0 -60 0',
      'M150 262 m-13 0 a13 13 0 1 0 26 0 a13 13 0 1 0 -26 0',
      'M150 226 L150 214', 'M150 298 L150 310',
      'M114 262 L102 262', 'M186 262 L198 262',
      'M124 236 L116 228', 'M176 288 L184 296',
      'M176 236 L184 228', 'M124 288 L116 296',
      // wire gear → stack
      'M198 268 C250 280 300 240 322 176',
      'M314 186 L323 172 L331 184',
    ],
    shade: ['M52 104 L104 104', 'M52 116 L136 116', 'M52 200 L120 200', 'M52 212 L92 212'],
  },
  {
    n: '04',
    kicker: 'Grow',
    title: 'Social, marketing, PR — the part that compounds.',
    body:
      'Paid, organic and owned, measured at every hop. Campaigns, content, marketplace launches and press: the branches on the tree in the closing frame, and the reason the work keeps paying after the build is done.',
    note: 'marketing · web · products · PR',
    flip: true,
    strokes: [
      // axes
      'M56 60 L56 244 L288 244',
      // bars
      'M84 244 L84 200 L114 200 L114 244',
      'M126 244 L126 168 L156 168 L156 244',
      'M168 244 L168 132 L198 132 L198 244',
      'M210 244 L210 92 L240 92 L240 244',
      // trend arrow
      'M74 214 C124 200 168 158 236 74',
      'M216 76 L238 68 L234 92',
      // megaphone
      'M320 128 L364 104 L364 188 L320 164 Z',
      'M320 132 L302 138 L302 156 L320 162 Z',
      'M310 162 L314 196 L330 196 L326 166',
      'M376 122 C392 138 392 156 376 172',
      'M386 108 C412 136 412 158 386 186',
      // rocket
      'M120 340 C120 316 134 296 150 286 C166 296 180 316 180 340 L120 340 Z',
      'M150 314 m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0',
      'M120 332 L102 356 L124 348', 'M180 332 L198 356 L176 348',
      'M138 344 C142 362 148 368 150 378 C152 368 158 362 162 344',
      // sparkles
      'M258 300 L258 322', 'M247 311 L269 311',
      'M300 268 L300 282', 'M293 275 L307 275',
    ],
    shade: ['M84 210 L114 240', 'M126 178 L156 236', 'M168 142 L198 232', 'M210 102 L240 228'],
  },
];

const VIEWBOX = '0 0 470 400';

const SketchSlides: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // This component is lazy-loaded, so it animates its own header rather
      // than relying on the page-level `.reveal` observer that already ran.
      if (reduced) {
        gsap.set('.sks-head > *', { autoAlpha: 1, y: 0 });
      } else {
        gsap.from('.sks-head > *', {
          y: 32, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08,
          scrollTrigger: { trigger: '.sks-head', start: 'top 88%', once: true },
        });
      }

      // Fit each drawing to the strokes it actually contains. Authoring one
      // shared viewBox left slabs of dead space around the smaller sketches;
      // measuring here keeps every panel optically the same size, and it
      // stays correct if the path data is edited later. useLayoutEffect, so
      // the viewBox is set before first paint.
      gsap.utils.toArray<SVGSVGElement>('.sks-art svg').forEach((svg) => {
        const g = svg.querySelector('g');
        if (!g) return;
        try {
          const bb = (g as SVGGElement).getBBox();
          if (!bb.width || !bb.height) return;
          const pad = 14;   // stroke half-width + displacement-filter bleed
          svg.setAttribute(
            'viewBox',
            `${bb.x - pad} ${bb.y - pad} ${bb.width + pad * 2} ${bb.height + pad * 2}`,
          );
        } catch { /* getBBox throws on a detached node — leave the authored box */ }
      });

      gsap.utils.toArray<HTMLElement>('.sks-slide').forEach((slide) => {
        const paths = gsap.utils.toArray<SVGPathElement>('.sks-ink', slide);
        const shade = gsap.utils.toArray<SVGPathElement>('.sks-shade', slide);

        // Reduced motion: the drawing is simply already finished.
        if (reduced) {
          gsap.set(paths, { strokeDasharray: 'none', strokeDashoffset: 0, opacity: 1 });
          gsap.set(shade, { opacity: 0.55 });
          return;
        }

        paths.forEach((p) => {
          const len = p.getTotalLength();
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
        });
        gsap.set(shade, { opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: slide,
            start: 'top 82%',
            end: 'bottom 62%',
            scrub: 0.6,
          },
        });

        tl.to(paths, { strokeDashoffset: 0, ease: 'none', stagger: { each: 0.55, ease: 'none' } })
          .to(shade, { opacity: 0.5, ease: 'none', stagger: 0.25 }, '<40%');
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="sks" id="how" ref={rootRef} aria-label="How we work">
      <div className="sks-head">
        <p className="kicker"><span className="rule" />The same story, up close</p>
        <h2>Four panels, drawn as you go.</h2>
      </div>

      {SLIDES.map((s) => (
        <article key={s.n} className={`sks-slide${s.flip ? ' is-flip' : ''}`}>
          <div className="sks-copy">
            <span className="sks-n">{s.n}</span>
            <p className="kicker"><span className="rule" />{s.kicker}</p>
            <h3>{s.title}</h3>
            <p className="lede">{s.body}</p>
          </div>

          <figure className="sks-art">
            <svg viewBox={VIEWBOX} role="img" aria-label={`${s.kicker} — pencil sketch`} preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id={`pencil-${s.n}`} x="-8%" y="-8%" width="116%" height="116%">
                  {/* Graphite wobble: noise-displaced strokes read as hand-drawn. */}
                  <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed={Number(s.n)} result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>
              <g filter={`url(#pencil-${s.n})`}>
                {s.shade?.map((d, i) => (
                  <path key={`s${i}`} className="sks-shade" d={d} />
                ))}
                {s.strokes.map((d, i) => (
                  <path key={`p${i}`} className="sks-ink" d={d} />
                ))}
              </g>
            </svg>
            <figcaption className="sks-note">{s.note}</figcaption>
          </figure>
        </article>
      ))}
    </section>
  );
};

export default SketchSlides;
