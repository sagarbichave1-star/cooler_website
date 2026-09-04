import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPageContent } from "@/components/search-page-content";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Search Catalogue",
  description: "Search the Tirupati Coolers product catalogue.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "Search Catalogue | Tirupati Coolers",
    description: "Search the Tirupati Coolers product catalogue.",
    url: "/search",
    images: ["/opengraph-image"],
  },
};

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageFallback() {
  return (
    <section className="search-results-page" aria-busy="true" aria-label="Loading search">
      <div className="container">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-control" />
      </div>
    </section>
  );
}
