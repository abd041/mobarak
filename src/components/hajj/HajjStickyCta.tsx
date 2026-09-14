"use client";

/** Wrapper kept for call-site compatibility. Mobile mockup has no sticky bar. */
export function HajjStickyCta({
  children,
}: {
  children: React.ReactNode;
  ctaLabel?: string;
  campaignSlug?: string;
}) {
  return <>{children}</>;
}
