
import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { scrollToSection } from '../utils/scroll';

const ROTATING_TEXTS = [
  'Web Solutions',
  'Digital Marketing',
  'SEO',
  'Branding',
  'Social Media Growth',
  'Web Development',
  'Content Creation',
];

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ROTATING_TEXTS.length);
        setIsAnimating(false);
      }, 500);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" ref={containerRef} className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-12 overflow-hidden bg-transparent">
      {/* ── Animated hero background visualization ── */}
      <style>{`
        @keyframes rotateTextIn {
          0% { opacity: 0; transform: translateY(30px) rotateX(-40deg); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0) rotateX(0deg); filter: blur(0); }
        }
        @keyframes rotateTextOut {
          0% { opacity: 1; transform: translateY(0) rotateX(0deg); filter: blur(0); }
          100% { opacity: 0; transform: translateY(-30px) rotateX(40deg); filter: blur(4px); }
        }
        .text-rotate-in {
          animation: rotateTextIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .text-rotate-out {
          animation: rotateTextOut 0.5s cubic-bezier(0.7, 0, 0.84, 0) forwards;
        }

        /* Hero background effects */
        @keyframes hero-pulse-1 {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.65; transform: translate(-50%, -50%) scale(1.15); }
        }
        @keyframes hero-pulse-2 {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1.1); }
          50% { opacity: 0.55; transform: translate(-50%, -50%) scale(0.9); }
        }
        @keyframes hero-float-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(30px, -20px) rotate(2deg); }
          50% { transform: translate(-10px, -40px) rotate(-1deg); }
          75% { transform: translate(-30px, -10px) rotate(1deg); }
        }
        @keyframes hero-float-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-25px, 20px) rotate(-2deg); }
          66% { transform: translate(20px, 30px) rotate(1.5deg); }
        }
        @keyframes hero-grid-fade {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.16; }
        }
        @keyframes hero-beam {
          0% { transform: translateX(-100%) rotate(-45deg); }
          100% { transform: translateX(200%) rotate(-45deg); }
        }
        @keyframes hero-sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        .hero-orb-1 {
          animation: hero-pulse-1 6s ease-in-out infinite, hero-float-1 20s ease-in-out infinite;
        }
        .hero-orb-2 {
          animation: hero-pulse-2 8s ease-in-out infinite, hero-float-2 25s ease-in-out infinite;
        }
        .hero-orb-3 {
          animation: hero-pulse-1 10s ease-in-out infinite 2s, hero-float-2 18s ease-in-out infinite;
        }
        .hero-grid {
          animation: hero-grid-fade 8s ease-in-out infinite;
        }
        .hero-beam {
          animation: hero-beam 8s ease-in-out infinite;
        }
        .hero-beam-2 {
          animation: hero-beam 12s ease-in-out infinite 3s;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-orb-1, .hero-orb-2, .hero-orb-3, .hero-grid,
          .hero-beam, .hero-beam-2 {
            animation: none !important;
          }
        }
      `}</style>

      {/* ── Background Layer: Gradient orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Primary brand glow — center-left */}
        <div
          className="hero-orb-1 absolute w-[600px] h-[600px] md:w-[900px] md:h-[900px] rounded-full"
          style={{
            top: '40%',
            left: '25%',
            background: 'radial-gradient(circle, rgba(255,138,61,0.45) 0%, rgba(255,138,61,0.12) 40%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Secondary gold glow — top-right */}
        <div
          className="hero-orb-2 absolute w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full"
          style={{
            top: '10%',
            right: '10%',
            background: 'radial-gradient(circle, rgba(255,197,106,0.35) 0%, rgba(255,197,106,0.10) 45%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />
        {/* Accent cyan glow — bottom-right (tech feel) */}
        <div
          className="hero-orb-3 absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full"
          style={{
            bottom: '5%',
            right: '20%',
            background: 'radial-gradient(circle, rgba(0,209,255,0.25) 0%, rgba(0,209,255,0.08) 45%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* ── Grid overlay ── */}
        <div
          className="hero-grid absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,138,61,0.12) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,138,61,0.12) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 70%)',
          }}
        />

        {/* ── Diagonal light beams ── */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.08]">
          <div
            className="hero-beam absolute top-0 left-0 w-[200%] h-[120px]"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,138,61,0.8), transparent)',
              transformOrigin: 'top left',
            }}
          />
          <div
            className="hero-beam-2 absolute top-[30%] left-0 w-[200%] h-[80px]"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(0,209,255,0.6), transparent)',
              transformOrigin: 'top left',
            }}
          />
        </div>

        {/* ── Subtle noise texture ── */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px',
          }}
        />

        {/* ── Floating sparkle dots ── */}
        {[
          { top: '18%', left: '12%', delay: '0s', size: 3 },
          { top: '72%', left: '8%', delay: '2s', size: 2 },
          { top: '25%', right: '18%', delay: '1s', size: 4 },
          { top: '65%', right: '12%', delay: '3s', size: 2 },
          { top: '45%', left: '5%', delay: '4s', size: 3 },
          { top: '80%', right: '30%', delay: '1.5s', size: 2 },
          { top: '10%', left: '45%', delay: '2.5s', size: 3 },
          { top: '55%', right: '5%', delay: '0.5s', size: 2 },
        ].map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: dot.top,
              left: dot.left,
              right: (dot as { right?: string }).right,
              width: dot.size,
              height: dot.size,
              opacity: 0,
              animation: `hero-sparkle 4s ease-in-out ${dot.delay} infinite`,
            }}
          />
        ))}

        {/* ── Horizontal accent line across hero ── */}
        <div
          className="absolute left-0 right-0 h-px"
          style={{
            top: '82%',
            background: 'linear-gradient(90deg, transparent 5%, rgba(255,138,61,0.25) 30%, rgba(0,209,255,0.18) 70%, transparent 95%)',
          }}
        />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 w-full max-w-[1000px] mx-auto px-6 text-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-lg text-gray-300 text-sm font-medium tracking-wide uppercase animate-fade-in-up">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_12px_rgba(255,138,61,0.8)]" />
            Accepting New Projects
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.1] animate-fade-in-up animation-delay-100 drop-shadow-2xl">
            We Build Growth Through<br className="hidden md:block" />
            <span className="inline-block overflow-hidden" style={{ perspective: '600px' }}>
              <span
                key={currentIndex}
                className={`inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary bg-[length:200%_auto] animate-text-shimmer ${isAnimating ? 'text-rotate-out' : 'text-rotate-in'
                  }`}
              >
                {ROTATING_TEXTS[currentIndex]}
              </span>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium animate-fade-in-up animation-delay-200">
            Powering founders, operators, and teams across the globe with strategy, execution, and measurable growth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 animate-fade-in-up animation-delay-300">
            <button
              onClick={() => scrollToSection('work')}
              className="group relative px-8 py-4 bg-gradient-primary text-white rounded-full font-bold tracking-wide shadow-[0_0_20px_rgba(255,138,61,0.4)] hover:shadow-[0_0_30px_rgba(255,138,61,0.6)] hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center justify-center gap-2 drop-shadow-md">
                View Our Work
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              className="px-8 py-4 bg-white/5 backdrop-blur-sm text-white border border-white/10 rounded-full font-bold tracking-wide shadow-lg hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
            >
              Start a Project
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-40 hidden md:block">
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
          <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-scroll shadow-[0_0_8px_rgba(255,138,61,0.8)]" />
        </div>
      </div>
    </section>
  );
};

export default Hero;

