import React, { useState } from 'react';
import { Mail, Phone, MapPin, Zap, Loader2, Send, AlertCircle } from 'lucide-react';
import SpotlightSection from './SpotlightSection';
import TiltCard from './TiltCard';

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

  // Full Name – required, letters/spaces/basic punctuation, min 2 chars
  if (!form.fullName.trim()) {
    errors.fullName = 'Name is required';
  } else if (!NAME_REGEX.test(form.fullName.trim())) {
    errors.fullName = 'Enter a valid name (letters only, min 2 characters)';
  }

  // Email – required, valid format
  if (!form.workEmail.trim()) {
    errors.workEmail = 'Email is required';
  } else if (!EMAIL_REGEX.test(form.workEmail.trim())) {
    errors.workEmail = 'Enter a valid email address';
  }

  // Phone – optional, but if provided must have 7-15 digits
  if (form.phone.trim()) {
    const digits = form.phone.match(PHONE_DIGITS_REGEX);
    const digitCount = digits ? digits.length : 0;
    if (digitCount < 7 || digitCount > 15) {
      errors.phone = 'Enter a valid phone number (7–15 digits)';
    }
  }

  // Company – optional, but if provided min 2 chars
  if (form.company.trim() && form.company.trim().length < 2) {
    errors.company = 'Enter a valid company name';
  }

  // Interested In – required
  if (!form.interestedIn) {
    errors.interestedIn = 'Please select a service';
  }

  // Budget – required
  if (!form.budget) {
    errors.budget = 'Please select a budget range';
  }

  // Message – required, min 10 chars
  if (!form.message.trim()) {
    errors.message = 'Message is required';
  } else if (form.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }

  return errors;
};

const Contact: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [form, setForm] = useState<FormState>({
    fullName: '',
    workEmail: '',
    phone: '',
    company: '',
    interestedIn: '',
    budget: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear the error for this field as user types
    if (errors[field]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Run validation
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setStatus('submitting');

    try {
      const response = await fetch("https://formsubmit.co/ajax/4amglobalmedia@gmail.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...form,
          _subject: `New Inquiry from ${form.fullName}`,
          _template: "table",
          email: form.workEmail
        })
      });

      if (response.ok) {
        setStatus('success');
      } else {
        console.error('Form submission failed');
        setStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
    }
  };

  return (
    <SpotlightSection id="contact" className="py-20 md:py-24 relative bg-transparent overflow-hidden">
      <div className="container mx-auto px-6 max-w-[1000px] relative z-10">

        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-lg mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-xs font-bold text-gray-300 tracking-widest uppercase">Contact Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-6">
            Let’s build something <br />
            <span className="text-transparent bg-clip-text bg-gradient-primary">ambitious</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-lg mx-auto leading-relaxed font-medium">
            Share a bit about your team, your timelines, and what a great outcome looks like. We’ll reply with a clear next step.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Contact Info */}
          <div className="space-y-6">
            <TiltCard className="h-full">
              <div className="rounded-[32px] p-8 bg-white/5 border border-white/10 shadow-lg backdrop-blur-sm h-full">
                <h3 className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-8">
                  Contact Details
                </h3>

                <div className="space-y-4">
                  {[
                    { label: 'Email', value: '4amglobalmedia@gmail.com', icon: Mail, href: 'mailto:4amglobalmedia@gmail.com' },
                    { label: 'Phone', value: '8826406545', icon: Phone, href: 'tel:8826406545' },
                    { label: 'Location', value: 'Global / Remote team', icon: MapPin },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className={`flex items-start gap-5 p-5 rounded-2xl hover:bg-white/5 transition-colors group ${!item.href ? 'pointer-events-none' : ''}`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-black/20 shadow-inner flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform duration-300 border border-white/5">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                          {item.label}
                        </p>
                        <p className="text-base sm:text-lg font-bold text-white group-hover:text-brand-primary transition-colors break-words [overflow-wrap:anywhere] leading-tight">
                          {item.value}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Contact Form */}
          <div className="relative h-full">
            <TiltCard className="h-full">
              <div className="relative h-full bg-white/5 border border-white/10 rounded-[32px] p-8 shadow-lg backdrop-blur-sm">
                {status === 'success' ? (
                  <div
                    className="flex flex-col items-center justify-center h-full py-12 text-center"
                  >
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 shadow-inner border border-emerald-500/20">
                      <Zap className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Signal Received.</h3>
                    <p className="text-gray-400 mb-8 max-w-xs text-base font-medium">
                      Our growth architects will analyze your coordinates and reach out within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setStatus('idle');
                        setErrors({});
                        setForm({
                          fullName: '',
                          workEmail: '',
                          phone: '',
                          company: '',
                          interestedIn: '',
                          budget: '',
                          message: '',
                        });
                      }}
                      className="text-brand-primary font-bold uppercase tracking-widest text-xs hover:text-brand-accent transition-colors"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    {status === 'error' && (
                      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        Something went wrong. Please try again.
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest ml-1">Full Name *</label>
                        <input
                          type="text"
                          name="fullName"
                          value={form.fullName}
                          onChange={(e) => updateField('fullName', e.currentTarget.value)}
                          className={`w-full bg-black/20 rounded-xl px-5 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 shadow-inner focus:shadow-inner-light text-sm font-medium border ${errors.fullName ? 'border-red-500/50 focus:ring-red-500/30' : 'border-white/10 focus:ring-brand-primary/20'}`}
                          placeholder="John Doe"
                        />
                        {errors.fullName && <p className="text-red-400 text-xs font-medium ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.fullName}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest ml-1">Work Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={form.workEmail}
                          onChange={(e) => updateField('workEmail', e.currentTarget.value)}
                          className={`w-full bg-black/20 rounded-xl px-5 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 shadow-inner focus:shadow-inner-light text-sm font-medium border ${errors.workEmail ? 'border-red-500/50 focus:ring-red-500/30' : 'border-white/10 focus:ring-brand-primary/20'}`}
                          placeholder="john@company.com"
                        />
                        {errors.workEmail && <p className="text-red-400 text-xs font-medium ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.workEmail}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest ml-1">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={(e) => updateField('phone', e.currentTarget.value)}
                          className={`w-full bg-black/20 rounded-xl px-5 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 shadow-inner focus:shadow-inner-light text-sm font-medium border ${errors.phone ? 'border-red-500/50 focus:ring-red-500/30' : 'border-white/10 focus:ring-brand-primary/20'}`}
                          placeholder="+1 (555) 000-0000"
                        />
                        {errors.phone && <p className="text-red-400 text-xs font-medium ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.phone}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest ml-1">Company</label>
                        <input
                          type="text"
                          name="company"
                          value={form.company}
                          onChange={(e) => updateField('company', e.currentTarget.value)}
                          className={`w-full bg-black/20 rounded-xl px-5 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 shadow-inner focus:shadow-inner-light text-sm font-medium border ${errors.company ? 'border-red-500/50 focus:ring-red-500/30' : 'border-white/10 focus:ring-brand-primary/20'}`}
                          placeholder="Company name"
                        />
                        {errors.company && <p className="text-red-400 text-xs font-medium ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.company}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest ml-1">Interested In *</label>
                        <select
                          name="interestedIn"
                          value={form.interestedIn}
                          onChange={(e) => updateField('interestedIn', e.currentTarget.value)}
                          className={`w-full bg-black/20 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 transition-all duration-300 shadow-inner focus:shadow-inner-light text-sm font-medium border ${errors.interestedIn ? 'border-red-500/50 focus:ring-red-500/30' : 'border-white/10 focus:ring-brand-primary/20'}`}
                        >
                          <option value="" className="bg-[#050B12]">Select a service</option>
                          <option value="web-development" className="bg-[#050B12]">Web Development</option>
                          <option value="social-media" className="bg-[#050B12]">Social Media Management</option>
                          <option value="seo" className="bg-[#050B12]">SEO</option>
                          <option value="paid-ads" className="bg-[#050B12]">Paid Ads</option>
                          <option value="branding" className="bg-[#050B12]">Branding</option>
                          <option value="content-creation" className="bg-[#050B12]">Content Creation</option>
                          <option value="other" className="bg-[#050B12]">Other</option>
                        </select>
                        {errors.interestedIn && <p className="text-red-400 text-xs font-medium ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.interestedIn}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest ml-1">Budget Range *</label>
                        <select
                          name="budget"
                          value={form.budget}
                          onChange={(e) => updateField('budget', e.currentTarget.value)}
                          className={`w-full bg-black/20 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 transition-all duration-300 shadow-inner focus:shadow-inner-light text-sm font-medium border ${errors.budget ? 'border-red-500/50 focus:ring-red-500/30' : 'border-white/10 focus:ring-brand-primary/20'}`}
                        >
                          <option value="" className="bg-[#050B12]">Select a range</option>
                          <option value="under-500" className="bg-[#050B12]">Under $500</option>
                          <option value="500-1500" className="bg-[#050B12]">$500 – $1,500</option>
                          <option value="1500-5000" className="bg-[#050B12]">$1,500 – $5,000</option>
                          <option value="5000-15000" className="bg-[#050B12]">$5,000 – $15,000</option>
                          <option value="15000-plus" className="bg-[#050B12]">$15,000+</option>
                        </select>
                        {errors.budget && <p className="text-red-400 text-xs font-medium ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.budget}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest ml-1">Message *</label>
                      <textarea
                        rows={4}
                        name="message"
                        value={form.message}
                        onChange={(e) => updateField('message', e.currentTarget.value)}
                        className={`w-full bg-black/20 rounded-xl px-5 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 shadow-inner focus:shadow-inner-light resize-none text-sm font-medium border ${errors.message ? 'border-red-500/50 focus:ring-red-500/30' : 'border-white/10 focus:ring-brand-primary/20'}`}
                        placeholder="Tell us about your project..."
                      />
                      {errors.message && <p className="text-red-400 text-xs font-medium ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.message}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full px-8 py-4 rounded-full bg-gradient-primary text-white font-bold tracking-wide uppercase text-xs hover:shadow-xl shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 hover:-translate-y-1"
                    >
                      {status === 'submitting' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </TiltCard>
          </div>
        </div>

      </div>
    </SpotlightSection>
  );
};

export default Contact;

