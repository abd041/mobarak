import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { getLocale } from "next-intl/server";
import { isRtl } from "@/i18n/routing";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  applicationName: SITE_NAME,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let locale = "de";
  try {
    locale = await getLocale();
  } catch {
    // Outside next-intl (e.g. /admin) — keep default LTR
  }
  const dir = isRtl(locale) ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${dmSans.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
