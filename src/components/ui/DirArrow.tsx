import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Forward arrow that flips automatically in RTL (UI navigation / CTA). */
export function DirArrow({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-block leading-none rtl:rotate-180", className)}
      aria-hidden
    >
      →
    </span>
  );
}

/** Back arrow that flips automatically in RTL. */
export function DirBackArrow({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-block leading-none rtl:rotate-180", className)}
      aria-hidden
    >
      ←
    </span>
  );
}

/**
 * §44 — travel sequence (origin → destination).
 * Always rendered LTR so the trip order stays semantically correct on RTL pages
 * (e.g. Makkah → Medina must not reverse when the surrounding UI is Arabic).
 */
export function TravelSequence({
  from,
  to,
  className,
  "aria-label": ariaLabel,
}: {
  from: ReactNode;
  to: ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <span
      className={cn(
        "dir-ltr-keep travel-sequence inline-flex items-center gap-2 leading-none tracking-wide",
        className,
      )}
      dir="ltr"
      aria-label={ariaLabel}
    >
      <span aria-hidden={ariaLabel ? true : undefined}>{from}</span>
      <span className="text-muted" aria-hidden>
        →
      </span>
      <span aria-hidden={ariaLabel ? true : undefined}>{to}</span>
    </span>
  );
}
