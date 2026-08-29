/** Flat service-card icons — silhouettes matching approved client reference. */

export function IconServiceUmrahGroup({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor" className={className} aria-hidden>
      <circle cx="13" cy="12" r="4.5" />
      <path d="M4 32c1.2-6.5 5-9.5 9-9.5s7.8 3 9 9.5H4Z" />
      <circle cx="27" cy="13" r="4" />
      <path d="M19 32c.8-5.5 3.8-8.5 8-8.5s7.2 3 8 8.5H19Z" />
    </svg>
  );
}

export function IconServiceIndividual({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden>
      <circle cx="20" cy="13.5" r="5" fill="currentColor" />
      <path
        d="M8 32c1-6.5 5.2-10 12-10s11 3.5 12 10H8Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconServiceHajj({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden>
      <path
        d="M8 12.5 20 6l12 6.5v17L20 36 8 29.5V12.5Z"
        fill="currentColor"
      />
      <path d="M8 16.5h24v2H8z" fill="#fff" fillOpacity="0.45" />
      <path d="M18.5 18.5h3v14h-3z" fill="#fff" fillOpacity="0.35" />
    </svg>
  );
}

export function IconServiceVisa({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden>
      <rect x="9" y="6" width="22" height="28" rx="3" fill="currentColor" />
      <circle cx="20" cy="17" r="5.5" stroke="#fff" strokeWidth="1.6" />
      <path
        d="M15.5 17h9M20 12.5v9"
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M13 27.5h14"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
