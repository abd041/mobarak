import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { cn } from "@/lib/utils";

export async function ContactPageContent({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "contact" });
  const tMeta = await getTranslations({ locale, namespace: "meta" });

  const phone = tMeta("phone");
  const email = tMeta("email");
  const address = tMeta("address");
  const phoneHref = `tel:${phone.replace(/\s/g, "")}`;
  const emailHref = `mailto:${email}`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  const cards = [
    {
      id: "phone",
      icon: Phone,
      label: t("phoneLabel"),
      value: phone,
      href: phoneHref,
      cta: t("callCta"),
      external: false,
    },
    {
      id: "email",
      icon: Mail,
      label: t("emailLabel"),
      value: email,
      href: emailHref,
      cta: t("emailCta"),
      external: false,
    },
    {
      id: "address",
      icon: MapPin,
      label: t("addressLabel"),
      value: address,
      href: mapsHref,
      cta: t("mapCta"),
      external: true,
    },
  ] as const;

  return (
    <div className="relative overflow-hidden bg-[#f3f7fb]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.95)_0%,transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(30,90,156,0.07)_0%,transparent_48%)]"
        aria-hidden
      />

      <section className="relative border-b border-[#dce6f0]/80 bg-white/70">
        <Container className="py-10 sm:py-12 md:py-14 lg:py-16">
          <p className="mb-3 inline-flex items-center rounded-full border border-[#c5d8f0]/90 bg-[#e8f1fa]/80 px-3.5 py-1 text-[10px] font-bold tracking-[0.16em] text-[#1e5a9c] uppercase sm:text-[11px]">
            {t("eyebrow")}
          </p>
          <h1 className="max-w-2xl text-[1.85rem] font-bold leading-[1.12] tracking-[-0.025em] text-navy sm:text-[2.25rem] md:text-[2.55rem]">
            {t("title")}
          </h1>
          <p className="mt-3.5 max-w-2xl text-[14px] leading-relaxed text-navy/75 sm:mt-4 sm:text-[16px] md:text-[17px]">
            {t("subtitle")}
          </p>
        </Container>
      </section>

      <Container className="relative py-10 sm:py-12 md:py-14 lg:py-16">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-10 xl:gap-12">
          <aside className="space-y-4 sm:space-y-5">
            <div className="rounded-2xl border border-[#dce6f0] bg-white/95 p-5 shadow-[0_10px_32px_rgba(11,44,74,0.05)] sm:p-6">
              <h2 className="text-[15px] font-bold text-navy sm:text-[16px]">{t("infoTitle")}</h2>
              <ul className="mt-4 space-y-3">
                {cards.map(({ id, icon: Icon, label, value, href, cta, external }) => (
                  <li key={id}>
                    <a
                      href={href}
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className={cn(
                        "group flex gap-3.5 rounded-xl border border-[#e8eef5] bg-[#f7faff] p-3.5 transition",
                        "hover:border-[#c5d8f0] hover:bg-white hover:shadow-[0_8px_22px_rgba(11,44,74,0.06)]",
                        "sm:p-4",
                      )}
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#1e5a9c] ring-1 ring-[#dce6f0] transition group-hover:bg-[#e8f1fa] sm:h-12 sm:w-12">
                        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[11px] font-bold tracking-[0.06em] text-navy/55 uppercase">
                          {label}
                        </span>
                        <span className="mt-1 block text-[14px] font-semibold leading-snug text-navy sm:text-[15px]">
                          {value}
                        </span>
                        <span className="mt-1.5 inline-block text-[12px] font-semibold text-brand-cta">
                          {cta}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[#dce6f0] bg-gradient-to-br from-white to-[#eef4fb] p-5 shadow-[0_8px_28px_rgba(11,44,74,0.04)] sm:p-6">
              <div className="flex items-start gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f1fa] text-[#1e5a9c] ring-1 ring-[#c5d8f0]/90">
                  <Clock3 className="h-5 w-5" strokeWidth={2} aria-hidden />
                </span>
                <div className="min-w-0">
                  <h2 className="text-[15px] font-bold text-navy sm:text-[16px]">{t("hoursLabel")}</h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-navy/80">{t("hoursWeekdays")}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-navy/80">{t("hoursWeekend")}</p>
                </div>
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <ContactForm />
          </div>
        </div>
      </Container>
    </div>
  );
}
