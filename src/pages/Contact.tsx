import { useState, type FormEvent } from 'react';
import { PageHero, PageSection } from '../components/ui/Page';
import { Field, TextField, TextArea } from '../components/ui/Form';
import { Button } from '../components/ui/Button';
import { socialIconLib, ArrowRightIcon } from '../components/ui/Icon';
import { Check, Dot, Mail, MapPin } from 'lucide-react';
import { submitContact } from '../services/contact';
import { usePageMeta } from '../hooks/usePageMeta';
import { useProfile, useSocials } from '../hooks/usePortfolioData';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const EMPTY: FormState = { name: '', email: '', subject: '', message: '' };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!values.name.trim()) errors.name = 'Please enter your name.';
  if (!values.email.trim()) {
    errors.email = 'Please enter your email.';
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!values.subject.trim()) errors.subject = 'Please add a subject.';
  if (!values.message.trim()) {
    errors.message = 'Please enter a message.';
  } else if (values.message.trim().length < 10) {
    errors.message = 'Message should be at least 10 characters.';
  }
  return errors;
}

export default function Contact() {
  usePageMeta({
    title: "Let's Talk",
    description:
      "Get in touch — for a project idea, internship opportunity, collaboration or just to say hello. I'd love to hear from you.",
    path: '/contact',
  });

  const { profile } = useProfile();
  const { socials } = useSocials();
  const [values, setValues] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const update = (key: keyof FormState, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (touched[key]) {
      setErrors(validate({ ...values, [key]: value }));
    }
  };

  const handleBlur = (key: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors(validate(values));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, subject: true, message: true });
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const result = await submitContact(values);
      if (result.ok) {
        setSubmitted(true);
        setValues(EMPTY);
        setTouched({});
        setErrors({});
      } else {
        setSubmitError(result.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Let's Talk"
        title="Let's talk"
        intro="Have a project idea, internship opportunity, collaboration or just want to say hello? I'd love to hear from you."
      />

      <PageSection className="pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="p-6 sm:p-8 bg-white border border-[#ebebeb] rounded-lg text-center" role="status">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#e6f4ea] text-[#1a7d34] mb-4">
                  <Check size={24} />
                </div>
                <h3 className="text-[18px] font-semibold text-[#171717] mb-2">Message sent</h3>
                <p className="text-[14px] text-[#4d4d4d] mb-6">
                  Thanks for reaching out! Your message has been sent successfully. I'll get back to you soon.
                </p>
                <Button variant="secondary" onClick={() => setSubmitted(false)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="p-6 sm:p-8 bg-white border border-[#ebebeb] rounded-lg space-y-5">
                {submitError ? (
                  <p className="text-[13px] text-[#ee0000] bg-[#fde8e8] border border-[#f5c2c2] rounded-lg px-4 py-3" role="alert">
                    {submitError}
                  </p>
                ) : null}

                <Field label="Name" htmlFor="name" error={touched.name ? errors.name : undefined}>
                  <TextField
                    id="name"
                    name="name"
                    autoComplete="name"
                    placeholder="Your name"
                    value={values.name}
                    onChange={(e) => update('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    invalid={touched.name && Boolean(errors.name)}
                    aria-invalid={touched.name && Boolean(errors.name)}
                  />
                </Field>

                <Field label="Email" htmlFor="email" error={touched.email ? errors.email : undefined}>
                  <TextField
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={(e) => update('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    invalid={touched.email && Boolean(errors.email)}
                    aria-invalid={touched.email && Boolean(errors.email)}
                  />
                </Field>

                <Field label="Subject" htmlFor="subject" error={touched.subject ? errors.subject : undefined}>
                  <TextField
                    id="subject"
                    name="subject"
                    placeholder="Project, internship, collaboration…"
                    value={values.subject}
                    onChange={(e) => update('subject', e.target.value)}
                    onBlur={() => handleBlur('subject')}
                    invalid={touched.subject && Boolean(errors.subject)}
                    aria-invalid={touched.subject && Boolean(errors.subject)}
                  />
                </Field>

                <Field label="Message" htmlFor="message" error={touched.message ? errors.message : undefined}>
                  <TextArea
                    id="message"
                    name="message"
                    placeholder="Tell me a bit about what you have in mind…"
                    value={values.message}
                    onChange={(e) => update('message', e.target.value)}
                    onBlur={() => handleBlur('message')}
                    invalid={touched.message && Boolean(errors.message)}
                    aria-invalid={touched.message && Boolean(errors.message)}
                  />
                </Field>

                <div className="flex items-center gap-4 pt-1">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Sending…' : 'Send Message'}
                    {!submitting && <ArrowRightIcon size={16} />}
                  </Button>
                  {submitting && (
                    <span
                      className="inline-block w-4 h-4 border-2 border-[#171717] border-t-transparent rounded-full animate-spin"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </form>
            )}
          </div>

          <aside className="lg:col-span-2 space-y-5">
            <div className="p-6 bg-[#fafafa] border border-[#ebebeb] rounded-lg">
              <h3 className="text-[14px] font-semibold text-[#171717] mb-2">Prefer email?</h3>
              <p className="text-[13px] text-[#4d4d4d] mb-3">
                You can also reach me directly through any of my profiles.
              </p>
              <div className="flex flex-wrap gap-2">
                {socials.map((s) => {
                  const iconKey = (s.icon || '').toLowerCase();
                  const Icon = socialIconLib[iconKey];
                  return (
                    <a
                      key={s.id || s.label || s.href}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 h-9 rounded-full border border-[#ebebeb] bg-white text-[13px] text-[#4d4d4d] hover:bg-[#171717] hover:text-white hover:border-[#171717] transition-colors"
                    >
                      {Icon ? <Icon size={15} /> : null}
                      {s.label || s.icon}
                    </a>
                  );
                })}
              </div>
            </div>

            {(profile?.email || profile?.location) && (
              <div className="p-6 bg-[#fafafa] border border-[#ebebeb] rounded-lg">
                <h3 className="text-[14px] font-semibold text-[#171717] mb-3">Contact info</h3>
                <div className="space-y-3">
                  {profile?.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center gap-3 text-[13px] text-[#4d4d4d] hover:text-[#0070f3] transition-colors group"
                    >
                      <span className="w-8 h-8 rounded-lg bg-white border border-[#ebebeb] flex items-center justify-center shrink-0 group-hover:border-[#0070f3] transition-colors">
                        <Mail size={14} className="text-[#888888] group-hover:text-[#0070f3]" />
                      </span>
                      <span className="break-all">{profile.email}</span>
                    </a>
                  )}
                  {profile?.location && (
                    <div className="flex items-center gap-3 text-[13px] text-[#4d4d4d]">
                      <span className="w-8 h-8 rounded-lg bg-white border border-[#ebebeb] flex items-center justify-center shrink-0">
                        <MapPin size={14} className="text-[#888888]" />
                      </span>
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="p-6 bg-[#fafafa] border border-[#ebebeb] rounded-lg">
              <h3 className="text-[14px] font-semibold text-[#171717] mb-2">Good to know</h3>
              <ul className="space-y-2 text-[13px] text-[#4d4d4d]">
                <li className="flex gap-2"><Dot size={18} className="text-[#a1a1a1] shrink-0" /> I usually reply within a couple of days.</li>
                <li className="flex gap-2"><Dot size={18} className="text-[#a1a1a1] shrink-0" /> Open to internships, freelance and collaboration.</li>
                <li className="flex gap-2"><Dot size={18} className="text-[#a1a1a1] shrink-0" /> Flexible modern websites, built to your budget.</li>
              </ul>
            </div>
          </aside>
        </div>
      </PageSection>
    </>
  );
}
