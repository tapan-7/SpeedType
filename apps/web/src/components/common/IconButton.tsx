'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  active?: boolean;
  children: ReactNode;
}

export function IconButton({
  label,
  active = false,
  children,
  className = '',
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors duration-150 ${
        active
          ? 'border-accent/40 bg-accent-soft text-accent'
          : 'border-transparent bg-transparent text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

