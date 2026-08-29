import { Container } from "@/components/ui/Container";
import type { HajjPageContent } from "@/data/hajj-content-defaults";

export function HajjFaqSection({
  content,
  title = "Häufige Fragen",
}: {
  content: HajjPageContent["faqs"];
  title?: string;
}) {
  if (!content.length) return null;

  return (
    <section id="faq" className="border-t border-line bg-[#FAFBFC] py-14 md:py-16">
      <Container>
        <h2 className="mb-6 text-center text-[26px] font-bold text-navy md:text-[30px]">{title}</h2>
        <div className="mx-auto max-w-3xl space-y-3">
          {content.map((faq) => (
            <details
              key={faq.id}
              id={faq.id}
              className="rounded-2xl border border-line bg-white px-5 py-4 shadow-[0_2px_10px_rgba(9,30,66,0.03)] open:shadow-[0_4px_16px_rgba(9,30,66,0.05)]"
            >
              <summary className="cursor-pointer list-none text-[15px] font-semibold text-navy [&::-webkit-details-marker]:hidden">
                {faq.question}
              </summary>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
