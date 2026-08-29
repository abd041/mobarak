"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { DirArrow } from "@/components/ui/DirArrow";
import {
  TripInquiryCtaBenefits,
  useTripInquiryCtaCopy,
} from "@/components/umrah/detail/TripInquiryCtaCopy";
import { useTripFlowContext } from "@/components/umrah/TripFlowProvider";
import type { UmrahTrip } from "@/data/mock";
import { IQ } from "@/lib/images";
import { resolveTrip } from "@/lib/trip-availability";
import { cn } from "@/lib/utils";

const CTA_IMAGE = "/brand/offer-hero/makkah.png";

/** Wide bottom CTA — Makkah/Medina visual, inquiry link for the current departure. */
export function TripDetailBookingCta({ trip }: { trip: UmrahTrip }) {
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
    <section id="booking" className="trip-section scroll-mt-24 pb-24 md:pb-16">
      <div className="mobarak-card relative overflow-hidden">
        <div className="absolute inset-y-0 start-0 hidden w-[38%] lg:block" aria-hidden>
          <Image
            src={CTA_IMAGE}
            alt=""
            fill
            className="object-cover object-center"
            sizes="38vw"
            quality={IQ.card}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-white/50 to-white" />
        </div>

        <div className="relative grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12 lg:py-10 lg:ps-[40%] lg:pe-10">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold leading-tight text-navy sm:text-[28px] lg:text-[30px]">
              {cta.finalTitle}
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted sm:text-[15px]">
              {cta.finalBody}
            </p>
          </div>

          <div className="w-full shrink-0 lg:w-[min(100%,320px)]">
            <Link
              href={flow.inquiryPath}
              className={cn(
                "flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-[15px] font-bold text-white shadow-sm transition sm:min-h-[56px] sm:text-base",
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
            <TripInquiryCtaBenefits
              trip={liveTrip}
              className="mt-4 space-y-2"
              itemClassName="text-[13px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
