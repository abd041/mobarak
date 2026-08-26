import { setRequestLocale } from "next-intl/server";
import { ComingSoon } from "@/components/ui/ComingSoon";

export default async function PlaceholderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ComingSoon />;
}
