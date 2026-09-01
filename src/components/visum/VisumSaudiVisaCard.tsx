/**
 * Approved hero visa sticker — Kingdom of Saudi Arabia visa style
 * (cream document, large green VISA, emblem). Not a passport.
 */
export function VisumSaudiVisaCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative aspect-[4/5] w-full max-w-[300px] rotate-[7deg] ${className}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 320 400"
        className="h-full w-full drop-shadow-[0_22px_40px_rgba(11,44,74,0.32)]"
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
      >
        <defs>
          <pattern id="visaGuilloche" width="12" height="12" patternUnits="userSpaceOnUse">
            <path
              d="M0 6 Q3 0 6 6 T12 6"
              fill="none"
              stroke="#6b8f6a"
              strokeWidth="0.35"
              opacity="0.35"
            />
          </pattern>
          <linearGradient id="visaPaper" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbf7ee" />
            <stop offset="55%" stopColor="#f3ead8" />
            <stop offset="100%" stopColor="#ebe0ca" />
          </linearGradient>
        </defs>

        {/* Card body */}
        <rect
          x="8"
          y="8"
          width="304"
          height="384"
          rx="14"
          fill="url(#visaPaper)"
          stroke="#c9b896"
          strokeWidth="1.5"
        />
        <rect x="8" y="8" width="304" height="384" rx="14" fill="url(#visaGuilloche)" />

        {/* Ornate inner border */}
        <rect
          x="22"
          y="22"
          width="276"
          height="356"
          rx="8"
          fill="none"
          stroke="#7a9a6e"
          strokeWidth="1.25"
          opacity="0.75"
        />
        <rect
          x="28"
          y="28"
          width="264"
          height="344"
          rx="6"
          fill="none"
          stroke="#a8c09a"
          strokeWidth="0.75"
          opacity="0.9"
          strokeDasharray="2 3"
        />

        {/* Decorative corner flourishes */}
        <path
          d="M36 48 h28 M36 48 v28"
          stroke="#5f8a55"
          strokeWidth="1.5"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M284 48 h-28 M284 48 v28"
          stroke="#5f8a55"
          strokeWidth="1.5"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M36 352 h28 M36 352 v-28"
          stroke="#5f8a55"
          strokeWidth="1.5"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M284 352 h-28 M284 352 v-28"
          stroke="#5f8a55"
          strokeWidth="1.5"
          fill="none"
          opacity="0.7"
        />

        {/* Main VISA wordmark */}
        <text
          x="118"
          y="148"
          textAnchor="middle"
          fill="#1a6b3a"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="52"
          fontWeight="700"
          letterSpacing="4"
        >
          VISA
        </text>

        <text
          x="118"
          y="178"
          textAnchor="middle"
          fill="#1a6b3a"
          fontFamily="system-ui, sans-serif"
          fontSize="11"
          fontWeight="600"
          letterSpacing="1.2"
        >
          KINGDOM OF SAUDI ARABIA
        </text>

        {/* Arabic */}
        <text
          x="118"
          y="210"
          textAnchor="middle"
          fill="#1a3d28"
          fontFamily="Tahoma, 'Segoe UI', sans-serif"
          fontSize="18"
          fontWeight="700"
        >
          تأشيرة
        </text>
        <text
          x="118"
          y="234"
          textAnchor="middle"
          fill="#1a3d28"
          fontFamily="Tahoma, 'Segoe UI', sans-serif"
          fontSize="12"
          fontWeight="600"
        >
          المملكة العربية السعودية
        </text>

        {/* Saudi emblem — palm over crossed swords */}
        <g transform="translate(228 118)" fill="#1a6b3a">
          {/* Palm fronds */}
          <ellipse cx="0" cy="-18" rx="5" ry="16" />
          <ellipse cx="-9" cy="-14" rx="4" ry="13" transform="rotate(-28)" />
          <ellipse cx="9" cy="-14" rx="4" ry="13" transform="rotate(28)" />
          <ellipse cx="-15" cy="-8" rx="3.5" ry="11" transform="rotate(-48)" />
          <ellipse cx="15" cy="-8" rx="3.5" ry="11" transform="rotate(48)" />
          <rect x="-1.5" y="-6" width="3" height="14" rx="1" />
          {/* Crossed swords */}
          <g stroke="#1a6b3a" strokeWidth="2.2" strokeLinecap="round" fill="none">
            <path d="M-18 16 L18 28" />
            <path d="M-18 28 L18 16" />
          </g>
          <circle cx="-18" cy="16" r="2.2" />
          <circle cx="18" cy="16" r="2.2" />
          <circle cx="-18" cy="28" r="2.2" />
          <circle cx="18" cy="28" r="2.2" />
        </g>

        {/* Bottom meta strip */}
        <rect x="48" y="280" width="224" height="56" rx="6" fill="#ffffff" fillOpacity="0.45" />
        <text
          x="160"
          y="304"
          textAnchor="middle"
          fill="#5c4a32"
          fontFamily="system-ui, sans-serif"
          fontSize="10"
          fontWeight="600"
          letterSpacing="0.8"
        >
          TOURISM  ·  UMRAH
        </text>
        <text
          x="160"
          y="322"
          textAnchor="middle"
          fill="#5c4a32"
          fontFamily="system-ui, sans-serif"
          fontSize="9"
          opacity="0.85"
        >
          Multiple / Single Entry
        </text>
      </svg>
    </div>
  );
}
