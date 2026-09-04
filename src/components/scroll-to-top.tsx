"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { smoothScrollTo } from "@/lib/smooth-scroll";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    function updateVisibility() {
      if (frame) return;

      frame = requestAnimationFrame(() => {
        setVisible(window.scrollY > 560);
        frame = 0;
      });
    }

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <button
      className={visible ? "scroll-to-top is-visible" : "scroll-to-top"}
      type="button"
      aria-label="Scroll to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      title="Scroll to top"
      onClick={() => smoothScrollTo(0)}
    >
      <ArrowUp size={18} aria-hidden="true" />
    </button>
  );
}
