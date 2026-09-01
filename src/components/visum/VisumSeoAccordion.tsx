"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { ChevronDown, FileCheck, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type VisumSeoAccordionProps = {
  title: string;
  children: ReactNode;
  headingId?: string;
  iconSrc?: string;
  icon?: LucideIcon;
  accent?: "tourist" | "umrah" | "entry";
};

const ACCENT = {
  tourist: {
    chip: "bg-[#e8f1fa] ring-[#c5d8f0]/80",
    openBorder: "open:border-[#1e5a9c]/25",
    openGlow: "open:shadow-[0_12px_36px_rgba(30,90,156,0.10)]",
    topLine: "via-[#1e5a9c]/45",
  },
  umrah: {
    chip: "bg-[#e8f6ee] ring-[#c5e6d4]/80",
    openBorder: "open:border-[#1f8a4c]/25",
    openGlow: "open:shadow-[0_12px_36px_rgba(31,138,76,0.10)]",
    topLine: "via-[#1f8a4c]/45",
  },
  entry: {
    chip: "bg-[#eef2f8] ring-[#d0dced]/80",
    openBorder: "open:border-navy/15",
    openGlow: "open:shadow-[0_12px_36px_rgba(11,44,74,0.08)]",
    topLine: "via-brand-cta/45",
  },
} as const;

/**
 * §40 — Mobile: collapsible for readable scanning.
 * Desktop (md+): stays open. SSR starts open so SEO text remains in HTML.
 */
export function VisumSeoAccordion({
  title,
  children,
  headingId,
  iconSrc,
  icon: Icon = FileCheck,
  accent = "entry",
}: VisumSeoAccordionProps) {
  const [open, setOpen] = useState(true);
  const theme = ACCENT[accent];

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setOpen(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <details
      open={open}
      onToggle={(e) => {
        const el = e.currentTarget;
        if (window.matchMedia("(min-width: 768px)").matches) {
          el.open = true;
          setOpen(true);
          return;
        }
        setOpen(el.open);
      }}
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl border border-[#dce6f0] bg-white/95 backdrop-blur-[2px]",
        "shadow-[0_4px_22px_rgba(11,44,74,0.05)]",
        "transition-[border-color,box-shadow,background-color] duration-300",
        "hover:border-[#c5d8f0] hover:shadow-[0_8px_28px_rgba(11,44,74,0.07)]",
        theme.openBorder,
        theme.openGlow,
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity duration-300 group-open:opacity-100",
          theme.topLine,
        )}
        aria-hidden
      />

      <summary
        id={headingId}
        className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 marker:content-none sm:gap-4 sm:px-5 sm:py-[1.15rem] md:cursor-default [&::-webkit-details-marker]:hidden"
      >
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 sm:h-12 sm:w-12",
            theme.chip,
          )}
        >
          {iconSrc ? (
            <Image
              src={iconSrc}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 object-contain sm:h-8 sm:w-8"
            />
          ) : (
            <Icon className="h-5 w-5 text-navy sm:h-[22px] sm:w-[22px]" strokeWidth={1.75} aria-hidden />
          )}
        </span>

        <h3 className="visum-display-font min-w-0 flex-1 text-[1.05rem] font-bold leading-snug tracking-[-0.015em] text-navy sm:text-[1.15rem] md:text-[1.25rem]">
          {title}
        </h3>

        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full md:hidden",
            "bg-[#f3f7fb] ring-1 ring-[#dce6f0]",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]",
            "transition duration-300 group-open:bg-navy group-open:ring-navy",
          )}
        >
          <ChevronDown
            className="h-4 w-4 text-navy transition-transform duration-300 group-open:rotate-180 group-open:text-white"
            strokeWidth={2.25}
            aria-hidden
          />
        </span>
      </summary>

      <div className="border-t border-[#e8eef5] px-4 pb-5 pt-4 sm:px-5 sm:pb-6 sm:pt-5 md:pb-6">
        {children}
      </div>
    </details>
  );
}
