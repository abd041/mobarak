"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useLayoutEffect, useRef, useState } from "react";
import type { UmrahTrip } from "@/data/mock";

const TAG_ICON: Record<number, string> = {
  1: "day-01",
  2: "day-02",
  3: "day-03",
  4: "day-04",
  5: "day-05",
  6: "day-06",
  7: "day-07",
  8: "day-13",
  9: "day-12",
  10: "day-11",
  11: "day-10",
  12: "day-09",
  13: "day-08",
};

const NAVY = "#071D4F";
const GREEN_BADGE = "#07852D";
const STROKE = "#69727D";
const ORANGE = "#F5A000";
const GRAY = "#68717D";
const GREEN = "#78B943";
const ARROW = "#69727D";

/** Valley depth as a fraction of the container width (top row sits deeper). */
const TOP_DEPTH = 0.057;
const BOTTOM_DEPTH = 0.052;
const NODE_OFFSET = 0.105;
const CONNECTOR_DIP = 0.06;
const CURVE_WIDTH = 0.18;

type Pt = { x: number; y: number };
type Dir = "right" | "left" | "up" | "down";
type NodeColor = "orange" | "gray" | "green";
type Mark =
  | { kind: "dot"; x: number; y: number; color: NodeColor }
  | { kind: "arrow"; x: number; y: number; dir: Dir };
type RouteData = { w: number; h: number; segments: string[]; marks: Mark[] };

const TOP_NODES: NodeColor[] = ["orange", "orange", "orange", "orange", "orange", "orange"];
const BOTTOM_NODES: NodeColor[] = ["green", "orange", "gray", "orange", "green"];

/** Badge-level plateaus joined by the small node-to-node U in the reference. */
function valleyPath(p0: Pt, p1: Pt, depth: number): string {
  const dir = p1.x > p0.x ? 1 : -1;
  const gap = Math.abs(p1.x - p0.x);
  const nodeOffset = gap * NODE_OFFSET;
  const connectorDip = gap * CONNECTOR_DIP;
  const curveWidth = gap * CURVE_WIDTH;
  const mx = (p0.x + p1.x) / 2;
  const firstNode = mx - dir * nodeOffset;
  const secondNode = mx + dir * nodeOffset;
  const dropStart = firstNode - dir * curveWidth;
  const riseEnd = secondNode + dir * curveWidth;
  const nodeY = p0.y + depth;
  const arrowY = nodeY + connectorDip;
  return [
    `M ${p0.x} ${p0.y}`,
    `L ${dropStart} ${p0.y}`,
    `C ${dropStart + dir * curveWidth * 0.68} ${p0.y}, ${firstNode} ${nodeY - depth * 0.38}, ${firstNode} ${nodeY}`,
    `C ${firstNode + dir * nodeOffset * 0.35} ${nodeY}, ${mx - dir * nodeOffset * 0.42} ${arrowY}, ${mx} ${arrowY}`,
    `C ${mx + dir * nodeOffset * 0.42} ${arrowY}, ${secondNode - dir * nodeOffset * 0.35} ${nodeY}, ${secondNode} ${nodeY}`,
    `C ${secondNode} ${nodeY - depth * 0.38}, ${riseEnd - dir * curveWidth * 0.68} ${p1.y}, ${riseEnd} ${p1.y}`,
    `L ${p1.x} ${p1.y}`,
  ].join(" ");
}

function rightTurn(
  p0: Pt,
  p1: Pt,
  topGap: number,
  bottomGap: number,
  topDepth: number,
): string {
  const valleyX = p0.x + topGap / 2;
  const floorHalf = topGap * NODE_OFFSET;
  const curveWidth = topGap * CURVE_WIDTH;
  const dropStart = valleyX - floorHalf - curveWidth;
  const floorStart = valleyX - floorHalf;
  const valleyY = p0.y + topDepth;
  const bottomJoin = p1.x + bottomGap * 0.38;
  const outerX = p0.x + topGap * 0.68;
  const dy = p1.y - valleyY;
  return [
    `M ${p0.x} ${p0.y}`,
    `L ${dropStart} ${p0.y}`,
    `C ${dropStart + curveWidth * 0.68} ${p0.y}, ${floorStart} ${valleyY - topDepth * 0.38}, ${floorStart} ${valleyY}`,
    `L ${valleyX} ${valleyY}`,
    `C ${valleyX + (outerX - valleyX) * 0.48} ${valleyY}, ${outerX} ${valleyY + dy * 0.15}, ${outerX} ${valleyY + dy * 0.38}`,
    `C ${outerX} ${valleyY + dy * 0.68}, ${bottomJoin + (outerX - bottomJoin) * 0.55} ${p1.y}, ${bottomJoin} ${p1.y}`,
    `L ${p1.x} ${p1.y}`,
  ].join(" ");
}

function leftTurn(
  p0: Pt,
  p1: Pt,
  topGap: number,
  bottomGap: number,
  topDepth: number,
): string {
  const bottomJoin = p0.x - bottomGap * 0.38;
  const valleyX = p1.x - topGap / 2;
  const floorHalf = topGap * NODE_OFFSET;
  const curveWidth = topGap * CURVE_WIDTH;
  const floorEnd = valleyX + floorHalf;
  const riseEnd = valleyX + floorHalf + curveWidth;
  const valleyY = p1.y + topDepth;
  const outerX = p1.x - topGap * 0.68;
  const dy = valleyY - p0.y;
  return [
    `M ${p0.x} ${p0.y}`,
    `L ${bottomJoin} ${p0.y}`,
    `C ${bottomJoin - (bottomJoin - outerX) * 0.55} ${p0.y}, ${outerX} ${p0.y + dy * 0.2}, ${outerX} ${p0.y + dy * 0.38}`,
    `L ${outerX} ${valleyY + (p0.y - valleyY) * 0.12}`,
    `C ${outerX} ${valleyY}, ${valleyX - (valleyX - outerX) * 0.48} ${valleyY}, ${valleyX} ${valleyY}`,
    `L ${floorEnd} ${valleyY}`,
    `C ${floorEnd} ${valleyY - topDepth * 0.38}, ${riseEnd - curveWidth * 0.68} ${p1.y}, ${riseEnd} ${p1.y}`,
    `L ${p1.x} ${p1.y}`,
  ].join(" ");
}

function colCenters(count: number, width: number): number[] {
  const colW = width / count;
  return Array.from({ length: count }, (_, i) => colW * (i + 0.5));
}

function valleyMarks(p0: Pt, p1: Pt, depth: number, color: NodeColor, dir: "right" | "left"): Mark[] {
  const mx = (p0.x + p1.x) / 2;
  const sign = dir === "right" ? 1 : -1;
  const gap = Math.abs(p1.x - p0.x);
  const offset = gap * NODE_OFFSET;
  const nodeY = p0.y + depth;
  const arrowY = nodeY + gap * CONNECTOR_DIP;
  return [
    { kind: "dot", x: mx - sign * offset, y: nodeY, color: "orange" },
    { kind: "arrow", x: mx, y: arrowY, dir },
    { kind: "dot", x: mx + sign * offset, y: nodeY, color },
  ];
}

function buildRoute(points: Pt[], width: number): Omit<RouteData, "w" | "h"> | null {
  if (points.length < 13) return null;

  const top = points.slice(0, 7);
  const bottom = points.slice(7);
  const segments: string[] = [];
  const marks: Mark[] = [];

  const topDepth = width * TOP_DEPTH;
  const bottomDepth = width * BOTTOM_DEPTH;

  for (let i = 0; i < top.length - 1; i++) {
    const a = top[i]!;
    const b = top[i + 1]!;
    segments.push(valleyPath(a, b, topDepth));
    marks.push(...valleyMarks(a, b, topDepth, TOP_NODES[i] ?? "orange", "right"));
  }

  const tag7 = top[6]!;
  const tag8 = bottom[5]!;
  const tag13 = bottom[0]!;
  const tag1 = top[0]!;
  const topGap = top[1]!.x - top[0]!.x;
  const bottomGap = bottom[1]!.x - bottom[0]!.x;
  const rightValleyX = tag7.x + topGap / 2;
  const rightOuterX = tag7.x + topGap * 0.68;
  const rightBottomJoin = tag8.x + bottomGap * 0.38;
  const leftBottomJoin = tag13.x - bottomGap * 0.38;
  const leftOuterX = tag1.x - topGap * 0.68;

  segments.push(rightTurn(tag7, tag8, topGap, bottomGap, topDepth));
  const rightValleyY = tag7.y + topDepth;
  const downY = rightValleyY + (tag8.y - rightValleyY) * 0.34;
  marks.push({ kind: "dot", x: rightValleyX, y: rightValleyY, color: "gray" });
  marks.push({ kind: "arrow", x: rightOuterX, y: downY, dir: "down" });
  marks.push({ kind: "dot", x: rightBottomJoin, y: tag8.y, color: "orange" });

  for (let i = bottom.length - 1; i > 0; i--) {
    const a = bottom[i]!;
    const b = bottom[i - 1]!;
    segments.push(valleyPath(a, b, bottomDepth));
    marks.push(
      ...valleyMarks(a, b, bottomDepth, BOTTOM_NODES[bottom.length - 1 - i] ?? "orange", "left"),
    );
  }

  segments.push(leftTurn(tag13, tag1, topGap, bottomGap, topDepth));
  const upY = tag13.y + (tag1.y + topDepth - tag13.y) * 0.34;
  marks.push({ kind: "dot", x: leftBottomJoin, y: tag13.y, color: "orange" });
  marks.push({ kind: "arrow", x: leftOuterX, y: upY, dir: "up" });

  return { segments, marks };
}

function measureRoute(el: HTMLElement): RouteData | null {
  const box = el.getBoundingClientRect();
  if (box.width <= 0 || box.height <= 0) return null;

  const badges = el.querySelectorAll<HTMLElement>("[data-route-badge]");
  let topY = 11;
  let bottomY = 119;

  if (badges.length >= 8) {
    const b0 = badges[0]!.getBoundingClientRect();
    const b7 = badges[7]!.getBoundingClientRect();
    topY = b0.top + b0.height / 2 - box.top;
    bottomY = b7.top + b7.height / 2 - box.top;
  }

  const topXs = colCenters(7, box.width);
  const bottomXs = colCenters(6, box.width);
  const points: Pt[] = [
    ...topXs.map((x) => ({ x, y: topY })),
    ...bottomXs.map((x) => ({ x, y: bottomY })),
  ];

  const route = buildRoute(points, box.width);
  if (!route) return null;

  return { w: box.width, h: box.height, ...route };
}

function PathArrow({ x, y, dir }: { x: number; y: number; dir: Dir }) {
  const s = 3.5;
  const pts: Record<Dir, string> = {
    right: `${x - s},${y - s * 0.65} ${x + s * 0.5},${y} ${x - s},${y + s * 0.65}`,
    left: `${x + s},${y - s * 0.65} ${x - s * 0.52},${y} ${x + s},${y + s * 0.65}`,
    up: `${x - s * 0.65},${y + s} ${x},${y - s * 0.5} ${x + s * 0.65},${y + s}`,
    down: `${x - s * 0.65},${y - s} ${x},${y + s * 0.5} ${x + s * 0.65},${y - s}`,
  };
  return <polygon points={pts[dir]} fill={ARROW} />;
}

function ItineraryNode({
  item,
  tag,
  dayLabel,
}: {
  item: UmrahTrip["itinerary"][number];
  tag: number;
  dayLabel: string;
}) {
  const iconFile = TAG_ICON[tag] ?? `day-${String(tag).padStart(2, "0")}`;
  const titleLines = item.title.split("\n");

  return (
    <li className="flex flex-col items-center px-1 pt-0 text-center">
      <span
        data-route-badge=""
        className="relative z-20 inline-flex rounded-[4px] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white"
        style={{ backgroundColor: GREEN_BADGE }}
      >
        {dayLabel}
      </span>

      <div className="relative mt-5 h-[4.75rem] w-[4.75rem] sm:h-20 sm:w-20 md:mt-6 md:h-[5.25rem] md:w-[5.25rem]">
        <Image
          src={`/brand/itinerary-icons/${iconFile}.png`}
          alt=""
          fill
          className="object-contain"
          sizes="(max-width: 768px) 76px, 84px"
        />
      </div>

      {item.time && (
        <p className="mt-2 text-[12px] leading-snug font-bold sm:text-[13px]" style={{ color: NAVY }}>
          {item.time}
        </p>
      )}

      {titleLines.map((line, i) => (
        <p
          key={i}
          className={`max-w-[9.75rem] text-[12px] leading-snug font-semibold sm:max-w-[10.25rem] sm:text-[13px] ${
            i > 0 ? "mt-0.5" : item.time ? "mt-0.5" : "mt-2"
          }`}
          style={{ color: NAVY }}
        >
          {line}
        </p>
      ))}
    </li>
  );
}

function ItineraryRoute({ route }: { route: RouteData | null }) {
  if (!route) return null;

  const fill: Record<NodeColor, string> = { orange: ORANGE, gray: GRAY, green: GREEN };

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 overflow-visible"
      width={route.w}
      height={route.h}
      aria-hidden
    >
      {route.segments.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={STROKE}
          strokeWidth="1.2"
          strokeDasharray="4 4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {(route.marks ?? []).map((m, i) =>
        m.kind === "dot" ? (
          <circle key={i} cx={m.x} cy={m.y} r="4" fill={fill[m.color]} />
        ) : (
          <PathArrow key={i} x={m.x} y={m.y} dir={m.dir} />
        ),
      )}
    </svg>
  );
}

export function ItineraryDesktopView({ trip }: { trip: UmrahTrip }) {
  const t = useTranslations("umrah");
  const containerRef = useRef<HTMLDivElement>(null);
  const [route, setRoute] = useState<RouteData | null>(null);
  const top = trip.itinerary.slice(0, 7);
  const bottom = trip.itinerary.slice(7).reverse();

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const run = () => {
      const next = measureRoute(el);
      if (next) setRoute(next);
    };

    run();
    const raf = requestAnimationFrame(run);
    const timer = window.setTimeout(run, 250);

    const images = Array.from(el.querySelectorAll("img"));
    images.forEach((img) => img.addEventListener("load", run));

    const ro = new ResizeObserver(run);
    ro.observe(el);
    window.addEventListener("resize", run);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      images.forEach((img) => img.removeEventListener("load", run));
      ro.disconnect();
      window.removeEventListener("resize", run);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative mx-auto max-w-6xl">
      <ItineraryRoute route={route} />

      <ol className="relative grid grid-cols-7 gap-x-0">
        {top.map((item) => (
          <ItineraryNode
            key={item.day}
            item={item}
            tag={item.day}
            dayLabel={t("dayLabel", { day: item.day })}
          />
        ))}
      </ol>

      <div className="relative mt-[6.75rem]">
        <ol className="relative grid grid-cols-6 gap-x-0">
          {bottom.map((item) => (
            <ItineraryNode
              key={item.day}
              item={item}
              tag={item.day}
              dayLabel={t("dayLabel", { day: item.day })}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}
