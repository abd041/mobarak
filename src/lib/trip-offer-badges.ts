import type { TripOfferBadgeId, UmrahTrip } from "@/data/mock";

const OFFER_BADGE_ORDER: TripOfferBadgeId[] = ["popular", "direct_flight", "early_bird"];

const OFFER_BADGE_SET = new Set<TripOfferBadgeId>(OFFER_BADGE_ORDER);

function isOfferBadgeId(value: string): value is TripOfferBadgeId {
  return OFFER_BADGE_SET.has(value as TripOfferBadgeId);
}

/**
 * Marketing badges for offer cards — explicit `offerBadges` plus auto
 * `direct_flight` when the outbound leg is marked direct.
 */
export function getTripOfferBadgeIds(trip: UmrahTrip): TripOfferBadgeId[] {
  const selected = new Set<TripOfferBadgeId>();

  for (const raw of trip.offerBadges ?? []) {
    if (isOfferBadgeId(raw)) selected.add(raw);
  }

  if (trip.outbound?.direct) {
    selected.add("direct_flight");
  }

  return OFFER_BADGE_ORDER.filter((id) => selected.has(id));
}
