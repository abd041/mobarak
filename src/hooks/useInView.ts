import { useEffect, useRef, useState, type RefObject } from "react";

type UseInViewOptions = IntersectionObserverInit & {
  /** When true, stop observing after the element becomes visible once. */
  once?: boolean;
};

/**
 * Observe when an element enters the viewport — used to defer below-the-fold card galleries.
 */
export function useInView<T extends Element>({
  once = true,
  root = null,
  rootMargin = "240px 0px",
  threshold = 0.01,
}: UseInViewOptions = {}): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || (once && inView)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setInView(true);
        if (once) observer.disconnect();
      },
      { root, rootMargin, threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, once, root, rootMargin, threshold]);

  return [ref, inView];
}
