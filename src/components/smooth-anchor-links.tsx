"use client";

import { useEffect } from "react";
import { smoothScrollToElement } from "@/lib/smooth-scroll";

export function SmoothAnchorLinks() {
  useEffect(() => {
    function handleAnchorClick(event: MouseEvent) {
      if (
        event.defaultPrevented
        || event.button !== 0
        || event.metaKey
        || event.ctrlKey
        || event.shiftKey
        || event.altKey
      ) return;

      const clickedElement = event.target instanceof Element ? event.target : null;
      const anchor = clickedElement?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
      const hash = anchor?.getAttribute("href");
      if (!hash || hash.length < 2) return;

      let targetId: string;
      try {
        targetId = decodeURIComponent(hash.slice(1));
      } catch {
        return;
      }
      const target = document.getElementById(targetId);
      if (!target) return;

      event.preventDefault();
      // Keep the one-page navigation smooth without leaving a section fragment
      // in the address bar after the visitor moves around the page.
      smoothScrollToElement(target);
      // Move keyboard focus as native anchor navigation would.
      if (!target.hasAttribute("tabindex")) {
        target.tabIndex = -1;
        target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
      }
      target.focus({ preventScroll: true });
    }

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return null;
}
