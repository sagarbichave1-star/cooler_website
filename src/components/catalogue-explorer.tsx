"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { CoolerVisual } from "@/components/cooler-visual";
import { ProductCard } from "@/components/product-card";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { filterProducts, productCategories, type Product } from "@/data/products";

export function CatalogueExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const results = useMemo(() => filterProducts(query, category), [query, category]);
  const hasFilters = Boolean(query.trim()) || category !== "All";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (selectedProduct && !dialog.open) dialog.showModal();
    if (!selectedProduct && dialog.open) dialog.close();
  }, [selectedProduct]);

  function clearFilters() {
    setQuery("");
    setCategory("All");
  }

  return (
    <div className="catalogue-explorer">
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
        <p>{results.length} {results.length === 1 ? "product category" : "product categories"}</p>
        {hasFilters && (
          <button type="button" onClick={clearFilters}>
            <RotateCcw size={15} /> Clear filters
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <div className="product-grid catalogue-grid">
          {results.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} onSelect={setSelectedProduct} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={28} aria-hidden="true" />
          <h3>No matching products</h3>
          <p>Try another name or remove the current category filter.</p>
          <button className="button" type="button" onClick={clearFilters}>Reset catalogue</button>
        </div>
      )}

      <dialog
        ref={dialogRef}
        className="product-dialog"
        aria-label={selectedProduct ? `${selectedProduct.name} details` : "Product details"}
        onCancel={() => setSelectedProduct(null)}
        onClose={() => setSelectedProduct(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSelectedProduct(null);
        }}
      >
        {selectedProduct && (
          <div className="product-dialog-panel">
            <button className="icon-button product-dialog-close" type="button" aria-label="Close product details" onClick={() => setSelectedProduct(null)}>
              <X size={21} />
            </button>
            <div className="product-dialog-visual">
              <CoolerVisual visualId={`dialog-${selectedProduct.slug}`} tone={selectedProduct.tone} compact />
            </div>
            <div className="product-dialog-copy">
              <p className="eyebrow">{selectedProduct.category} series</p>
              <h2>{selectedProduct.name}</h2>
              <p>{selectedProduct.summary}</p>
              <dl>
                <div><dt>Suggested setting</dt><dd>{selectedProduct.intendedFor}</dd></div>
                <div><dt>Specifications</dt><dd>Awaiting verified product data</dd></div>
              </dl>
              <WhatsAppLink
                productName={selectedProduct.name}
                pageUrl="#catalogue"
                label="Enquire about this product"
              />
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
