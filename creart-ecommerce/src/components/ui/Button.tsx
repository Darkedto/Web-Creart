'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'red' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  fullWidth?: boolean;
}

const variants: Record<string, string> = {
  primary:
    'bg-ink text-bg border-ink hover:bg-ink2 shadow-[5px_5px_0_var(--red)] hover:shadow-[8px_8px_0_var(--red)] hover:-translate-x-0.5 hover:-translate-y-0.5',
  outline:
    'bg-transparent text-ink border-ink hover:bg-ink hover:text-bg shadow-none',
  ghost: 'bg-transparent text-ink border-transparent hover:bg-paper',
  red: 'bg-red text-bg border-ink shadow-[5px_5px_0_var(--ink)] hover:shadow-[8px_8px_0_var(--ink)] hover:-translate-x-0.5 hover:-translate-y-0.5',
  yellow:
    'bg-yellow text-ink border-ink shadow-[5px_5px_0_var(--ink)] hover:shadow-[8px_8px_0_var(--ink)] hover:-translate-x-0.5 hover:-translate-y-0.5',
};

const sizes: Record<string, string> = {
  sm: 'py-2 px-4 text-[13px]',
  md: 'py-3 px-6 text-[15px]',
  lg: 'py-4 px-8 text-[17px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={[
        'inline-flex items-center justify-center gap-2',
        'font-archivo font-normal tracking-[0.06em] uppercase',
        'border-2 transition-all duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
}
