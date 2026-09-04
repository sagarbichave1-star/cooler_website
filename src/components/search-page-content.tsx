"use client";

import { useSearchParams } from "next/navigation";
import { CatalogueExplorer } from "@/components/catalogue-explorer";

export function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";

  return (
    <section className="search-results-page">
      <div className="container">
        <div className="search-page-heading">
          <p className="eyebrow">Catalogue search</p>
          <h1>{query ? <>Results for <span>&ldquo;{query}&rdquo;</span></> : "What are you looking for?"}</h1>
          <p>Search by cooler type, product name, or intended space.</p>
        </div>
        <CatalogueExplorer key={query} initialQuery={query} compactHeading />
      </div>
    </section>
  );
}
