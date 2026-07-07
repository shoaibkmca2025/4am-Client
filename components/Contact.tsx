import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import RevealText from './RevealText';
import DrawRule from './DrawRule';

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fieldVariant = {
  hidden: { y: 22, opacity: 0 },
  show:   { y: 0,  opacity: 1 },
};

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

// text-base on mobile (16px) prevents phones from auto-zooming the page
// when a field gains focus; desktop keeps the original 14px.
const inputClasses = (hasError: boolean) =>
  `peer w-full bg-transparent border-b ${hasError ? 'border-red-500/50' : 'border-white/[0.08]'} px-0 pt-6 pb-3 text-white text-base md:text-sm placeholder-transparent focus:outline-none focus:border-brand-primary/40 transition-all duration-300 font-medium`;

const selectClasses = (hasError: boolean) =>
  `w-full bg-transparent border-b ${hasError ? 'border-red-500/50' : 'border-white/[0.08]'} px-0 pt-2 pb-3 pr-6 text-white text-base md:text-sm focus:outline-none focus:border-brand-primary/40 transition-all duration-300 font-medium appearance-none cursor-pointer`;

// Floating label: rests inside the empty field, floats up (and turns gold)
// on focus or once the field has a value — never disappears while typing.
const floatLabelClasses =
  'absolute left-0 top-0 text-[9px] font-bold tracking-[0.2em] uppercase text-white/50 transition-all duration-300 pointer-events-none ' +
  'peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-white/40 ' +
  'peer-focus:top-0 peer-focus:text-[9px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:text-brand-secondary';

const staticLabelClasses =
  'block text-[9px] font-bold tracking-[0.2em] uppercase text-white/50 mb-1';

const SelectChevron: React.FC = () => (
  <svg
    className="absolute right-0 bottom-4 pointer-events-none text-white/30"
    width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"
  >
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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
    <section id="contact" ref={sectionRef} className="relative py-16 md:py-24 bg-transparent border-t border-white/[0.06]">
      <DrawRule />
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="contact-heading mb-10 md:mb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-[10px] md:text-[11px] font-bold tracking-[0.35em] uppercase text-brand-primary/80 block mb-5"
          >
            08 · Get in Touch
          </motion.span>
          <RevealText
            as="h2"
            className="text-[9vw] md:text-[5vw] lg:text-[3.8vw] font-black uppercase tracking-[-0.03em] leading-[0.95] text-white"
          >
            LET'S WORK
          </RevealText>
          <RevealText
            as="h2"
            className="text-[9vw] md:text-[5vw] lg:text-[3.8vw] font-black uppercase tracking-[-0.03em] leading-[0.95]"
            wordClassName="text-gradient-brand"
            delay={0.15}
          >
            TOGETHER
          </RevealText>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="mt-6 text-white/60 text-base leading-relaxed font-medium max-w-lg"
          >
            Share your vision. We will reply with a clear next step within 24 hours.
          </motion.p>

          {/* Response-time badge pops in */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 12 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.4 }}
            className="inline-flex items-center gap-2.5 mt-5 rounded-full border border-brand-lime/30 bg-brand-lime/10 px-4 py-2"
          >
            <span className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-lime/90">
              Online now — replies in under 24h
            </span>
          </motion.div>
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
                <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/45 mb-2">{label}</div>
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

          {/* Form — stagger field reveal */}
          <motion.div
            className="lg:col-span-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } }}
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

                <motion.div variants={fieldVariant} transition={{ duration: 0.65, ease: E }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <div className="field-wrap relative">
                    <input id="cf-name" type="text" value={form.fullName} onChange={(e) => updateField('fullName', e.currentTarget.value)}
                      className={inputClasses(!!errors.fullName)} placeholder=" "
                      autoComplete="name" aria-required="true" />
                    <label htmlFor="cf-name" className={floatLabelClasses}>Full Name *</label>
                    {errors.fullName && <p className="text-red-400 text-[10px] mt-1">{errors.fullName}</p>}
                  </div>
                  <div className="field-wrap relative">
                    <input id="cf-email" type="email" value={form.workEmail} onChange={(e) => updateField('workEmail', e.currentTarget.value)}
                      className={inputClasses(!!errors.workEmail)} placeholder=" "
                      autoComplete="email" aria-required="true" />
                    <label htmlFor="cf-email" className={floatLabelClasses}>Work Email *</label>
                    {errors.workEmail && <p className="text-red-400 text-[10px] mt-1">{errors.workEmail}</p>}
                  </div>
                </motion.div>

                <motion.div variants={fieldVariant} transition={{ duration: 0.65, ease: E }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <div className="field-wrap relative">
                    <input id="cf-phone" type="tel" value={form.phone} onChange={(e) => updateField('phone', e.currentTarget.value)}
                      className={inputClasses(!!errors.phone)} placeholder=" "
                      autoComplete="tel" />
                    <label htmlFor="cf-phone" className={floatLabelClasses}>Phone</label>
                    {errors.phone && <p className="text-red-400 text-[10px] mt-1">{errors.phone}</p>}
                  </div>
                  <div className="field-wrap relative">
                    <input id="cf-company" type="text" value={form.company} onChange={(e) => updateField('company', e.currentTarget.value)}
                      className={inputClasses(false)} placeholder=" "
                      autoComplete="organization" />
                    <label htmlFor="cf-company" className={floatLabelClasses}>Company</label>
                  </div>
                </motion.div>

                <motion.div variants={fieldVariant} transition={{ duration: 0.65, ease: E }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <div className="field-wrap relative pt-2">
                    <label htmlFor="cf-interest" className={staticLabelClasses}>Interested In *</label>
                    <select id="cf-interest" value={form.interestedIn} onChange={(e) => updateField('interestedIn', e.currentTarget.value)}
                      className={selectClasses(!!errors.interestedIn)}
                      aria-required="true">
                      <option value="" className="bg-black">Select a service…</option>
                      <option value="web-development" className="bg-black">Web Development</option>
                      <option value="social-media" className="bg-black">Social Media</option>
                      <option value="seo" className="bg-black">SEO</option>
                      <option value="paid-ads" className="bg-black">Paid Ads</option>
                      <option value="branding" className="bg-black">Branding</option>
                      <option value="content-creation" className="bg-black">Content Creation</option>
                      <option value="other" className="bg-black">Other</option>
                    </select>
                    <SelectChevron />
                    {errors.interestedIn && <p className="text-red-400 text-[10px] mt-1">{errors.interestedIn}</p>}
                  </div>
                  <div className="field-wrap relative pt-2">
                    <label htmlFor="cf-budget" className={staticLabelClasses}>Budget Range *</label>
                    <select id="cf-budget" value={form.budget} onChange={(e) => updateField('budget', e.currentTarget.value)}
                      className={selectClasses(!!errors.budget)}
                      aria-required="true">
                      <option value="" className="bg-black">Select a budget…</option>
                      <option value="under-500" className="bg-black">Under $500</option>
                      <option value="500-1500" className="bg-black">$500 – $1,500</option>
                      <option value="1500-5000" className="bg-black">$1,500 – $5,000</option>
                      <option value="5000-15000" className="bg-black">$5,000 – $15,000</option>
                      <option value="15000-plus" className="bg-black">$15,000+</option>
                    </select>
                    <SelectChevron />
                    {errors.budget && <p className="text-red-400 text-[10px] mt-1">{errors.budget}</p>}
                  </div>
                </motion.div>

                <motion.div variants={fieldVariant} transition={{ duration: 0.65, ease: E }}
                  className="field-wrap relative">
                  <textarea id="cf-message" rows={4} value={form.message} onChange={(e) => updateField('message', e.currentTarget.value)}
                    className={`${inputClasses(!!errors.message)} resize-none`}
                    placeholder=" "
                    aria-required="true" />
                  <label htmlFor="cf-message" className={floatLabelClasses}>Tell us about your project *</label>
                  {errors.message && <p className="text-red-400 text-[10px] mt-1">{errors.message}</p>}
                </motion.div>

                <motion.div variants={fieldVariant} transition={{ duration: 0.65, ease: E }}
                  className="pt-8">
                  <button
                    type="submit"
                    data-ripple
                    disabled={status === 'submitting'}
                    className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-black font-bold text-[11px] tracking-[0.2em] uppercase hover:opacity-90 hover:shadow-[0_0_30px_rgba(255,106,61,0.35)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed gap-3 rounded-full"
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
                </motion.div>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
