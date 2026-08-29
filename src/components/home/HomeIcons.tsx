import { cn } from "@/lib/utils";

/** Service card icons matching client reference silhouettes */
export function IconPilgrims({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <circle cx="9" cy="7.5" r="2.4" />
      <circle cx="15.5" cy="7.8" r="2.1" />
      <path d="M4.2 18.8c.4-3.2 2.4-5 4.8-5s4.4 1.8 4.8 5H4.2Z" />
      <path d="M12.2 18.8c.25-2.2 1.4-3.6 3.3-3.6 1.9 0 3.1 1.4 3.4 3.6H12.2Z" />
    </svg>
  );
}

export function IconPilgrim({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <circle cx="12" cy="7.5" r="2.6" />
      <path d="M5.5 19c.5-3.6 2.8-5.6 6.5-5.6s6 2 6.5 5.6H5.5Z" />
    </svg>
  );
}

export function IconKaaba({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M5 7.2 12 4l7 3.2v12.6l-7 3.2-7-3.2V7.2Z" />
      <path fill="#fff" fillOpacity=".35" d="M5 9.4h14v1.6H5z" />
      <path fill="#fff" fillOpacity=".25" d="M11.2 11.2h1.6v8.2h-1.6z" />
    </svg>
  );
}

export function IconPassport({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="5" y="3.5" width="14" height="17" rx="2" fill="currentColor" />
      <circle cx="12" cy="11" r="3.2" stroke="#fff" strokeWidth="1.4" />
      <path d="M8.8 11h6.4M12 7.8v6.4" stroke="#fff" strokeWidth="1.2" />
      <path d="M8 17.2h8" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconAward({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <circle cx="12" cy="9" r="5.2" />
      <path d="M9.2 13.6 8 20.2l4-2.2 4 2.2-1.2-6.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.2 9.2 11.4 10.6 14.2 7.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPeople({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <circle cx="9" cy="8" r="2.2" />
      <circle cx="16" cy="8.2" r="1.9" />
      <path d="M4.5 17.5c.4-2.6 2-4 4.5-4s4.1 1.4 4.5 4" strokeLinecap="round" />
      <path d="M13.2 17.5c.2-1.8 1.2-3 2.9-3 1.7 0 2.7 1.2 2.9 3" strokeLinecap="round" />
    </svg>
  );
}

export function IconPinHeart({ className }: { className?: string }) {
  return <IconPinOne className={className} />;
}

export function IconPinOne({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path
        d="M12 21s6.5-5.2 6.5-10.2A6.5 6.5 0 0 0 12 4.3a6.5 6.5 0 0 0-6.5 6.5C5.5 15.8 12 21 12 21Z"
        strokeLinejoin="round"
      />
      <path d="M12 8.2v4.6M10.4 9h2.2c.9 0 1.5.5 1.5 1.3s-.6 1.3-1.5 1.3H10.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconCare({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cn(className)} aria-hidden>
      <path d="M8.2 12.2c-1.8-.9-3.4.5-2.6 2.2 1.2 2.5 4.4 4.6 6.4 4.6s5.2-2.1 6.4-4.6c.8-1.7-.8-3.1-2.6-2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 11.5c0-2.2 1.4-3.7 3.5-3.7s3.5 1.5 3.5 3.7" strokeLinecap="round" />
      <path d="M7 8.8c-.8-1.5.2-3.3 2-3.3 1 0 1.6.5 2 .9.4-.4 1-.9 2-.9 1.8 0 2.8 1.8 2 3.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
