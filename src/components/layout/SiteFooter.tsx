"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import type { SiteSettings } from "@/data/site-settings";
import { DEFAULT_SITE_SETTINGS } from "@/data/site-settings";
import { BRAND_LOGO } from "@/lib/brand";
import { getSiteSettings, SITE_SETTINGS_EVENT } from "@/lib/site-settings-store";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M14 13.5h2.5l.5-3H14v-1.5c0-.9.2-1.5 1.5-1.5H17V4.1C16.5 4 15.6 4 14.7 4 12.3 4 10.5 5.5 10.5 8.2V10.5H8v3h2.5V20h3.5v-6.5z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm11 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M23.5 7.2a3 3 0 0 0-2.1-2.1C19.5 4.6 12 4.6 12 4.6s-7.5 0-9.4.5A3 3 0 0 0 .5 7.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-4.8zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15Z" />
    </svg>
  );
}

const SOCIAL_ICONS = [
  { key: "facebook" as const, label: "Facebook", Icon: FacebookIcon },
  { key: "instagram" as const, label: "Instagram", Icon: InstagramIcon },
  { key: "youtube" as const, label: "YouTube", Icon: YoutubeIcon },
  { key: "tiktok" as const, label: "TikTok", Icon: TikTokIcon },
];

export function SiteFooter() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    const sync = () => setSettings(getSiteSettings());
    sync();
    window.addEventListener(SITE_SETTINGS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SITE_SETTINGS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const services = settings.services.filter((l) => l.visible);
  const links = settings.importantLinks.filter((l) => l.visible);
  const activeSocial = SOCIAL_ICONS.filter(({ key }) => settings.social[key]?.trim());

  return (
    <footer className="mt-auto border-t border-[#E9EAEE] bg-[#FAFBFC] text-[#0A1B3D]">
      <Container className="lg:px-9">
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 py-8 lg:grid-cols-4 lg:gap-8 lg:py-10">
          {/* Brand */}
          <div className="col-span-2 max-w-xs lg:col-span-1">
            <div className="mb-3">
              {settings.logoSrc.startsWith("data:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.logoSrc}
                  alt={BRAND_LOGO.alt}
                  className="h-14 w-auto object-contain sm:h-16"
                />
              ) : (
                <Image
                  src={settings.logoSrc}
                  alt={BRAND_LOGO.alt}
                  width={BRAND_LOGO.width}
                  height={BRAND_LOGO.height}
                  quality={80}
                  className="h-14 w-auto object-contain sm:h-16"
                />
              )}
            </div>
            <p className="mb-4 text-[12px] leading-[1.5] text-[#5B6B7C] sm:text-[13px]">
              {settings.tagline || t("tagline")}
            </p>
            {activeSocial.length > 0 && (
              <div className="flex items-center gap-3.5">
                {activeSocial.map(({ key, label, Icon }) => (
                  <a
                    key={key}
                    href={settings.social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-[#0A1B3D] transition hover:text-[#E8913A]"
                  >
                    <Icon className="h-[16px] w-[16px]" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Services */}
          <div className="min-w-0">
            <h3 className="mb-3 text-[14px] font-bold text-[#0A1B3D]">{t("services")}</h3>
            <ul className="space-y-2 text-[12px] text-[#5B6B7C] sm:text-[13px]">
              {services.map((s) => (
                <li key={s.id}>
                  <FooterAnchor href={s.href}>{s.label}</FooterAnchor>
                </li>
              ))}
            </ul>
          </div>

          {/* Important links */}
          <div className="min-w-0">
            <h3 className="mb-3 text-[14px] font-bold text-[#0A1B3D]">
              {t("importantLinks")}
            </h3>
            <ul className="space-y-2 text-[12px] text-[#5B6B7C] sm:text-[13px]">
              {links.map((s) => (
                <li key={s.id}>
                  <FooterAnchor href={s.href}>{s.label}</FooterAnchor>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 min-w-0 lg:col-span-1">
            <h3 className="mb-3 text-[14px] font-bold text-[#0A1B3D]">{t("contact")}</h3>
            <ul className="space-y-2.5 text-[13px] text-[#5B6B7C]">
              {settings.phone && (
                <li className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0A1B3D]" strokeWidth={2} />
                  <a
                    href={`tel:${settings.phone.replace(/\s/g, "")}`}
                    className="dir-ltr-keep transition hover:text-[#0A1B3D]"
                  >
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.email && (
                <li className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0A1B3D]" strokeWidth={2} />
                  <a
                    href={`mailto:${settings.email}`}
                    className="dir-ltr-keep transition hover:text-[#0A1B3D]"
                  >
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0A1B3D]" strokeWidth={2} />
                  <span className="leading-[1.45]">{settings.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-[#E9EAEE] py-3 text-center text-[11px] text-muted sm:text-[12px]">
        {t("copyright", { year })}
      </div>
    </footer>
  );
}

function FooterAnchor({ href, children }: { href: string; children: React.ReactNode }) {
  const className = "transition hover:text-[#0A1B3D]";
  if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
