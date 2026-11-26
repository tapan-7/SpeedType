'use client';

interface StatBadgeProps {
  label: string;
  value: string | number;
  highlight?: boolean;
  size?: 'sm' | 'lg';
}

export function StatBadge({
  label,
  value,
  highlight = false,
  size = 'sm',
}: StatBadgeProps) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span
        className={`font-mono font-semibold tabular-nums leading-none ${
          size === 'lg' ? 'text-4xl sm:text-5xl' : 'text-xl sm:text-2xl'
        } ${highlight ? 'text-accent' : 'text-text-primary'}`}
      >
        {value}
      </span>
      <span className="text-[11px] font-medium uppercase tracking-widest text-text-muted">
        {label}
      </span>
    </div>
  );
}
