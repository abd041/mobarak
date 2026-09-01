import { cn } from "@/lib/utils";

/** Gold circle + serif “i” — matches Hajj status card reference. */
export function HajjInfoIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#C4A35A] text-[22px] leading-none font-serif font-semibold text-white md:h-12 md:w-12 md:text-[24px]",
        className,
      )}
      aria-hidden
    >
      i
    </span>
  );
}
