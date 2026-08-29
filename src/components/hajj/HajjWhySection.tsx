import { Container } from "@/components/ui/Container";
import { HajjWhyIconGlyph } from "@/components/hajj/HajjWhyIconGlyph";
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

        <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-12">
          {content.cards.map((card) => (
            <article key={card.id} className="flex flex-col items-center text-center">
              <span className="mb-4 flex h-12 w-12 items-center justify-center text-brand-gold">
                <HajjWhyIconGlyph icon={card.icon} className="h-8 w-8" />
              </span>
              <h3 className="text-[15px] font-bold leading-snug text-navy md:text-[16px]">
                {card.title}
              </h3>
              <p className="mt-2.5 max-w-[22rem] text-[13px] leading-[1.65] text-muted md:text-[14px]">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
