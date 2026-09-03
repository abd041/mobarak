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

const CTA_IMAGE = "/brand/booking-cta-medina.png";

/** Wide bottom CTA — Medina visual with soft fade, inquiry link for the current departure. */
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
      <div className="relative overflow-hidden rounded-[16px] border border-[#E4EAF2] bg-white shadow-[0_4px_18px_rgba(9,36,92,0.06)]">
        {/* Mobile: image on top with soft fade into content */}
        <div className="relative aspect-[16/10] w-full lg:hidden" aria-hidden>
          <Image
            src={CTA_IMAGE}
            alt=""
            fill
            className="object-cover object-[center_35%]"
            sizes="100vw"
            quality={IQ.card}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 48%, rgba(255,255,255,0.7) 78%, #fff 100%)",
            }}
          />
        </div>

        {/* Desktop: left photo with soft feather into white */}
        <div className="pointer-events-none absolute inset-y-0 start-0 hidden w-[34%] xl:w-[36%] lg:block" aria-hidden>
          <Image
            src={CTA_IMAGE}
            alt=""
            fill
            className="object-cover object-[center_40%]"
            sizes="36vw"
            quality={IQ.card}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 42%, rgba(255,255,255,0.55) 68%, rgba(255,255,255,0.92) 86%, #fff 100%)",
            }}
          />
        </div>

        <div className="relative grid gap-6 px-5 pb-7 pt-1 sm:gap-7 sm:px-8 sm:pb-8 sm:pt-2 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,320px)] lg:items-center lg:gap-10 lg:py-9 lg:ps-[36%] lg:pe-9 lg:pt-9 xl:ps-[38%]">
          <div className="min-w-0 max-w-xl">
            <h2 className="text-[22px] font-bold leading-[1.25] tracking-[-0.02em] text-[#111111] sm:text-[26px] lg:text-[28px]">
              {cta.finalTitle}
            </h2>
            <p className="mt-2.5 text-[14px] leading-relaxed text-[#3D4F5F] sm:mt-3 sm:text-[15px]">
              {cta.finalBody}
            </p>
          </div>

          <div className="w-full shrink-0">
            <Link
              href={flow.inquiryPath}
              className={cn(
                "flex min-h-[50px] w-full items-center justify-center gap-2 rounded-[12px] px-5 py-3.5 text-[14px] font-bold text-white transition sm:min-h-[52px] sm:text-[15px]",
                "hover:brightness-[0.97]",
                cta.mode === "waitlist"
                  ? "bg-brand-orange-cta"
                  : cta.mode === "full"
                    ? "bg-navy"
                    : "bg-[#1264F5] shadow-[0_8px_20px_rgba(18,100,245,0.28)]",
              )}
            >
              <span className="inline-flex items-center gap-1.5">
                {cta.buttonLabel}
                <DirArrow />
              </span>
            </Link>

            <TripInquiryCtaBenefits
              trip={liveTrip}
              className="mt-3.5 flex flex-wrap gap-x-4 gap-y-2"
              itemClassName="text-[12px] font-medium text-[#6B7C8F]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
