import type { ReactNode } from 'react';
import { useReveal } from '../../hooks/useReveal';

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>(0.1);
  return (
    <header
      ref={ref}
      className={`px-5 sm:px-8 md:px-12 pt-12 sm:pt-16 pb-8 sm:pb-10 max-w-6xl mx-auto transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[#171717] max-w-3xl">
        {title}
      </h1>
      {intro ? (
        <p className="mt-4 max-w-2xl text-[15px] sm:text-[16px] leading-relaxed text-[#4d4d4d]">
          {intro}
        </p>
      ) : null}
      {children}
    </header>
  );
}

export function PageSection({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`px-5 sm:px-8 md:px-12 max-w-6xl mx-auto ${className}`}>
      {children}
    </section>
  );
}
