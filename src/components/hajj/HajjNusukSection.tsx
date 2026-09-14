import {
  Building2,
  CalendarCheck2,
  CircleCheck,
  CreditCard,
  FilePenLine,
  FileText,
  Layers,
  Package,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Libre_Baskerville } from "next/font/google";
import { Container } from "@/components/ui/Container";
import { DirArrow } from "@/components/ui/DirArrow";
import type { HajjLandingV2 } from "@/data/hajj/landing-v2-content";

const NAVY = "#0A1F3D";
const ACCENT = "#1264F5";
const GOLD = "#C4A35A";

const display = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  weight: ["700"],
  display: "swap",
});

const STEP_LUCIDE = [
  UserRound,
  FileText,
  FilePenLine,
  ShieldCheck,
  Layers,
  CreditCard,
  Building2,
  Package,
  CircleCheck,
  CalendarCheck2,
] as const;

const MOBILE_STEP_LABELS = [
  "Konto erstellen",
  "Dokumente hochladen",
  "Antrag ausfüllen",
  "Verifizierung durch Nusuk",
  "Paketauswahl",
  "eWallet aufladen",
  "Service Provider wählen",
  "Hajj-Paket auswählen",
  "Paket buchen",
  "Reiseplan prüfen",
] as const;

function NusukMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2" aria-label="Nusuk">
      <svg
        viewBox="0 0 48 48"
        className={compact ? "h-8 w-8" : "h-9 w-9"}
        aria-hidden
      >
        <polygon points="24,4 44,14 24,24 4,14" fill={GOLD} />
        <polygon points="4,14 24,24 24,44 4,34" fill="#A8883E" />
        <polygon points="24,24 44,14 44,34 24,44" fill="#B89648" />
        <polygon points="24,10 36,16 24,22 12,16" fill="#E0C27A" />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={`font-serif leading-none ${compact ? "text-[16px]" : "text-[18px]"}`}
          style={{ color: GOLD }}
          dir="rtl"
          lang="ar"
        >
          نسك
        </span>
        <span
          className={`mt-0.5 font-semibold tracking-[0.06em] ${compact ? "text-[10px]" : "text-[11px]"}`}
          style={{ color: GOLD }}
        >
          nusuk
        </span>
      </span>
    </span>
  );
}

export function HajjNusukSection({ content }: { content: HajjLandingV2["nusuk"] }) {
  return (
    <section id="nusuk" className="scroll-mt-20 bg-white py-5 md:py-12 lg:py-9">
      <Container>
        {/* Header — desktop: compact split like reference */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <div className="min-w-0 max-w-3xl lg:max-w-[48rem]">
            <p
              className="text-[11px] font-bold uppercase tracking-[0.14em] lg:tracking-[0.11em]"
              style={{ color: ACCENT }}
            >
              {content.eyebrow}
            </p>
            <h2
              className={`${display.className} mt-1.5 text-[26px] font-bold leading-[1.2] tracking-[-0.01em] md:text-[30px] lg:text-[27px] lg:leading-[1.25] xl:text-[29px]`}
              style={{ color: NAVY }}
            >
              {content.title}
            </h2>
            <p className="mt-2 max-w-2xl text-[13px] leading-[1.5] text-[#5A6A7A] md:text-[14px] lg:mt-1.5 lg:text-[13px] lg:leading-[1.45]">
              {content.body}
            </p>
          </div>

          {/* Top-right: aligned with title row (below eyebrow) */}
          <div className="hidden shrink-0 items-center gap-3 lg:flex lg:pt-[22px]">
            <NusukMark />
            <a
              href="#faq"
              className="inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-[12px] font-semibold whitespace-nowrap text-white transition hover:brightness-95"
              style={{ backgroundColor: ACCENT }}
            >
              {content.moreLabel}
              <DirArrow />
            </a>
          </div>
        </div>

        {/* Desktop steps — compact ~40px circles, tight vertical rhythm */}
        <ol className="mt-5 hidden lg:flex lg:items-start lg:justify-between lg:gap-0 xl:mt-6">
          {content.steps.map((step, index) => {
            const Icon = STEP_LUCIDE[index] ?? UserRound;
            return (
              <li
                key={step.num}
                className="flex w-full min-w-0 max-w-[6.2rem] flex-1 flex-col items-center text-center"
              >
                <span className="relative mt-2 flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-[#C9D2DE]">
                  <span
                    className="absolute -top-2 left-1/2 z-10 flex h-[17px] w-[17px] -translate-x-1/2 items-center justify-center rounded-full text-[9px] font-bold leading-none text-white"
                    style={{ backgroundColor: ACCENT }}
                  >
                    {index + 1}
                  </span>
                  <Icon className="h-[17px] w-[17px]" style={{ color: ACCENT }} strokeWidth={1.7} />
                </span>
                <p
                  className="mt-1.5 max-w-[5.6rem] text-[10.5px] font-medium leading-[1.25] text-balance xl:max-w-[6rem] xl:text-[11px]"
                  style={{ color: NAVY }}
                >
                  {step.label}
                </p>
              </li>
            );
          })}
        </ol>

        {/* Mobile steps */}
        <ol className="relative mt-5 space-y-2.5 lg:hidden">
          <span
            className="pointer-events-none absolute top-3 bottom-3 start-[38px] w-px bg-[#D6E4FF]"
            aria-hidden
          />
          {content.steps.map((step, index) => {
            const Icon = STEP_LUCIDE[index] ?? UserRound;
            return (
              <li key={step.num} className="relative flex min-h-10 items-center gap-3">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                  style={{ backgroundColor: ACCENT }}
                >
                  {index + 1}
                </span>
                <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8F1FF] ring-1 ring-[#C9DBFF]">
                  <Icon className="h-[18px] w-[18px]" style={{ color: ACCENT }} strokeWidth={1.9} />
                </span>
                <span
                  className="text-[14px] font-semibold leading-snug tracking-[-0.01em]"
                  style={{ color: NAVY }}
                >
                  {MOBILE_STEP_LABELS[index] ?? step.label}
                </span>
              </li>
            );
          })}
        </ol>

        {/* Bottom CTA */}
        <div className="mt-7 flex flex-col items-center gap-4 lg:mt-6">
          <div className="lg:hidden">
            <NusukMark compact />
          </div>
          <a
            href="#faq"
            className="inline-flex min-h-10 w-fit items-center justify-center gap-1.5 rounded-lg px-5 py-2.5 text-[13px] font-semibold text-white transition hover:brightness-95 lg:min-h-[40px] lg:rounded-md lg:px-5 lg:py-2 lg:text-[13px]"
            style={{ backgroundColor: ACCENT }}
          >
            {content.guideCta}
            <DirArrow />
          </a>
        </div>
      </Container>
    </section>
  );
}
