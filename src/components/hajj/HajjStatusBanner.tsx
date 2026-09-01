import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { DirArrow } from "@/components/ui/DirArrow";
import { HajjInfoIcon } from "@/components/hajj/HajjInfoIcon";
import type { HajjPageContent } from "@/data/hajj-content-defaults";
import { hajjCampaignPreRegPath } from "@/data/hajj-campaign-types";

/** Soft Islamic geometric watermark for the status card. */
function StatusCardWatermark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <g stroke="currentColor" strokeWidth="0.9" opacity="1">
        <circle cx="100" cy="100" r="72" />
        <circle cx="100" cy="100" r="54" />
        <circle cx="100" cy="100" r="36" />
        <circle cx="100" cy="100" r="18" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI) / 6;
          const x2 = 100 + Math.cos(a) * 72;
          const y2 = 100 + Math.sin(a) * 72;
          return <line key={i} x1="100" y1="100" x2={x2} y2={y2} />;
        })}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4 + Math.PI / 8;
          const r = 48;
          const x = 100 + Math.cos(a) * r;
          const y = 100 + Math.sin(a) * r;
          return <circle key={`p-${i}`} cx={x} cy={y} r="10" />;
        })}
      </g>
    </svg>
  );
}

export function HajjStatusBanner({
  content,
  campaignSlug = "hajj-2027",
}: {
  content: HajjPageContent["status"];
  campaignSlug?: string;
}) {
  return (
    <section
      id="aktueller-stand"
      aria-labelledby="hajj-status-heading"
      className="bg-[#FAFBFC] py-8 md:py-10 lg:py-12"
    >
      <Container>
        <div className="relative overflow-hidden rounded-[22px] bg-[#F7F3EC] px-5 py-7 shadow-[0_8px_28px_rgba(11,44,74,0.06)] sm:px-7 sm:py-8 md:rounded-[26px] md:px-9 md:py-9 lg:px-10 lg:py-10">
          <StatusCardWatermark className="pointer-events-none absolute top-1/2 left-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 text-[#E4D9C8] opacity-70" />

          <div className="relative z-10 mx-auto max-w-2xl lg:max-w-3xl">
            <div className="flex items-start gap-3.5 sm:gap-4">
              <HajjInfoIcon className="mt-0.5" />
              <h2
                id="hajj-status-heading"
                className="font-serif text-[22px] leading-[1.2] font-semibold tracking-[-0.02em] text-navy sm:text-[24px] md:text-[26px]"
              >
                {content.title}
              </h2>
            </div>

            <p className="mt-5 text-[15px] leading-[1.7] text-navy/90 sm:text-[16px] md:mt-6 md:leading-[1.75]">
              {content.body}
            </p>

            <div className="mt-7 flex flex-col items-center md:mt-8">
              <Link
                href={hajjCampaignPreRegPath(campaignSlug)}
                className="inline-flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-navy-deep px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_6px_20px_rgba(7,31,53,0.28)] transition hover:bg-navy sm:text-[16px]"
              >
                {content.cta}
                <DirArrow />
              </Link>
              <p className="mt-3 text-center text-[13px] font-medium text-navy">
                {content.note}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
