import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import type { HajjPageContent } from "@/data/hajj-content-defaults";
import type { HajjSeoBlock } from "@/data/hajj-seo-blocks";
import { cn } from "@/lib/utils";

function SeoBlock({ block }: { block: HajjSeoBlock }) {
  switch (block.type) {
    case "intro":
      return (
        <p className="text-[16px] leading-[1.85] text-navy/90 md:text-[17px] md:leading-[1.9]">
          {block.text}
        </p>
      );
    case "paragraph":
      return (
        <p className="text-[15px] leading-[1.8] text-navy/85 md:text-[16px] md:leading-[1.85]">
          {block.text}
        </p>
      );
    case "h2":
      return (
        <h3 className="pt-2 text-[20px] font-bold leading-snug tracking-[-0.02em] text-navy md:text-[22px]">
          {block.text}
        </h3>
      );
    case "h3":
      return (
        <h4 className="pt-1 text-[17px] font-bold leading-snug text-navy md:text-[18px]">
          {block.text}
        </h4>
      );
    case "bulletList":
      return (
        <ul className="list-disc space-y-2 ps-5 text-[15px] leading-[1.75] text-navy/85 md:text-[16px]">
          {block.items.filter(Boolean).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "internalLink":
      return (
        <p>
          <Link
            href={block.href}
            className="text-[15px] font-semibold text-brand-cta underline decoration-brand-cta/30 underline-offset-2 transition hover:text-brand-orange-ink md:text-[16px]"
          >
            {block.label}
          </Link>
        </p>
      );
    case "faqRef":
      return (
        <p>
          <a
            href={`#${block.faqId}`}
            className="text-[15px] font-semibold text-brand-cta underline decoration-brand-cta/30 underline-offset-2 transition hover:text-brand-orange-ink md:text-[16px]"
          >
            {block.label}
          </a>
        </p>
      );
    default:
      return null;
  }
}

export function HajjSeoSection({ content }: { content: HajjPageContent["seo"] }) {
  const blocks = content.blocks.filter((block) => {
    switch (block.type) {
      case "bulletList":
        return block.items.some((item) => item.trim());
      case "internalLink":
        return Boolean(block.label.trim() && block.href.trim());
      case "faqRef":
        return Boolean(block.label.trim() && block.faqId.trim());
      default:
        return block.text.trim();
    }
  });

  return (
    <section id="hajj-seo" className="border-t border-line bg-[#FAFBFC] py-14 md:py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-[24px] font-bold leading-snug tracking-[-0.02em] text-navy md:text-[28px]">
            {content.title}
          </h2>
          {blocks.length > 0 ? (
            <div className={cn("mt-6 space-y-5 md:mt-8 md:space-y-6")}>
              {blocks.map((block) => (
                <SeoBlock key={block.id} block={block} />
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
