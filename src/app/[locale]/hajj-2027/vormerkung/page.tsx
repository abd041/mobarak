import { setRequestLocale } from "next-intl/server";
import { HajjPreRegForm } from "@/components/hajj/HajjPreRegForm";

export default async function HajjPreRegPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HajjPreRegForm />;
}
