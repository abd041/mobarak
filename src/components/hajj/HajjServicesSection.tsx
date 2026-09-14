import { BookOpen, CalendarDays, MapPinned, Plane } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { HajjLandingV2 } from "@/data/hajj/landing-v2-content";

const COLUMN_ICONS = [CalendarDays, Plane, MapPinned, BookOpen] as const;

export function HajjServicesSection({
  content,
}: {
  content: HajjLandingV2["services"];
}) {
  return (
    <section id="vorbereitung" className="scroll-mt-20 bg-[#F7F5F1] py-14 md:py-16">
      <Container>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {content.columns.map((col, index) => {
            const Icon = COLUMN_ICONS[index] ?? CalendarDays;
            return (
              <li
                key={col.id}
                className="flex h-full flex-col rounded-2xl border border-[#E8EAEE] bg-white p-6 shadow-[0_4px_18px_rgba(7,31,53,0.04)]"
              >
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#F3F8FF]">
                  <Icon className="h-5 w-5 text-[#1264F5]" strokeWidth={1.75} />
                </span>
                <h3 className="text-[17px] font-bold text-navy">{col.title}</h3>
                <ul className="mt-4 flex flex-1 flex-col gap-2.5">
                  {col.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2 text-[13px] leading-snug text-[#4A5A6A] md:text-[14px]"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1264F5]"
                        aria-hidden
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
