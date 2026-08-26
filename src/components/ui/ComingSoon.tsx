import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export async function ComingSoon() {
  const t = await getTranslations("common");

  return (
    <Container className="py-24 text-center">
      <h1 className="mb-3 text-3xl font-bold text-navy">{t("comingSoonTitle")}</h1>
      <p className="mb-8 text-muted">{t("comingSoon")}</p>
      <Link
        href="/"
        className="inline-flex rounded-xl bg-brand-cta px-5 py-3 text-sm font-semibold text-white"
      >
        {t("backHome")}
      </Link>
    </Container>
  );
}
