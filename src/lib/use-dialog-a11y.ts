"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Escape to close, basic focus trap, restore focus, and body scroll lock for dialogs.
 */
export function useDialogA11y(open: boolean, onClose: () => void) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previousFocus.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const dialog = dialogRef.current;
    const focusFirst = () => {
      if (!dialog) return;
      const closeBtn = dialog.querySelector<HTMLElement>("[data-dialog-close]");
      const target =
        closeBtn ?? dialog.querySelector<HTMLElement>(FOCUSABLE) ?? dialog;
      target.focus();
    };
    // Defer so dialog is in the DOM
    requestAnimationFrame(focusFirst);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialog) return;

      const nodes = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1,
      );
      if (nodes.length === 0) {
        e.preventDefault();
        dialog.focus();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && (active === first || !dialog.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !dialog.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previousFocus.current?.focus?.();
    };
  }, [open, onClose]);

  return dialogRef;
}
