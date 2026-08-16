import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, htmlFor, error, hint, children }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-[12px] font-medium tracking-[0.05em] text-[#4d4d4d] mb-1.5"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-[12px] text-[#ee0000]" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-[12px] text-[#888888]">{hint}</p>
      ) : null}
    </div>
  );
}

const inputBase =
  'w-full px-4 py-3 bg-white border rounded-lg text-[14px] text-[#171717] placeholder-[#a1a1a1] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0070f3]/30 focus:border-[#0070f3]';

export function TextField({
  invalid,
  className = '',
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      className={`${inputBase} ${
        invalid ? 'border-[#ee0000]' : 'border-[#ebebeb] hover:border-[#a1a1a1]'
      } ${className}`}
      {...rest}
    />
  );
}

export function TextArea({
  invalid,
  className = '',
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      className={`${inputBase} resize-y min-h-[140px] ${
        invalid ? 'border-[#ee0000]' : 'border-[#ebebeb] hover:border-[#a1a1a1]'
      } ${className}`}
      {...rest}
    />
  );
}
