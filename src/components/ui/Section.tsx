import type { ReactNode } from 'react';
import { LinkButton } from './Button';
import { ArrowRightIcon } from './Icon';

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  titleClass = '',
  eyebrowClass = '',
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  align?: 'left' | 'center';
  titleClass?: string;
  eyebrowClass?: string;
}) {
  const wrap = align === 'center' ? 'text-center mx-auto' : '';
  return (
    <div className={`max-w-2xl ${wrap}`}>
      {eyebrow ? <p className={`eyebrow mb-3 ${eyebrowClass}`}>{eyebrow}</p> : null}
      <h2 className={`text-[clamp(1.75rem,4.5vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-[#171717] ${titleClass}`}>
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-[15px] sm:text-[16px] leading-relaxed text-[#4d4d4d]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function ReadMoreLink({
  to,
  children = 'Read More',
  state,
}: {
  to: string;
  children?: string;
  state?: unknown;
}) {
  return (
    <LinkButton
      to={to}
      state={state}
      variant="ghost"
      size="sm"
      className="!px-0 !rounded-none border-b border-transparent hover:border-[#171717] !text-[#0070f3] hover:!text-[#0761d1]"
    >
      {children}
      <ArrowRightIcon size={14} />
    </LinkButton>
  );
}

export function TechTag({ name, accent = false }: { name: string; accent?: boolean }) {
  return <span className={`tag ${accent ? 'tag-accent' : ''}`}>{name}</span>;
}
