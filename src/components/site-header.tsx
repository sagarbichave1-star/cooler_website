"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Menu, MessageCircle, Search, X } from "lucide-react";
import { Brand } from "@/components/brand";
import { siteConfig } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const whatsappUrl = buildWhatsAppUrl(
    "Hello Tirupati Coolers, I would like help choosing a cooler.",
  );

  useEffect(() => {
    if (!searchOpen) return;

    searchInputRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSearchOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [searchOpen]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedQuery = query.trim();
    router.push(normalizedQuery ? `/search?q=${encodeURIComponent(normalizedQuery)}` : "/search");
    setSearchOpen(false);
  }

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Brand />

          <nav className="desktop-nav" aria-label="Primary navigation">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={pathname === item.href ? "nav-link active" : "nav-link"}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <button
              className="icon-button"
              type="button"
              aria-label="Search catalogue"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={19} />
            </button>
            {whatsappUrl ? (
              <a className="button button-small header-enquiry" href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle size={17} />
                Enquire
              </a>
            ) : (
              <span className="button button-small header-enquiry is-disabled" title="WhatsApp number pending">
                <MessageCircle size={17} />
                Enquire
              </span>
            )}
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
              <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
                <span>0{index + 1}</span>
                {item.label}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {searchOpen && (
        <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search catalogue">
          <button className="search-backdrop" aria-label="Close search" onClick={() => setSearchOpen(false)} />
          <div className="search-panel">
            <div className="container search-panel-inner">
              <div className="search-panel-heading">
                <p className="eyebrow">Catalogue search</p>
                <button className="icon-button" type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}>
                  <X size={22} />
                </button>
              </div>
              <form className="global-search-form" onSubmit={submitSearch}>
                <Search size={25} aria-hidden="true" />
                <label className="sr-only" htmlFor="global-search">Search products</label>
                <input
                  ref={searchInputRef}
                  id="global-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by product or category"
                  autoComplete="off"
                />
                <button type="submit" aria-label="Submit search">
                  <ArrowRight size={24} />
                </button>
              </form>
              <p className="search-hint">Try desert, personal, tower, or commercial.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
