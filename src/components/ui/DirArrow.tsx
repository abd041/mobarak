import { cn } from "@/lib/utils";

/** Forward arrow that flips automatically in RTL. */
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
