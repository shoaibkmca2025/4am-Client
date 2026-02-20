import React from 'react';
import { motion } from 'framer-motion';
import { Star, Code, Terminal, Zap } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        quote: "The velocity at which 4AM deployed our infrastructure was unprecedented. They don't just build; they architect growth.",
        author: "Sarah J.",
        role: "CTO, FinTech Scaleup",
        icon: Code,
        colSpan: "col-span-1 md:col-span-2",
    },
    {
        id: 2,
        quote: "Precision engineering meets creative brilliance. A rare combination.",
        author: "Michael R.",
        role: "Founder, SaaS Platform",
        icon: Terminal,
        colSpan: "col-span-1",
    },
    {
        id: 3,
        quote: "Our conversion rates doubled within 30 days of the deployment.",
        author: "Elena V.",
        role: "VP Marketing, E-com Giant",
        icon: Zap,
        colSpan: "col-span-1",
    },
    {
        id: 4,
        quote: "They speak the language of ROI. No fluff, just hard data and results.",
        author: "David K.",
        role: "Director, Global Logistics",
        icon: Star,
        colSpan: "col-span-1 md:col-span-2",
    }
];

const Testimonials: React.FC = () => {
    return (
        <section className="py-32 bg-gradient-to-b from-white via-slate-50 to-white dark:from-brand-dark dark:via-black dark:to-brand-obsidian overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="max-w-3xl mb-24">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-[2px] bg-brand-primary" />
                        <span className="text-brand-primary font-mono font-bold tracking-[0.3em] uppercase text-xs">What our clients say</span>
                    </div>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-zinc-900 dark:text-white leading-[1.1]">
                        Teams stay with us
                        <br />
                        because the work keeps paying off.
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`${t.colSpan} p-8 glass rounded-[2rem] border border-zinc-200 dark:border-white/5 flex flex-col justify-between group hover:border-brand-primary/30 transition-all duration-500`}
                        >
                            <div className="mb-8 relative">
                                <div className="absolute -left-2 -top-2 text-brand-primary/10 text-6xl font-serif font-black">"</div>
                                <p className="text-lg md:text-xl font-medium text-zinc-700 dark:text-zinc-200 leading-relaxed relative z-10">
                                    {t.quote}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 pt-6 border-t border-zinc-100 dark:border-white/5">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-primary/10 via-brand-accent/10 to-brand-signal/10 dark:from-brand-primary/20 dark:via-brand-accent/20 dark:to-brand-signal/20 flex items-center justify-center text-brand-primary dark:text-brand-signal">
                                    <t.icon size={18} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm uppercase tracking-wide">{t.author}</h4>
                                    <p className="text-xs text-zinc-400 font-mono uppercase tracking-widest">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
