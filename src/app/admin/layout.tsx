import Link from "next/link";
import { NextIntlClientProvider } from "next-intl";
import { BrandLogo } from "@/components/brand/BrandLogo";
/**
 * Admin language policy (spec 18):
 * Internal system / Admin / Login UI is **always German**.
 * Customer inquiry language (`customer_language`) never switches this shell —
 * it only drives customer-facing PDFs (and future outbound messages).
 *
 * Arabic inquiry → German Admin → Arabic PDF
 * German inquiry → German Admin → German PDF
 * English inquiry → German Admin → English PDF
 */
import {
  LayoutDashboard,
  Home,
  Plane,
  Hotel,
  Inbox,
  BookOpen,
  ListOrdered,
  Users,
  Award,
  Image as ImageIcon,
  Settings,
  LogOut,
  FileText,
  MessageSquare,
  Stamp,
} from "lucide-react";
import deMessages from "../../../messages/de.json";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/homepage", label: "Startseite", icon: Home },
  { href: "/admin/umrah/trips", label: "Umrah Reisen", icon: Plane },
  { href: "/admin/individual-umrah", label: "Individuelle Umrah", icon: FileText },
  { href: "/admin/visum-service", label: "Visum Service", icon: Stamp },
  { href: "/admin/hotels", label: "Hotels", icon: Hotel },
  { href: "/admin/airlines", label: "Airlines", icon: Plane },
  { href: "/admin/inquiries/umrah", label: "Umrah Anfragen", icon: Inbox },
  { href: "/admin/inquiries/individual-umrah", label: "Indiv. Umrah Anfragen", icon: MessageSquare },
  { href: "/admin/hajj", label: "Hajj Kampagnen", icon: BookOpen },
  { href: "/admin/hajj/steps", label: "Hajj Schritte", icon: ListOrdered },
  { href: "/admin/inquiries/hajj", label: "Hajj Voranmeldungen", icon: Users },
  { href: "/admin/partners", label: "Partner", icon: Award },
  { href: "/admin/media", label: "Medien", icon: ImageIcon },
  { href: "/admin/settings", label: "Einstellungen", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="de" messages={deMessages}>
      <div className="flex min-h-screen bg-surface text-navy" dir="ltr" lang="de">
        <aside className="hidden w-64 shrink-0 border-e border-line bg-white md:flex md:flex-col">
          <div className="border-b border-line px-5 py-5">
            <Link href="/admin" className="inline-flex rounded-sm">
              <BrandLogo height={48} priority />
            </Link>
            <p className="mt-2 text-xs font-semibold text-muted">Admin-Bereich</p>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-navy/80 hover:bg-surface hover:text-navy"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-line p-3">
            <Link
              href="/admin/login"
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-surface"
            >
              <LogOut className="h-4 w-4" />
              Abmelden
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-line bg-white px-4 py-3 md:px-6">
            <div className="md:hidden">
              <BrandLogo height={36} />
            </div>
            <p className="text-sm text-muted">
              Admin-Oberfläche immer auf Deutsch · Angebote &amp; Hotels lokal gespeichert
            </p>
            <span className="rounded-full bg-brand-orange-soft px-3 py-1 text-xs font-semibold text-brand-orange">
              Admin
            </span>
          </header>
          <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-line bg-white px-3 py-2 md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full border border-line px-3 py-1.5 text-xs font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </div>
    </NextIntlClientProvider>
  );
}
