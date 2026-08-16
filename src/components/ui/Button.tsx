import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'sm';

const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

const variants: Record<Variant, string> = {
  primary: 'bg-[#171717] text-white hover:opacity-90 focus-visible:outline-[#171717]',
  secondary:
    'bg-white text-[#171717] border border-[#ebebeb] hover:border-[#a1a1a1] focus-visible:outline-[#0070f3]',
  ghost: 'bg-transparent text-[#4d4d4d] hover:bg-[#ebebeb] hover:text-[#171717]',
};

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-[14px]',
  sm: 'h-9 px-4 text-[13px]',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;
type LinkBtnProps = CommonProps & Omit<LinkProps, 'className'>;

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: LinkBtnProps) {
  return (
    <Link className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </Link>
  );
}
