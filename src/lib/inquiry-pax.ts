import type { PaxFormData } from "@/lib/inquiry-form-validation";

export type PaxTouch = {
  firstName?: boolean;
  lastName?: boolean;
  nationality?: boolean;
  passportType?: boolean;
  needsBed?: boolean;
};

export function createEmptyPax(type: PaxFormData["type"]): PaxFormData {
  return {
    type,
    firstName: "",
    lastName: "",
    nationality: "",
    nationalityCode: "",
    passportType: "",
    ...(type === "child" ? { needsBed: "" as const } : {}),
  };
}

export function splitPaxByType(data: PaxFormData[]) {
  return {
    adults: data.filter((p) => p.type === "adult"),
    children: data.filter((p) => p.type === "child"),
    infants: data.filter((p) => p.type === "infant"),
  };
}

export function mergePaxByCounts(
  counts: { adults: number; children: number; infants: number },
  prev: PaxFormData[],
): PaxFormData[] {
  const byType = splitPaxByType(prev);
  const list: PaxFormData[] = [];

  for (let i = 0; i < counts.adults; i++) {
    list.push(byType.adults[i] ?? createEmptyPax("adult"));
  }
  for (let i = 0; i < counts.children; i++) {
    list.push(byType.children[i] ?? createEmptyPax("child"));
  }
  for (let i = 0; i < counts.infants; i++) {
    list.push(byType.infants[i] ?? createEmptyPax("infant"));
  }

  return list;
}

export function paxHasData(p: PaxFormData): boolean {
  return Boolean(
    p.firstName.trim() ||
      p.lastName.trim() ||
      p.nationalityCode ||
      p.passportType ||
      (p.type === "child" && p.needsBed),
  );
}

export function getRemovedPaxWithData(
  type: PaxFormData["type"],
  prev: PaxFormData[],
  newCount: number,
): PaxFormData[] {
  const byType = splitPaxByType(prev);
  const list =
    type === "adult" ? byType.adults : type === "child" ? byType.children : byType.infants;

  if (newCount >= list.length) return [];
  return list.slice(newCount).filter(paxHasData);
}

export function splitTouchByPax(pax: PaxFormData[], touch: PaxTouch[]) {
  const result = {
    adults: [] as PaxTouch[],
    children: [] as PaxTouch[],
    infants: [] as PaxTouch[],
  };

  pax.forEach((p, i) => {
    const entry = touch[i] ?? {};
    if (p.type === "adult") result.adults.push(entry);
    else if (p.type === "child") result.children.push(entry);
    else result.infants.push(entry);
  });

  return result;
}

export function remapTouchForPax(
  oldPax: PaxFormData[],
  oldTouch: PaxTouch[],
  newPax: PaxFormData[],
): PaxTouch[] {
  const byType = splitTouchByPax(oldPax, oldTouch);
  const touch: PaxTouch[] = [];
  let ai = 0;
  let ci = 0;
  let ii = 0;

  for (const p of newPax) {
    if (p.type === "adult") touch.push(byType.adults[ai++] ?? {});
    else if (p.type === "child") touch.push(byType.children[ci++] ?? {});
    else touch.push(byType.infants[ii++] ?? {});
  }

  return touch;
}

export function paxTypeIndex(pax: PaxFormData[], index: number): number {
  const type = pax[index]?.type;
  if (!type) return index + 1;
  return pax.slice(0, index).filter((p) => p.type === type).length + 1;
}
