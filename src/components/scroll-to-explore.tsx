"use client";

import { MouseEvent } from "react";
import { ArrowDown } from "lucide-react";
import { smoothScrollToElement } from "@/lib/smooth-scroll";

export function ScrollToExplore() {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById("featured");
    if (!target) return;

    event.preventDefault();
    window.history.replaceState(null, "", "#featured");
    smoothScrollToElement(target);
  }

  return (
    <a className="scroll-cue" href="#featured" onClick={handleClick}>
      <span><ArrowDown size={16} aria-hidden="true" /></span>
      Scroll to explore
    </a>
  );
}
