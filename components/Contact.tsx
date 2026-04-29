import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import RevealText from './RevealText';

type FormErrors = Partial<Record<keyof FormState, string>>;
interface FormState {
  fullName: string;
  workEmail: string;
  phone: string;
  company: string;
  interestedIn: string;
  budget: string;
  message: string;
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[a-zA-Z\s'.'-]{2,}$/;
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

const inputClasses = (hasError: boolean) =>
  `w-full bg-transparent border-b ${hasError ? 'border-red-500/50' : 'border-white/[0.08]'} px-0 py-4 text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-white/30 transition-all duration-300 font-medium`;

const selectClasses = (hasError: boolean) =>
  `w-full bg-transparent border-b ${hasError ? 'border-red-500/50' : 'border-white/[0.08]'} px-0 py-4 text-white text-sm focus:outline-none focus:border-white/30 transition-all duration-300 font-medium appearance-none`;

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [form, setForm] = useState<FormState>({
    fullName: '', workEmail: '', phone: '', company: '',
    interestedIn: '', budget: '', message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

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
    try {
      const response = await fetch("https://formsubmit.co/ajax/4amglobalmedia@gmail.com", {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ ...form, _subject: `New Inquiry from ${form.fullName}`, _template: "table", email: form.workEmail }),
      });
      setStatus(response.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="relative py-16 md:py-24 bg-black border-t border-white/[0.06]">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="contact-heading mb-10 md:mb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-[10px] md:text-[11px] font-bold tracking-[0.35em] uppercase text-white/25 block mb-5"
          >
            Get in Touch
          </motion.span>
          <RevealText
            as="h2"
            className="text-[8vw] md:text-[6vw] lg:text-[5vw] font-black uppercase tracking-[-0.03em] leading-[0.9] text-white"
          >
            LET'S WORK
          </RevealText>
          <RevealText
            as="h2"
            className="text-[8vw] md:text-[6vw] lg:text-[5vw] font-black uppercase tracking-[-0.03em] leading-[0.9] text-transparent"
            style={{ WebkitTextStroke: '2px rgba(255,255,255,0.12)' }}
            delay={0.15}
          >
            TOGETHER
          </RevealText>
          <motion.p
            initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="mt-6 text-white/30 text-sm md:text-base leading-relaxed font-medium max-w-lg"
          >
            Share your vision. We will reply with a clear next step within 24 hours.
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="contact-body grid grid-cols-1 lg:grid-cols-5 gap-14">
          {/* Info — stagger each item from left */}
          <motion.div
            className="lg:col-span-2 space-y-10"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
          >
            {[
              { label: 'Email', content: <a href="mailto:4amglobalmedia@gmail.com" className="text-base md:text-lg font-bold text-white hover:text-white/50 transition-colors break-all">4amglobalmedia@gmail.com</a> },
              { label: 'Phone', content: <a href="tel:8826406545" className="text-base md:text-lg font-bold text-white hover:text-white/50 transition-colors">8826406545</a> },
              { label: 'Location', content: <p className="text-base md:text-lg font-bold text-white">Global / Remote Team</p> },
            ].map(({ label, content }) => (
              <motion.div
                key={label}
                variants={{ hidden: { x: -30, opacity: 0 }, show: { x: 0, opacity: 1 } }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/20 mb-2">{label}</div>
                {content}
              </motion.div>
            ))}
            <motion.div
              className="pt-8 border-t border-white/[0.06]"
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/25">
                  Accepting new projects
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Form — slides in from right */}
          <motion.div
            className="lg:col-span-3"
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-full border border-white/[0.1] flex items-center justify-center mb-6">
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                    <path d="M4 8l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Message Sent</h3>
                <p className="text-white/30 mb-8 max-w-xs text-xs font-medium">
                  We'll review your request and get back within 24 hours.
                </p>
                <button
                  onClick={() => { setStatus('idle'); setForm({ fullName: '', workEmail: '', phone: '', company: '', interestedIn: '', budget: '', message: '' }); }}
                  className="text-white/50 text-[10px] font-bold uppercase tracking-[0.25em] hover:text-white transition-colors"
                >
                  Send another →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-0" noValidate>
                {status === 'error' && (
                  <div className="px-4 py-3 border-b border-red-500/20 text-red-400 text-xs font-medium mb-2">
                    Something went wrong. Please try again.
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <div className="field-wrap">
                    <input type="text" value={form.fullName} onChange={(e) => updateField('fullName', e.currentTarget.value)}
                      className={inputClasses(!!errors.fullName)} placeholder="Full Name *"
                      aria-label="Full Name" aria-required="true" />
                    {errors.fullName && <p className="text-red-400 text-[10px] mt-1">{errors.fullName}</p>}
                  </div>
                  <div className="field-wrap">
                    <input type="email" value={form.workEmail} onChange={(e) => updateField('workEmail', e.currentTarget.value)}
                      className={inputClasses(!!errors.workEmail)} placeholder="Work Email *"
                      aria-label="Work Email" aria-required="true" />
                    {errors.workEmail && <p className="text-red-400 text-[10px] mt-1">{errors.workEmail}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <div className="field-wrap">
                    <input type="tel" value={form.phone} onChange={(e) => updateField('phone', e.currentTarget.value)}
                      className={inputClasses(!!errors.phone)} placeholder="Phone"
                      aria-label="Phone" />
                    {errors.phone && <p className="text-red-400 text-[10px] mt-1">{errors.phone}</p>}
                  </div>
                  <div className="field-wrap">
                    <input type="text" value={form.company} onChange={(e) => updateField('company', e.currentTarget.value)}
                      className={inputClasses(false)} placeholder="Company"
                      aria-label="Company" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <div className="field-wrap">
                    <select value={form.interestedIn} onChange={(e) => updateField('interestedIn', e.currentTarget.value)}
                      className={selectClasses(!!errors.interestedIn)}
                      aria-label="Interested In" aria-required="true">
                      <option value="" className="bg-black">Interested In *</option>
                      <option value="web-development" className="bg-black">Web Development</option>
                      <option value="social-media" className="bg-black">Social Media</option>
                      <option value="seo" className="bg-black">SEO</option>
                      <option value="paid-ads" className="bg-black">Paid Ads</option>
                      <option value="branding" className="bg-black">Branding</option>
                      <option value="content-creation" className="bg-black">Content Creation</option>
                      <option value="other" className="bg-black">Other</option>
                    </select>
                    {errors.interestedIn && <p className="text-red-400 text-[10px] mt-1">{errors.interestedIn}</p>}
                  </div>
                  <div className="field-wrap">
                    <select value={form.budget} onChange={(e) => updateField('budget', e.currentTarget.value)}
                      className={selectClasses(!!errors.budget)}
                      aria-label="Budget Range" aria-required="true">
                      <option value="" className="bg-black">Budget Range *</option>
                      <option value="under-500" className="bg-black">Under $500</option>
                      <option value="500-1500" className="bg-black">$500 – $1,500</option>
                      <option value="1500-5000" className="bg-black">$1,500 – $5,000</option>
                      <option value="5000-15000" className="bg-black">$5,000 – $15,000</option>
                      <option value="15000-plus" className="bg-black">$15,000+</option>
                    </select>
                    {errors.budget && <p className="text-red-400 text-[10px] mt-1">{errors.budget}</p>}
                  </div>
                </div>

                <div className="field-wrap">
                  <textarea rows={4} value={form.message} onChange={(e) => updateField('message', e.currentTarget.value)}
                    className={`${inputClasses(!!errors.message)} resize-none`}
                    placeholder="Tell us about your project... *"
                    aria-label="Message" aria-required="true" />
                  {errors.message && <p className="text-red-400 text-[10px] mt-1">{errors.message}</p>}
                </div>

                <div className="pt-8">
                  <button
                    type="submit"
                    data-ripple
                    disabled={status === 'submitting'}
                    className="inline-flex items-center justify-center px-10 py-4 bg-white text-black font-bold text-[11px] tracking-[0.2em] uppercase hover:bg-white/90 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed gap-3 rounded-full"
                  >
                    {status === 'submitting' ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="opacity-20"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                        Sending...
                      </span>
                    ) : (
                      <>
                        Send Message
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
