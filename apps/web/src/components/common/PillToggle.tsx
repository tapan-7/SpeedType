'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface PillToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  accent?: 'primary' | 'lavender';
  children: ReactNode;
}

export function PillToggle({
  active = false,
  accent = 'primary',
  children,
  className = '',
  ...props
}: PillToggleProps) {
  const activeStyle =
    accent === 'lavender'
      ? 'bg-lavender-soft text-lavender'
      : 'bg-accent-soft text-accent';

  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium tracking-wide transition-colors duration-150 ${
        active
          ? activeStyle
          : 'text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

