/** Available meal plans stored on a hotel catalog record.
 * Extend by appending to this array — no pricing-engine rebuild required (spec 44).
 */
export const HOTEL_MEAL_PLANS = [
  { id: "room_only", label: "Nur Übernachtung" },
  { id: "breakfast", label: "Frühstück" },
  { id: "half_board", label: "Halbpension (Frühstück + Abendessen)" },
  { id: "full_board", label: "Vollpension" },
] as const;

export type HotelMealPlanId = (typeof HOTEL_MEAL_PLANS)[number]["id"];

export function mealPlansIncludeBreakfast(plans: readonly HotelMealPlanId[]): boolean {
  return (
    plans.includes("breakfast") ||
    plans.includes("half_board") ||
    plans.includes("full_board")
  );
}

export function normalizeMealPlans(value: unknown): HotelMealPlanId[] {
  if (!Array.isArray(value)) return ["breakfast"];
  const allowed = new Set(HOTEL_MEAL_PLANS.map((p) => p.id));
  const unique = [
    ...new Set(
      value.filter((id): id is HotelMealPlanId => typeof id === "string" && allowed.has(id as HotelMealPlanId)),
    ),
  ];
  return unique.length > 0 ? unique : ["breakfast"];
}
