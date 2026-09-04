import type { Metadata } from "next";
import { CatalogueExplorer } from "@/components/catalogue-explorer";

export const metadata: Metadata = {
  title: "Search Catalogue",
  description: "Search the Tirupati Coolers product catalogue.",
  robots: { index: false, follow: true },
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = Array.isArray(params.q) ? params.q[0] || "" : params.q || "";

  return (
    <section className="search-results-page">
      <div className="container">
        <div className="search-page-heading">
          <p className="eyebrow">Catalogue search</p>
          <h1>{query ? <>Results for <span>&ldquo;{query}&rdquo;</span></> : "What are you looking for?"}</h1>
          <p>Search by cooler type, product name, or intended space.</p>
        </div>
        <CatalogueExplorer initialQuery={query} compactHeading />
      </div>
    </section>
  );
}
