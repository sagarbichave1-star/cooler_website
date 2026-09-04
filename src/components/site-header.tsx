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
  const searchDialogRef = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const whatsappUrl = buildWhatsAppUrl(
    "Hello Tirupati Coolers, I would like help choosing a cooler.",
  );

  useEffect(() => {
    const dialog = searchDialogRef.current;
    if (!dialog) return;

    if (searchOpen && !dialog.open) {
      dialog.showModal();
      searchInputRef.current?.focus();
    } else if (!searchOpen && dialog.open) {
      dialog.close();
    }
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
          <Brand onClick={() => setMenuOpen(false)} />

          <nav className="desktop-nav" aria-label="Primary navigation">
            {siteConfig.navigation.map((item) => {
              const isActive = item.href === "/"
                ? pathname === "/"
                : !item.href.includes("#") && pathname.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={isActive ? "nav-link active" : "nav-link"}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="header-actions">
            <button
              className="icon-button"
              type="button"
              aria-label="Search catalogue"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
            >
              <Search size={19} />
            </button>
            <a className="button button-small header-enquiry" href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={17} />
              Enquire
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

        {menuOpen && (
          <div className="mobile-menu is-open">
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
        )}
      </header>

      <dialog
        ref={searchDialogRef}
        className="search-overlay"
        aria-label="Search catalogue"
        onCancel={(event) => {
          event.preventDefault();
          setSearchOpen(false);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSearchOpen(false);
        }}
      >
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
      </dialog>
    </>
  );
}
