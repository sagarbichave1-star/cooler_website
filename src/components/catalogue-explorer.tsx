"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { CoolerVisual } from "@/components/cooler-visual";
import { ProductCard } from "@/components/product-card";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { filterProducts, products, type Product } from "@/data/products";
import { loadCatalogue } from "@/lib/catalogue";

export function CatalogueExplorer() {
  const [catalogue, setCatalogue] = useState(products);
  const [state, setState] = useState<"loading" | "ready" | "fallback">(
    "loading",
  );
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const results = useMemo(
    () => filterProducts(query, category, catalogue),
    [query, category, catalogue],
  );
  const productCategories = [
    "All",
    ...new Set(catalogue.map((product) => product.category)),
  ];
  const hasFilters = Boolean(query.trim()) || category !== "All";

  useEffect(() => {
    const controller = new AbortController();
    loadCatalogue(controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setCatalogue(result.products);
        setState(result.fallback ? "fallback" : "ready");
        setCategory("All");
        setSelectedProduct(null);
      })
      .catch(() => {
        /* Unmounted: leave the cancelled request alone. */
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (selectedProduct && !dialog.open) dialog.showModal();
    if (!selectedProduct && dialog.open) dialog.close();
  }, [selectedProduct]);

  useEffect(() => {
    if (carouselRef.current) carouselRef.current.scrollLeft = 0;
  }, [query, category, catalogue]);

  function clearFilters() {
    setQuery("");
    setCategory("All");
  }

  function moveCarousel(direction: -1 | 1) {
    const carousel = carouselRef.current;
    if (!carousel) return;
    carousel.scrollBy({
      left: direction * carousel.clientWidth * 0.82,
      behavior: "smooth",
    });
  }

  return (
    <div className="catalogue-explorer">
      <div className="catalogue-controls">
        <div className="catalogue-search">
          <Search size={19} aria-hidden="true" />
          <label className="sr-only" htmlFor="catalogue-search">
            Search the catalogue
          </label>
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
        <div
          className="category-filters"
          aria-label="Filter products by category"
        >
          {productCategories.map((item) => (
            <button
              key={item}
              type="button"
              className={
                category === item
                  ? "category-filter is-active"
                  : "category-filter"
              }
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="catalogue-results-header" aria-live="polite">
        <p>
          {results.length} {results.length === 1 ? "product" : "products"}
          {state === "loading" && " · Checking the latest catalogue"}
          {state === "fallback" &&
            " · Showing range previews. Confirm availability on WhatsApp."}
        </p>
        {hasFilters && (
          <button type="button" onClick={clearFilters}>
            <RotateCcw size={15} /> Clear filters
          </button>
        )}
        {results.length > 1 && (
          <div
            className="carousel-actions"
            aria-label="Catalogue carousel controls"
          >
            <button
              type="button"
              onClick={() => moveCarousel(-1)}
              aria-label="Previous products"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => moveCarousel(1)}
              aria-label="Next products"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {results.length > 0 ? (
        <div
          className="catalogue-carousel"
          ref={carouselRef}
          aria-label="All products"
        >
          {results.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              index={index}
              onSelect={setSelectedProduct}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={28} aria-hidden="true" />
          <h3>
            {catalogue.length
              ? "No matching products"
              : "The catalogue is being updated"}
          </h3>
          <p>
            {catalogue.length
              ? "Try another name or remove the current category filter."
              : "Please enquire on WhatsApp for the current range."}
          </p>
          {hasFilters && (
            <button className="button" type="button" onClick={clearFilters}>
              Reset catalogue
            </button>
          )}
        </div>
      )}

      <dialog
        ref={dialogRef}
        className="product-dialog"
        aria-label={
          selectedProduct
            ? `${selectedProduct.name} details`
            : "Product details"
        }
        onCancel={() => setSelectedProduct(null)}
        onClose={() => setSelectedProduct(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSelectedProduct(null);
        }}
      >
        {selectedProduct && (
          <div className="product-dialog-panel">
            <button
              className="icon-button product-dialog-close"
              type="button"
              aria-label="Close product details"
              onClick={() => setSelectedProduct(null)}
            >
              <X size={21} />
            </button>
            <div className="product-dialog-visual">
              <CoolerVisual
                visualId={`dialog-${selectedProduct.slug}`}
                tone={selectedProduct.tone}
                compact
              />
            </div>
            <div className="product-dialog-copy">
              <p className="eyebrow">{selectedProduct.category} series</p>
              <h2>{selectedProduct.name}</h2>
              <p>{selectedProduct.summary}</p>
              <dl>
                <div>
                  <dt>Suggested setting</dt>
                  <dd>{selectedProduct.intendedFor}</dd>
                </div>
                {selectedProduct.model && (
                  <div>
                    <dt>Model</dt>
                    <dd>{selectedProduct.model}</dd>
                  </div>
                )}
                {selectedProduct.tankCapacity && (
                  <div>
                    <dt>Tank capacity</dt>
                    <dd>{selectedProduct.tankCapacity}</dd>
                  </div>
                )}
                {selectedProduct.coolingArea && (
                  <div>
                    <dt>Cooling area</dt>
                    <dd>{selectedProduct.coolingArea}</dd>
                  </div>
                )}
                {selectedProduct.powerConsumption && (
                  <div>
                    <dt>Power</dt>
                    <dd>{selectedProduct.powerConsumption}</dd>
                  </div>
                )}
                {selectedProduct.dimensions && (
                  <div>
                    <dt>Dimensions</dt>
                    <dd>{selectedProduct.dimensions}</dd>
                  </div>
                )}
                {!selectedProduct.model &&
                  !selectedProduct.tankCapacity &&
                  !selectedProduct.coolingArea &&
                  !selectedProduct.powerConsumption &&
                  !selectedProduct.dimensions && (
                    <div>
                      <dt>Specifications</dt>
                      <dd>Awaiting verified product data</dd>
                    </div>
                  )}
                {selectedProduct.specifications?.map((specification) => (
                  <div key={specification.label}>
                    <dt>{specification.label}</dt>
                    <dd>{specification.value}</dd>
                  </div>
                ))}
              </dl>
              {selectedProduct.features?.length ? (
                <ul className="product-feature-list">
                  {selectedProduct.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              ) : null}
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
