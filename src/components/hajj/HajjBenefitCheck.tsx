import { cn } from "@/lib/utils";

/** Gold circle + check — matches Hajj 2027 hero benefit bullets. */
export function HajjBenefitCheck({
  className,
  filled = false,
}: {
  className?: string;
  /** Filled gold disc + white check (mobile hero). Default = outline (desktop). */
  filled?: boolean;
}) {
  if (filled) {
    return (
      <svg
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("h-[18px] w-[18px] shrink-0 text-[#C4A35A]", className)}
        aria-hidden
      >
        <circle cx="10" cy="10" r="9" fill="currentColor" />
        <path
          d="M6.1 10.15 8.55 12.55 13.9 7.35"
          stroke="#fff"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-[18px] w-[18px] shrink-0 text-[#C4A35A]", className)}
      aria-hidden
    >
      <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.35" />
      <path
        d="M6.1 10.15 8.55 12.55 13.9 7.35"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
