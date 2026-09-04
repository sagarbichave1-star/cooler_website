"use client";

import { MouseEvent } from "react";
import { ArrowDown } from "lucide-react";
import { smoothScrollToElement } from "@/lib/smooth-scroll";

export function ScrollToExplore() {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById("about");
    if (!target) return;

    event.preventDefault();
    window.history.replaceState(null, "", "#about");
    smoothScrollToElement(target);
  }

  return (
    <a className="scroll-cue" href="#about" onClick={handleClick}>
      <span><ArrowDown size={16} aria-hidden="true" /></span>
      Scroll to explore
    </a>
  );
}
