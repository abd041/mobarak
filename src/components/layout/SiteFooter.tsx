import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Share2 } from "lucide-react";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tMeta = await getTranslations("meta");
  const year = new Date().getFullYear();

  const services = [
    { href: "/umrah-gruppenreisen", label: tNav("umrahGroup") },
    { href: "/individuelle-umrah", label: tNav("individualUmrah") },
    { href: "/hajj-2027", label: tNav("hajj2027") },
    { href: "/visum-service", label: tNav("visa") },
  ];

  const links = [
    { href: "/ueber-uns", label: tNav("about") },
    { href: "/reisebedingungen", label: t("terms") },
    { href: "/datenschutz", label: t("privacy") },
    { href: "/agb", label: t("agb") },
    { href: "/impressum", label: t("imprint") },
    { href: "/kontakt", label: tNav("contact") },
  ];

  return (
    <footer className="mt-auto border-t border-line bg-navy text-white">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-14 md:grid-cols-2 md:px-8 lg:grid-cols-4">
        <div>
          <div className="mb-4 text-lg font-bold tracking-wide text-brand-orange">
            MOBARAK
          </div>
          <p className="mb-4 text-sm leading-relaxed text-white/75">{t("tagline")}</p>
          <div className="flex gap-3">
            <span className="rounded-full bg-white/10 p-2" aria-label="Social">
              <Share2 className="h-4 w-4" />
            </span>
            <span className="rounded-full bg-white/10 px-2.5 py-2 text-xs font-bold">FB</span>
            <span className="rounded-full bg-white/10 px-2.5 py-2 text-xs font-bold">IG</span>
            <span className="rounded-full bg-white/10 px-2.5 py-2 text-xs font-bold">YT</span>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
            {t("services")}
          </h3>
          <ul className="space-y-2 text-sm text-white/80">
            {services.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="hover:text-white">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
            {t("importantLinks")}
          </h3>
          <ul className="space-y-2 text-sm text-white/80">
            {links.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="hover:text-white">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
            {t("contact")}
          </h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li>{tMeta("phone")}</li>
            <li>{tMeta("email")}</li>
            <li>{tMeta("address")}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        {t("copyright", { year })}
      </div>
    </footer>
  );
}
