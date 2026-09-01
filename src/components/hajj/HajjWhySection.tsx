import { Container } from "@/components/ui/Container";
import { HajjWhyCardTitle, HajjWhyIconGlyph } from "@/components/hajj/HajjWhyIconGlyph";
import type { HajjPageContent } from "@/data/hajj-content-defaults";

export function HajjWhySection({ content }: { content: HajjPageContent["why"] }) {
  return (
    <section id="warum-mobarak" className="bg-white py-14 md:py-16 lg:py-20">
      <Container>
        <p className="mb-2 text-center text-[12px] font-bold tracking-[0.14em] text-brand-orange-ink">
          {content.eyebrow}
        </p>
        <h2 className="text-center text-[28px] font-bold tracking-[-0.02em] text-navy md:text-[34px]">
          {content.title}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[15px] leading-relaxed text-muted">
          {content.subtitle}
        </p>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6 lg:gap-3">
          {content.cards.map((card) => (
            <article
              key={card.id}
              className="flex flex-col items-center rounded-[14px] border border-[#E8EAEE] bg-white px-3 py-5 text-center shadow-[0_2px_10px_rgba(9,30,66,0.03)] sm:px-5 sm:py-8 lg:px-3.5 lg:py-7"
            >
              <span className="mb-3 flex h-12 w-12 items-center justify-center sm:mb-5 sm:h-[4.5rem] sm:w-[4.5rem] lg:mb-4 lg:h-16 lg:w-16">
                <HajjWhyIconGlyph
                  icon={card.icon}
                  className="h-11 w-11 sm:h-16 sm:w-16 lg:h-14 lg:w-14"
                />
              </span>
              <h3 className="text-[13px] font-bold leading-snug text-navy sm:text-[15px] lg:text-[13.5px] lg:leading-[1.3]">
                <HajjWhyCardTitle title={card.title} />
              </h3>
              <p className="mt-2 text-[11px] leading-[1.5] text-muted sm:mt-2.5 sm:text-[13px] sm:leading-[1.55] lg:mt-2 lg:text-[12px] lg:leading-[1.5]">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
