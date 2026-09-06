"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Brand } from "@/components/brand";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#about");

  useEffect(() => {
    // The hero maps to About intentionally: About is the first explanatory
    // destination in the primary navigation, while Home has no separate link.
    const sectionLinks = [
      { id: "home", href: "#about" },
      { id: "about", href: "#about" },
      { id: "catalogue", href: "#catalogue" },
      { id: "faq", href: "#faq" },
      { id: "reviews", href: "#reviews" },
      { id: "contact", href: "#contact" },
    ];

    function updateActiveSection() {
      // Use a viewport marker rather than the exact top edge to avoid nav
      // flicker when two long adjacent sections share the screen.
      const scrollMarker = window.scrollY + window.innerHeight * 0.36;
      let active = "#about";

      for (const section of sectionLinks) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollMarker) active = section.href;
      }

      setActiveHref(active);
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand onClick={() => setMenuOpen(false)} />

        <nav className="desktop-nav" aria-label="Primary navigation">
          {siteConfig.navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={item.href === activeHref ? "nav-link active" : "nav-link"}
              aria-current={item.href === activeHref ? "location" : undefined}
              onClick={() => {
                setActiveHref(item.href);
                setMenuOpen(false);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="icon-button mobile-menu-button"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      <div className={menuOpen ? "mobile-menu is-open" : "mobile-menu"} inert={!menuOpen}>
        <nav className="container mobile-nav" aria-label="Mobile navigation">
          {siteConfig.navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-current={item.href === activeHref ? "location" : undefined}
              onClick={() => {
                setActiveHref(item.href);
                setMenuOpen(false);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
