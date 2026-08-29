import { useEffect, type RefObject } from "react";

const LOCK_THRESHOLD_PX = 8;

/**
 * Horizontal overflow scroll that claims obvious left/right swipes but lets
 * vertical movement scroll the page (listing filters, trip card galleries).
 */
export function useTouchAxisScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let axis: "x" | "y" | null = null;

    const reset = () => {
      axis = null;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        reset();
        return;
      }
      startX = e.touches[0]!.clientX;
      startY = e.touches[0]!.clientY;
      axis = null;
    };

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;

      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      if (!axis) {
        if (Math.abs(dx) < LOCK_THRESHOLD_PX && Math.abs(dy) < LOCK_THRESHOLD_PX) return;
        axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }

      if (axis === "y") return;

      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;

      const scrollingLeft = dx < 0;
      const scrollingRight = dx > 0;
      const atStart = el.scrollLeft <= 0;
      const atEnd = el.scrollLeft >= maxScroll - 1;

      if ((scrollingRight && atStart) || (scrollingLeft && atEnd)) return;

      e.preventDefault();
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", reset, { passive: true });
    el.addEventListener("touchcancel", reset, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", reset);
      el.removeEventListener("touchcancel", reset);
    };
  }, [ref]);
}
