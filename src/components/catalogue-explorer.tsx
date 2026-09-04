"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { filterProducts, productCategories } from "@/data/products";

type CatalogueExplorerProps = {
  initialQuery?: string;
  compactHeading?: boolean;
};

export function CatalogueExplorer({ initialQuery = "", compactHeading = false }: CatalogueExplorerProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("All");
  const results = useMemo(() => filterProducts(query, category), [query, category]);
  const hasFilters = Boolean(query.trim()) || category !== "All";

  function clearFilters() {
    setQuery("");
    setCategory("All");
  }

  return (
    <div className={compactHeading ? "catalogue-explorer is-compact" : "catalogue-explorer"}>
      <div className="catalogue-controls">
        <div className="catalogue-search">
          <Search size={19} aria-hidden="true" />
          <label className="sr-only" htmlFor="catalogue-search">Search the catalogue</label>
          <input
            id="catalogue-search"
            type="search"
            value={query}
            placeholder="Search products"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="filter-label" aria-hidden="true">
          <SlidersHorizontal size={17} /> Filter by type
        </div>
        <div className="category-filters" aria-label="Filter products by category">
          {productCategories.map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? "category-filter is-active" : "category-filter"}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="catalogue-results-header" aria-live="polite">
        <p>{results.length} {results.length === 1 ? "product" : "products"}</p>
        {hasFilters && (
          <button type="button" onClick={clearFilters}>
            <RotateCcw size={15} /> Clear filters
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <div className="product-grid catalogue-grid">
          {results.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={28} aria-hidden="true" />
          <h2>No matching products</h2>
          <p>Try a different product name or remove the current category filter.</p>
          <button className="button" type="button" onClick={clearFilters}>
            Reset catalogue
          </button>
          <Link className="text-link" href="/#contact">Ask for help</Link>
        </div>
      )}
    </div>
  );
}
