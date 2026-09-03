"use client";

import { useEffect, useState } from "react";
import { Home } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DirArrow } from "@/components/ui/DirArrow";
import { useTripInquiryCtaCopy } from "@/components/umrah/detail/TripInquiryCtaCopy";
import { useTripFlowContext } from "@/components/umrah/TripFlowProvider";
import { resolveTrip } from "@/lib/trip-availability";
import type { Hotel, UmrahTrip } from "@/data/mock";
import { cn } from "@/lib/utils";

export function OfferClient({
  trip,
  children,
}: {
  trip: UmrahTrip;
  medina: Hotel;
  makkah: Hotel;
  children: React.ReactNode;
}) {
  const tNav = useTranslations("nav");
  const [liveTrip, setLiveTrip] = useState(trip);

  useEffect(() => {
    const sync = () => setLiveTrip(resolveTrip(trip));
    sync();
    window.addEventListener("mobarak-availability", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("mobarak-availability", sync);
      window.removeEventListener("storage", sync);
    };
  }, [trip]);

  const cta = useTripInquiryCtaCopy(liveTrip);
  const flow = useTripFlowContext();

  return (
    <>
      <div className="trip-mobile-page pb-[calc(5.75rem+0.65rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
        {children}
      </div>

      {/* Mobile sticky bar — home + inquire (matches mobile reference) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/98 px-3 pt-2.5 pb-[calc(0.65rem+env(safe-area-inset-bottom,0px))] shadow-[0_-8px_24px_rgba(9,36,92,0.1)] lg:hidden">
        <div className="flex items-center gap-2.5">
          <Link
            href="/umrah"
            aria-label={tNav("home")}
            className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl border border-[#E4EAF2] bg-white text-[#0B1B3D] transition hover:bg-[#F5F8FC]"
          >
            <Home className="h-5 w-5" strokeWidth={2.25} aria-hidden />
          </Link>
          <Link
            href={flow.inquiryPath}
            className={cn(
              "flex min-h-[52px] min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl text-[15px] font-bold text-white transition",
              cta.mode === "waitlist"
                ? "bg-brand-orange-cta hover:brightness-95"
                : cta.mode === "full"
                  ? "bg-navy hover:bg-navy/90"
                  : "bg-[#1264F5] hover:brightness-95",
            )}
          >
            {cta.buttonLabel}
            <DirArrow />
          </Link>
        </div>
      </div>
    </>
  );
}
