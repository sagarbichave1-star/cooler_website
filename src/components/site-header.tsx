"use client";

import { MouseEvent, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { Brand } from "@/components/brand";
import { WhatsAppIcon } from "@/components/brand-icons";
import { siteConfig } from "@/config/site";
import { smoothScrollToElement } from "@/lib/smooth-scroll";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const whatsappUrl = buildWhatsAppUrl(
    "Hello Tirupati Coolers, I would like help choosing a cooler.",
  );

  function followSection(event: MouseEvent<HTMLAnchorElement>, href: string) {
    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;

    event.preventDefault();
    setMenuOpen(false);
    window.history.replaceState(null, "", href);
    smoothScrollToElement(target);
  }

  function focusCatalogueSearch() {
    const target = document.getElementById("catalogue");
    const input = document.getElementById("catalogue-search") as HTMLInputElement | null;
    if (!target) return;

    setMenuOpen(false);
    window.history.replaceState(null, "", "#catalogue");
    smoothScrollToElement(target);
    window.setTimeout(() => input?.focus({ preventScroll: true }), 650);
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand onClick={() => setMenuOpen(false)} />

        <nav className="desktop-nav" aria-label="Primary navigation">
          {siteConfig.navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="nav-link"
              onClick={(event) => followSection(event, item.href)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button className="icon-button" type="button" aria-label="Search catalogue" onClick={focusCatalogueSearch}>
            <Search size={19} />
          </button>
          <a
            className="icon-button header-whatsapp"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Enquire on WhatsApp"
            title="Enquire on WhatsApp"
          >
            <WhatsAppIcon width={19} height={19} />
          </a>
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

      <div className={menuOpen ? "mobile-menu is-open" : "mobile-menu"} aria-hidden={!menuOpen}>
        <nav className="container mobile-nav" aria-label="Mobile navigation">
          {siteConfig.navigation.map((item, index) => (
            <a key={item.label} href={item.href} onClick={(event) => followSection(event, item.href)}>
              <span>0{index + 1}</span>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
