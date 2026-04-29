import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SERVICES, PROJECTS } from '../constants';
import { optimizeImageUrl } from '../utils/image';
import { scrollToSection } from '../utils/scroll';
import RevealText from './RevealText';

gsap.registerPlugin(ScrollTrigger);

const SERVICE_SEO_OVERRIDES: Record<string, { title: string; description: string }> = {
  'digital-marketing': {
    title: 'Digital Marketing Services | SEO & Social Media | 4AM Global Media',
    description: 'Boost your online presence with digital marketing services from 4AM Global Media.',
  },
};

const ServicePage: React.FC = () => {
  const { slug }   = useParams<{ slug: string }>();
  const navigate   = useNavigate();
  const pageRef    = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const service    = SERVICES.find((s) => s.slug === slug);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  useEffect(() => {
    if (!service) return;
    const fb  = `${service.title} Services | 4AM Global Media`;
    const fd  = `Explore ${service.title.toLowerCase()} services from 4AM Global Media.`;
    const seo = SERVICE_SEO_OVERRIDES[service.slug] ?? { title: fb, description: fd };
    document.title = seo.title;
    const tag = document.querySelector('meta[name="description"]');
    if (tag) tag.setAttribute('content', seo.description);
  }, [service]);

  // ── Page animations ──────────────────────────────────────────────────
  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page || !service) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Hero image parallax
      if (heroImgRef.current) {
        gsap.to(heroImgRef.current, {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: { trigger: heroImgRef.current, start: 'top top', end: 'bottom top', scrub: 2 },
        });
      }

      // Hero text entrance
      const heroText = page.querySelector('.sp-hero-text');
      if (heroText) {
        const children = heroText.children;
        gsap.fromTo(children,
          { y: 40, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.1, ease: 'expo.out', delay: 0.2 }
        );
      }

      // Feature grid cards
      const features = gsap.utils.toArray<HTMLElement>('.sp-feature', page);
      features.forEach((el, i) => {
        gsap.fromTo(el,
          { y: 50, autoAlpha: 0 },
          {
            y: 0, autoAlpha: 1, duration: 0.9, delay: i * 0.07, ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          }
        );
      });

      // Benefit cards
      const benefits = gsap.utils.toArray<HTMLElement>('.sp-benefit', page);
      benefits.forEach((el, i) => {
        gsap.fromTo(el,
          { y: 40, autoAlpha: 0 },
          {
            y: 0, autoAlpha: 1, duration: 0.9, delay: i * 0.08, ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          }
        );
      });

      // Process steps — slide in from left
      const steps = gsap.utils.toArray<HTMLElement>('.sp-step', page);
      steps.forEach((el, i) => {
        gsap.fromTo(el,
          { x: -30, autoAlpha: 0 },
          {
            x: 0, autoAlpha: 1, duration: 1, delay: i * 0.1, ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        );
      });

      // Related project cards
      const relCards = gsap.utils.toArray<HTMLElement>('.sp-rel-card', page);
      relCards.forEach((el, i) => {
        gsap.fromTo(el,
          { y: 50, autoAlpha: 0 },
          {
            y: 0, autoAlpha: 1, duration: 1, delay: i * 0.1, ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          }
        );
        // Image hover scale
        const img = el.querySelector<HTMLElement>('img');
        if (img) {
          const onEnter = () => gsap.to(img, { scale: 1.07, duration: 0.8, ease: 'expo.out' });
          const onLeave = () => gsap.to(img, { scale: 1,    duration: 0.7, ease: 'expo.out' });
          el.addEventListener('mouseenter', onEnter);
          el.addEventListener('mouseleave', onLeave);
        }
      });

      // Stats counter-up numbers
      const statNums = gsap.utils.toArray<HTMLElement>('.sp-stat-num', page);
      statNums.forEach((el) => {
        const target = parseFloat(el.getAttribute('data-val') ?? '0');
        const suffix = el.getAttribute('data-suffix') ?? '';
        const isDecimal = target % 1 !== 0;
        const proxy = { val: 0 };
        gsap.to(proxy, {
          val: target,
          duration: 1.8,
          ease: 'power3.out',
          onUpdate: () => {
            el.textContent = (isDecimal ? proxy.val.toFixed(1) : Math.round(proxy.val)) + suffix;
          },
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });

      // CTA section entrance
      gsap.fromTo('.sp-cta',
        { y: 40, autoAlpha: 0 },
        {
          y: 0, autoAlpha: 1, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: '.sp-cta', start: 'top 85%', once: true },
        }
      );
    }, page);

    return () => ctx.revert();
  }, [service]);

  if (!service) return <Navigate to="/" replace />;

  const relatedProjects = PROJECTS.slice(0, 4);

  return (
    <div ref={pageRef} className="bg-black min-h-screen text-white">

      {/* ── Hero ── */}
      <section className="relative min-h-[75vh] flex items-end overflow-hidden pt-[70px] md:pt-[80px]">
        <div ref={heroImgRef} className="absolute inset-0 z-0">
          <img
            src={optimizeImageUrl(service.image, { width: 1920, height: 1080, quality: 72, format: 'webp' })}
            alt={service.title}
            loading="eager"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        </div>

        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="sp-hero-text max-w-3xl">
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-white/40 block mb-6">
              Our Services
            </span>
            <RevealText
              as="h1"
              className="block text-section-title text-white mb-6"
              start="top 90%"
            >
              {service.title.toUpperCase()}
            </RevealText>
            <p className="text-xl text-white/55 max-w-2xl leading-relaxed font-medium mb-10">
              {service.longDescription || service.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/', { state: { scrollTo: 'contact' } })}
                data-ripple
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-bold text-xs tracking-[0.2em] uppercase hover:bg-white/85 active:scale-95 transition-all duration-200"
              >
                Book Consultation
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M4 8h8M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <a
                href="#process"
                className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white font-bold text-xs tracking-[0.2em] uppercase hover:bg-white/8 transition-all duration-200"
              >
                See Our Process
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 md:py-32 bg-black border-t border-white/[0.07]">
        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="mb-16">
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-white/30 block mb-4">What We Offer</span>
            <RevealText as="h2" className="block text-section-title text-white">COMPREHENSIVE</RevealText>
            <RevealText as="h2" className="block text-section-title text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.15)' }} delay={0.1}>SOLUTIONS</RevealText>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-white/[0.04]">
            {service.features.map((feature, i) => (
              <div key={i} className="sp-feature bg-black p-8 md:p-10 hover:bg-white/[0.025] transition-colors duration-500 group">
                <span className="text-sm font-bold tracking-[0.15em] text-white/15 block mb-4">0{i + 1}</span>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 uppercase tracking-tight group-hover:text-white/80 transition-colors duration-300">{feature}</h3>
                <p className="text-white/35 text-sm leading-relaxed font-medium">
                  Professional {feature.toLowerCase()} tailored to elevate your brand presence.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Impact / Stats ── */}
      <section className="py-24 md:py-32 bg-black border-t border-white/[0.07]">
        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-white/30 block mb-4">Results</span>
              <RevealText as="h2" className="block text-section-title text-white mb-2">REAL</RevealText>
              <RevealText as="h2" className="block text-section-title text-transparent mb-8" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.15)' }} delay={0.1}>IMPACT</RevealText>
              <p className="text-white/45 text-lg leading-relaxed font-medium max-w-md mb-12">
                We deliver measurable outcomes. Every action contributes to your bottom line.
              </p>
              <div className="grid grid-cols-2 gap-8 border-t border-white/[0.07] pt-10">
                <div>
                  <div className="sp-stat-num text-5xl md:text-6xl font-black text-white tracking-[-0.03em]" data-val="240" data-suffix="%">0%</div>
                  <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/25 mt-2">Avg Traffic Increase</div>
                </div>
                <div>
                  <div className="sp-stat-num text-5xl md:text-6xl font-black text-white tracking-[-0.03em]" data-val="3.4" data-suffix="x">0x</div>
                  <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/25 mt-2">Revenue Growth</div>
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-px bg-white/[0.04]">
              {service.benefits.map((benefit, i) => (
                <div key={i} className="sp-benefit bg-black p-8 hover:bg-white/[0.025] transition-colors duration-500 group">
                  <div className="mb-4 w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center group-hover:border-white/20 transition-colors duration-300">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M4 8l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 uppercase tracking-tight">{benefit}</h3>
                  <p className="text-white/25 text-xs leading-relaxed">Proven strategies delivering {benefit.toLowerCase()}.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section id="process" className="py-24 md:py-32 bg-black border-t border-white/[0.07]">
        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="mb-16">
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-white/30 block mb-4">Our Process</span>
            <RevealText as="h2" className="block text-section-title text-white">HOW WE</RevealText>
            <RevealText as="h2" className="block text-section-title text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.15)' }} delay={0.1}>WORK</RevealText>
          </div>
          <div className="divide-y divide-white/[0.07] border-t border-white/[0.07]">
            {service.process.map((step, i) => (
              <div key={i} className="sp-step py-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-12 group hover:bg-white/[0.01] transition-colors duration-300 px-2">
                <span className="text-5xl md:text-7xl font-black text-white/[0.08] shrink-0 w-20 group-hover:text-white/[0.12] transition-colors duration-400">{i + 1}</span>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight mb-3 group-hover:text-white/80 transition-colors duration-300">{step.title}</h3>
                  <p className="text-white/35 text-base leading-relaxed font-medium max-w-lg">{step.description}</p>
                </div>
                <div className="w-9 h-9 rounded-full border border-white/[0.06] flex items-center justify-center text-white/20 group-hover:border-white/20 group-hover:text-white/40 transition-all duration-300 shrink-0">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M4 8h8M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related Work ── */}
      <section className="py-24 md:py-32 bg-black border-t border-white/[0.07]">
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-white/30 block mb-4">Related</span>
              <RevealText as="h2" className="block text-section-title text-white">CASE STUDIES</RevealText>
            </div>
            <button
              onClick={() => { navigate('/'); setTimeout(() => scrollToSection('work'), 200); }}
              className="hidden md:flex items-center gap-2 text-white text-xs font-bold uppercase tracking-[0.2em] hover:text-white/50 transition-colors duration-300 hover-underline"
            >
              View all
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProjects.map((project) => (
              <div
                key={project.id}
                className="sp-rel-card group cursor-pointer"
                onClick={() => window.open(project.url, '_blank', 'noopener,noreferrer')}
              >
                <div className="aspect-[4/5] overflow-hidden bg-white/[0.03] mb-4">
                  <img
                    src={`https://picsum.photos/seed/${encodeURIComponent(project.title)}/600/750`}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100"
                    style={{ transformOrigin: 'center center' }}
                  />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-white/50 transition-colors duration-300">{project.title}</h3>
                {project.result && (
                  <span className="text-[10px] font-bold text-white/25 tracking-wider uppercase mt-1 block">{project.result}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 md:py-32 bg-black border-t border-white/[0.07]">
        <div className="sp-cta w-full max-w-[900px] mx-auto px-6 md:px-10 text-center">
          <RevealText as="h2" className="block text-display text-white mb-2">READY TO</RevealText>
          <RevealText as="h2" className="block text-display text-transparent mb-10" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.15)' }} delay={0.1}>TRANSFORM?</RevealText>
          <p className="text-white/35 text-lg mb-14 max-w-lg mx-auto font-medium leading-relaxed">
            Partner with us to build a {service.title.toLowerCase()} strategy that scales and compounds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/', { state: { scrollTo: 'contact' } })}
              data-ripple
              className="px-10 py-5 bg-white text-black font-bold text-xs tracking-[0.2em] uppercase hover:bg-white/85 active:scale-95 transition-all duration-200 inline-flex items-center justify-center gap-3"
            >
              Start Your Project
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M4 8h8M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <a
              href="tel:8826406545"
              className="px-10 py-5 border border-white/20 text-white font-bold text-xs tracking-[0.2em] uppercase hover:bg-white/[0.06] transition-all duration-200 inline-flex items-center justify-center"
            >
              Schedule a Call
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicePage;
