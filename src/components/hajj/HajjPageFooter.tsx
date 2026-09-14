"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { hajjCampaignLandingPath, parseHajjCampaignSlug } from "@/data/hajj-campaign-types";
import { scrollToSection } from "@/lib/scroll-to-section";

const QUICK = [
  { id: "top", label: "Hajj 2027" },
  { id: "ablauf", label: "Ablauf" },
  { id: "nusuk", label: "Nusuk" },
  { id: "vorbereitung", label: "Vorbereitung" },
] as const;

const MORE = [
  { id: "betreuung", label: "Unsere Betreuung" },
  { id: "faq", label: "FAQ" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export function HajjPageFooter() {
  const t = useTranslations("footer");
  const pathname = usePathname();
  const router = useRouter();
  const campaignSlug = parseHajjCampaignSlug(pathname) ?? "hajj-2027";
  const landingPath = hajjCampaignLandingPath(campaignSlug);
  const year = new Date().getFullYear();

  const go = (id: string) => {
    if (pathname === landingPath && document.getElementById(id)) {
      scrollToSection(id, 72);
      return;
    }
    router.push(`${landingPath}#${id}`);
  };

  return (
    <footer className="border-t border-[#E9EAEE] bg-white text-[#0A1B3D]">
      <Container>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 py-10 lg:grid-cols-4">
          <div className="col-span-2 max-w-xs lg:col-span-1">
            <BrandLogo height={56} className="!h-12 w-auto" />
            <p className="mt-3 text-[13px] leading-relaxed text-[#5B6B7C]">{t("tagline")}</p>
          </div>

          <div>
            <h3 className="mb-3 text-[14px] font-bold">Schnellzugriff</h3>
            <ul className="space-y-2 text-[13px] text-[#5B6B7C]">
              {QUICK.map((item) => (
                <li key={item.id}>
                  <button type="button" onClick={() => go(item.id)} className="hover:text-navy">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-[14px] font-bold">Weitere Links</h3>
            <ul className="space-y-2 text-[13px] text-[#5B6B7C]">
              {MORE.map((item) =>
                "href" in item ? (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-navy">
                      {item.label}
                    </Link>
                  </li>
                ) : (
                  <li key={item.id}>
                    <button type="button" onClick={() => go(item.id)} className="hover:text-navy">
                      {item.label}
                    </button>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h3 className="mb-3 text-[14px] font-bold">Kontakt</h3>
            <ul className="space-y-2.5 text-[13px] text-[#5B6B7C]">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <a href="tel:+436691234567">+43 669 123 45 67</a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <a href="mailto:info@mobarak.at">info@mobarak.at</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>Wien, Österreich</span>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-[#E9EAEE]">
        <Container className="flex flex-col items-center justify-between gap-2 py-3 text-[12px] text-[#8A94A6] sm:flex-row">
          <p>© {year} Mobarak Reisen</p>
          <div className="flex gap-4">
            <Link href="/datenschutz">Datenschutz</Link>
            <Link href="/agb">AGB</Link>
            <Link href="/impressum">Impressum</Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
