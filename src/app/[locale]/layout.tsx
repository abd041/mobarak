import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, isRtl, type Locale } from "@/i18n/routing";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const rtl = isRtl(locale);

  return (
    <NextIntlClientProvider messages={messages}>
      <div
        lang={locale}
        dir={rtl ? "rtl" : "ltr"}
        className={`flex min-h-full flex-1 flex-col bg-background text-navy ${rtl ? "font-[family-name:var(--font-noto-arabic)]" : ""}`}
      >
        <SiteHeader locale={locale as Locale} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </NextIntlClientProvider>
  );
}
