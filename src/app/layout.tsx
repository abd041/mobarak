import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={`${dmSans.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
