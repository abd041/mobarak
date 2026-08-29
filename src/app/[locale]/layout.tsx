import type { Metadata } from "next";
import { Noto_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, isRtl, type Locale } from "@/i18n/routing";
import { HeaderSwitcher } from "@/components/layout/HeaderSwitcher";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { pageMetadata } from "@/lib/page-metadata";

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "home");
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
        className={`flex min-h-full flex-1 flex-col bg-background text-navy ${
          rtl
            ? `${notoArabic.variable} font-[family-name:var(--font-noto-arabic)] [&_input]:text-start [&_textarea]:text-start [&_select]:text-start`
            : ""
        }`}
      >
        <HeaderSwitcher locale={locale as Locale} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </NextIntlClientProvider>
  );
}
