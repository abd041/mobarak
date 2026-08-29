import { Info } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { DirArrow } from "@/components/ui/DirArrow";
import type { HajjPageContent } from "@/data/hajj-content-defaults";

export function HajjStatusBanner({ content }: { content: HajjPageContent["status"] }) {
  return (
    <section
      id="aktueller-stand"
      aria-labelledby="hajj-status-heading"
      className="border-y border-brand-orange/20 bg-[#FFF8F0]"
    >
      <Container className="flex flex-col gap-5 py-6 md:flex-row md:items-center md:justify-between md:gap-10 md:py-8">
        <div className="flex min-w-0 items-start gap-3.5 md:gap-4">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange-soft text-brand-orange-ink md:h-11 md:w-11">
            <Info className="h-5 w-5 md:h-[22px] md:w-[22px]" aria-hidden />
          </span>
          <div className="min-w-0">
            <h2
              id="hajj-status-heading"
              className="text-[17px] font-bold leading-snug text-navy md:text-[18px]"
            >
              {content.title}
            </h2>
            <p className="mt-2 max-w-3xl text-[14px] leading-[1.65] text-[#3D4F5F] md:text-[15px]">
              {content.body}
            </p>
          </div>
        </div>

        <div className="hidden shrink-0 flex-col items-center md:flex md:items-end">
          <Link
            href="/hajj-2027/vormerkung"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-cta px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_4px_16px_rgba(30,90,156,0.28)] transition hover:bg-navy"
          >
            {content.cta}
            <DirArrow />
          </Link>
          <p className="mt-2 text-center text-[12px] text-muted md:text-end">{content.note}</p>
        </div>
      </Container>
    </section>
  );
}
