import { useState } from 'react';
import { Plus, Mail } from 'lucide-react';
import { faqs } from '../../data/faqs';
import Reveal from '../Reveal';
import { useReveal } from '../../hooks/useReveal';
import { LinkButton } from './Button';
import { ArrowRightIcon } from './Icon';

export function FaqSection() {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);
  const { ref } = useReveal<HTMLDivElement>(0.1);

  return (
    <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
      <Reveal>
        <aside className="lg:sticky lg:top-24">
          <p className="eyebrow mb-3">FAQs</p>
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-[#171717]">
            Got questions?
            <br />
            We've got answers.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-[#4d4d4d] max-w-md">
            Everything you might want to know about what I build, the tools I use and how we can
            work together — all in one place.
          </p>

          <div className="mt-10 p-6 rounded-lg bg-[#fafafa] border border-[#ebebeb]">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white text-[#171717] border border-[#ebebeb] mb-4">
              <Mail size={18} />
            </div>
            <h3 className="text-[16px] font-semibold text-[#171717] mb-2">Still have questions?</h3>
            <p className="text-[14px] leading-relaxed text-[#4d4d4d] mb-5">
              If you couldn't find what you were looking for, reach out and I'll get back to you
              within a couple of days.
            </p>
            <LinkButton to="/contact" size="sm">
              Let's Talk
              <ArrowRightIcon size={14} />
            </LinkButton>
          </div>
        </aside>
      </Reveal>

      <div>
        {faqs.map((faq, i) => {
          const isOpen = open === faq.id;
          return (
            <Reveal key={faq.id} delay={i * 60}>
              <div className="border-b border-[#ebebeb]">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : faq.id)}
                  className="w-full flex items-center gap-4 py-5 text-left group"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${faq.id}`}
                >
                  <span className="text-[12px] font-mono tabular-nums text-[#a1a1a1] shrink-0 w-6">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 text-[15px] sm:text-[16px] font-medium text-[#171717] group-hover:text-[#0070f3] transition-colors">
                    {faq.question}
                  </span>
                  <span
                    className={`shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full border transition-all duration-300 ${
                      isOpen
                        ? 'bg-[#171717] text-white border-[#171717] rotate-45'
                        : 'bg-white text-[#4d4d4d] border-[#ebebeb] group-hover:border-[#a1a1a1]'
                    }`}
                  >
                    <Plus size={15} />
                  </span>
                </button>
                <div
                  id={`faq-panel-${faq.id}`}
                  role="region"
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 pl-10 pr-4 text-[14px] leading-relaxed text-[#4d4d4d]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

export function FaqBlock() {
  return <FaqSection />;
}
