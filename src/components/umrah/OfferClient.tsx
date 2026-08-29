"use client";

import { useEffect, useState } from "react";
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
      <div className="trip-mobile-page pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
        {children}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/98 px-4 pt-3 shadow-[0_-8px_24px_rgba(9,36,92,0.1)] safe-bottom lg:hidden">
        <Link
          href={flow.inquiryPath}
          className={cn(
            "flex min-h-[52px] w-full items-center justify-center gap-1.5 rounded-xl text-[15px] font-bold text-white transition",
            cta.mode === "waitlist"
              ? "bg-brand-orange-cta hover:brightness-95"
              : cta.mode === "full"
                ? "bg-navy hover:bg-navy/90"
                : "bg-brand-cta hover:bg-navy",
          )}
        >
          {cta.buttonLabel}
          <DirArrow />
        </Link>
      </div>
    </>
  );
}
