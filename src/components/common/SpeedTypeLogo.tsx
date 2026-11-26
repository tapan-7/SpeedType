export function SpeedTypeIcon({ className = 'h-8 w-10' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 56 44"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="stMarkGrad"
          x1="4"
          y1="40"
          x2="52"
          y2="4"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="var(--st-accent-primary)" stopOpacity={0.55} />
          <stop offset="50%" stopColor="var(--st-accent-secondary)" />
          <stop offset="100%" stopColor="var(--st-accent-primary)" />
        </linearGradient>
      </defs>

      {/* Speed streaks */}
      <path d="M18 11.5H2L17.5 14.5Z" fill="url(#stMarkGrad)" />
      <path d="M16.5 16.5H5.5L16.5 19Z" fill="url(#stMarkGrad)" />
      <path d="M17.5 21.5H9.5L18 23.5Z" fill="url(#stMarkGrad)" />

      {/* Stylized S body */}
      <path
        d="M50 7.5C48.2 11.2 44.8 12.8 40.2 12.8H26.5C23.8 12.8 22.6 13.9 22.6 15.4C22.6 17.1 24 18.1 26.8 18.1H37.2C43.9 18.1 48 21.6 48 27.4C48 34.3 42.6 39 34.2 39H29.2C27.8 39 27 38 27.3 36.6L27.9 34.1C28.2 33 29.2 32.3 30.4 32.3H34C37.9 32.3 40 30.7 40 28.3C40 26.2 38.3 25.1 35 25.1H25.8C19 25.1 15.2 21.7 15.2 16.1C15.2 9.6 20.5 5.4 28.8 5.4H47.6C49.6 5.4 50.7 6.2 50 7.5Z"
        fill="url(#stMarkGrad)"
      />

      {/* Slanted keyboard keycaps */}
      <g transform="skewX(-18)">
        <rect x="20.5" y="28.5" width="7.2" height="4.2" rx="1.3" fill="url(#stMarkGrad)" />
        <rect x="29.5" y="28.5" width="7.2" height="4.2" rx="1.3" fill="url(#stMarkGrad)" />
        <rect x="18" y="34.5" width="7.2" height="4.2" rx="1.3" fill="url(#stMarkGrad)" />
        <rect x="27" y="34.5" width="7.2" height="4.2" rx="1.3" fill="url(#stMarkGrad)" />
      </g>
    </svg>
  );
}

export function SpeedTypeLogo() {
  return (
    <div className="flex items-center gap-2">
      <SpeedTypeIcon className="h-8 w-10 transition-transform duration-150 group-hover:scale-105" />
      <span className="font-sans text-xl font-extrabold italic tracking-tight">
        <span className="text-text-primary">Speed</span>
        <span className="text-accent">Type</span>
      </span>
    </div>
  );
}

