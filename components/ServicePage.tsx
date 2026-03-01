import React, { useEffect } from 'react';
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  ArrowUpRight, 
  Check, 
  Star, 
  Zap, 
  TrendingUp, 
  Users, 
  Award,
  ChevronRight
} from 'lucide-react';
import { SERVICES, PROJECTS } from '../constants';
import ScrollReveal from './ScrollReveal';

const ServicePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const service = SERVICES.find((s) => s.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!service) {
    return <Navigate to="/" replace />;
  }

  // Get relevant projects (first 3 for now, or filter by category if possible)
  const relatedProjects = PROJECTS.slice(0, 3);

  return (
    <div className="bg-brand-bg min-h-screen">
      {/* 1. Hero Section - Enhanced with Gradient & Texture */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Background Image with Premium Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/90 to-brand-dark/60" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        </div>

        <div className="relative z-10 container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center py-24">
          <ScrollReveal>
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/20 border border-brand-primary/30 backdrop-blur-sm text-brand-primary text-sm font-bold tracking-wide mb-8 shadow-sm">
                <Star className="w-4 h-4 fill-brand-primary" />
                <span>Premium {service.title} Services</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 leading-tight drop-shadow-lg">
                {service.title}
              </h1>
              <p className="text-xl text-stone-200 mb-10 leading-relaxed font-light max-w-lg">
                {service.longDescription || service.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <button
                  onClick={() => navigate('/', { state: { scrollTo: 'contact' } })}
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-full font-bold tracking-wide hover:shadow-clay-hover transition-all transform hover:-translate-y-1 shadow-clay cursor-pointer"
                >
                  Book Consultation
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <a
                  href="#process"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white rounded-full font-bold tracking-wide hover:bg-white/20 transition-all backdrop-blur-md border border-white/20 hover:border-white/40"
                >
                  See Our Process
                </a>
              </div>
            </div>
          </ScrollReveal>
          
          {/* Abstract Visual/Illustration on the right (Desktop) */}
          <div className="hidden md:block relative">
             <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-10 transform rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                   <div className="flex -space-x-3">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-12 h-12 rounded-full bg-brand-dark border-2 border-brand-gray/50 flex items-center justify-center text-xs text-white shadow-lg">
                           <Users className="w-5 h-5 text-brand-gray" />
                        </div>
                      ))}
                   </div>
                   <div className="text-right">
                      <div className="text-3xl font-bold text-white">200+</div>
                      <div className="text-xs text-stone-300 uppercase tracking-wider font-semibold">Happy Clients</div>
                   </div>
                </div>
                <div className="space-y-5">
                   <div className="h-3 bg-white/10 rounded-full w-3/4" />
                   <div className="h-3 bg-white/10 rounded-full w-1/2" />
                   <div className="h-3 bg-white/10 rounded-full w-full" />
                </div>
                <div className="mt-10 pt-8 border-t border-white/10 flex items-center gap-5">
                   <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                      <TrendingUp className="w-7 h-7" />
                   </div>
                   <div>
                      <div className="text-sm text-stone-300 uppercase tracking-wider font-semibold">Average ROI</div>
                      <div className="text-2xl font-bold text-white">+150% Growth</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 2. Stats / Trust Strip */}
      <div className="bg-brand-surface border-b border-brand-gray/10 py-10 relative z-20 -mt-8 rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto px-6 flex flex-wrap justify-center md:justify-between gap-8 items-center">
           {['Trusted by 50+ Brands', '98% Client Satisfaction', 'Award Winning Agency', '24/7 Support'].map((stat, i) => (
             <div key={i} className="flex items-center gap-3 font-bold text-brand-gray text-sm md:text-base uppercase tracking-wide">
               <CheckCircle className="w-5 h-5 text-brand-primary" />
               {stat}
             </div>
           ))}
        </div>
      </div>

      {/* 3. What We Offer - Enhanced Cards */}
      <section className="py-20 bg-brand-bg relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-20 left-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-brand-secondary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-[1200px] relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <span className="text-brand-primary font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Our Expertise</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-dark mb-6">
                Comprehensive {service.title} Solutions
              </h2>
              <p className="text-lg text-brand-gray leading-relaxed">
                We provide end-to-end services designed to tackle your unique challenges and drive measurable business results.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {service.features.map((feature, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="bg-brand-surface p-10 rounded-[32px] border border-white/60 shadow-clay hover:shadow-clay-hover hover:-translate-y-2 transition-all duration-300 group h-full flex flex-col">
                  <div className="w-16 h-16 rounded-2xl bg-brand-bg flex items-center justify-center mb-8 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 shadow-inner">
                    <Zap className="w-8 h-8 text-brand-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-dark mb-4">{feature}</h3>
                  <p className="text-brand-gray leading-relaxed mb-8 flex-grow">
                    Professional {feature.toLowerCase()} tailored to elevate your brand presence and engage your target audience effectively.
                  </p>
                  <div className="flex items-center text-brand-primary font-bold text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform cursor-pointer">
                    Learn more <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Benefits / Results - Dark Premium Section (Refined for Warmth) */}
      <section className="py-20 bg-brand-dark text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-[1200px] relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-8 leading-tight">
                Real Results for<br/>Real Businesses
              </h2>
              <p className="text-stone-400 text-lg mb-10 leading-relaxed max-w-md font-light">
                We don't just deliver tasks; we deliver measurable outcomes. Our strategic approach ensures every action contributes to your bottom line.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-lg backdrop-blur-sm">
                      <TrendingUp className="w-7 h-7 text-emerald-400" />
                   </div>
                   <div>
                      <div className="text-3xl font-bold">240%</div>
                      <div className="text-sm text-stone-400 uppercase tracking-wider">Average Traffic Increase</div>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-lg backdrop-blur-sm">
                      <Award className="w-7 h-7 text-brand-secondary" />
                   </div>
                   <div>
                      <div className="text-3xl font-bold">#1</div>
                      <div className="text-sm text-stone-400 uppercase tracking-wider">Ranked Agency</div>
                   </div>
                </div>
              </div>

              <div className="mt-12">
                <button
                  onClick={() => navigate('/', { state: { scrollTo: 'contact' } })}
                  className="inline-flex items-center text-white border-b-2 border-brand-primary pb-1 hover:text-brand-primary transition-colors font-bold cursor-pointer bg-transparent tracking-wide"
                >
                  Start your growth journey <ArrowUpRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 gap-6">
              {service.benefits.map((benefit, index) => (
                <ScrollReveal key={index} delay={index * 100}>
                  <div className="bg-white/5 p-8 rounded-[24px] border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-md group hover:-translate-y-1 duration-300">
                    <div className="mb-6 w-12 h-12 rounded-2xl bg-brand-primary/20 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform border border-brand-primary/20">
                      <Check className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{benefit}</h3>
                    <p className="text-stone-400 text-sm leading-relaxed">Experience the advantage of {benefit.toLowerCase()} with our proven strategies.</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Process Section - Timeline Style */}
      <section id="process" className="py-24 bg-brand-surface relative">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <ScrollReveal>
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-dark mb-6">
                How We Work
              </h2>
              <p className="text-brand-gray max-w-2xl mx-auto text-lg">
                A proven 4-step framework designed for transparency, efficiency, and consistent results.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-14 left-0 w-full h-[3px] bg-brand-gray/10 rounded-full" />

            {service.process.map((step, index) => (
              <ScrollReveal key={index} delay={index * 150}>
                <div className="relative pt-10 group">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-28 bg-brand-surface rounded-full flex items-center justify-center border-8 border-brand-surface z-10">
                     <div className="w-20 h-20 rounded-full bg-brand-bg text-brand-dark flex items-center justify-center text-2xl font-bold shadow-clay group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 border border-white/50">
                        {index + 1}
                     </div>
                  </div>
                  
                  <div className="mt-16 bg-brand-bg p-8 rounded-[32px] border border-white/60 text-center h-full shadow-clay hover:shadow-clay-hover transition-all duration-300 hover:-translate-y-2">
                    <h3 className="text-xl font-bold text-brand-dark mb-4 mt-4">{step.title}</h3>
                    <p className="text-brand-gray text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Success Stories / Projects */}
      <section className="py-24 bg-brand-bg border-t border-brand-gray/10">
         <div className="container mx-auto px-6 max-w-[1200px]">
            <ScrollReveal>
               <div className="flex justify-between items-end mb-12">
                  <div>
                     <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-dark mb-4">Success Stories</h2>
                     <p className="text-brand-gray">See how we've helped others achieve their goals.</p>
                  </div>
                  <Link to="/" className="text-brand-primary font-bold hover:underline hidden md:block uppercase tracking-wider text-sm">View all projects</Link>
               </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8">
               {relatedProjects.map((project, idx) => (
                  <ScrollReveal key={project.id} delay={idx * 100}>
                     <div className="group bg-brand-surface rounded-[32px] overflow-hidden shadow-clay hover:shadow-clay-hover transition-all duration-300 border border-white/60 flex flex-col h-full hover:-translate-y-2">
                        <div className="h-56 overflow-hidden relative">
                           <img src={`https://picsum.photos/seed/${project.title}/600/400`} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                           <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-brand-dark/10 transition-colors" />
                           <div className="absolute top-4 left-4">
                              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-dark shadow-sm">
                                {project.industry}
                              </span>
                           </div>
                        </div>
                        <div className="p-8 flex-grow flex flex-col">
                           <h3 className="text-xl font-bold text-brand-dark mb-3">{project.title}</h3>
                           <div className="flex items-center gap-2 text-sm text-brand-gray mb-6">
                              <TrendingUp className="w-4 h-4 text-emerald-500" />
                              <span className="font-semibold">{project.result || 'Significant Growth'}</span>
                           </div>
                           <div className="mt-auto pt-6 border-t border-brand-gray/10">
                              <div className="text-brand-primary font-bold text-sm flex items-center uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                                 View Case Study <ArrowRight className="w-4 h-4 ml-1" />
                              </div>
                           </div>
                        </div>
                     </div>
                  </ScrollReveal>
               ))}
            </div>
         </div>
      </section>

      {/* 7. Strong CTA Section */}
      <section className="py-24 relative overflow-hidden bg-brand-dark">
        <div className="absolute inset-0 bg-brand-dark z-0">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/20 rounded-full blur-[150px]" />
           <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-secondary/10 rounded-full blur-[150px]" />
        </div>
        
        <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight">
              Ready to transform your<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">{service.title}?</span>
            </h2>
            <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Don't let another day pass with average results. Partner with us to build a strategy that scales.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => navigate('/', { state: { scrollTo: 'contact' } })}
                className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-full font-bold text-lg tracking-wide hover:shadow-lg transition-all transform hover:-translate-y-1 shadow-brand-primary/30 cursor-pointer"
              >
                Start Your Project
                <ArrowRight className="ml-2 w-6 h-6" />
              </button>
              <a
                href="tel:+1234567890"
                className="inline-flex items-center justify-center px-10 py-5 bg-transparent border border-white/20 text-white rounded-full font-bold text-lg tracking-wide hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                Schedule a Call
              </a>
            </div>
            <div className="mt-12 flex items-center justify-center gap-6 text-stone-400 text-sm font-medium">
               <div className="flex items-center gap-2">
                 <CheckCircle className="w-5 h-5 text-emerald-500" /> No obligation
               </div>
               <div className="w-1.5 h-1.5 rounded-full bg-stone-700" />
               <div className="flex items-center gap-2">
                 <CheckCircle className="w-5 h-5 text-emerald-500" /> Free strategy session
               </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default ServicePage;
