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
import { ProductImage } from "@/components/product-image";
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
  const [tankCapacity, setTankCapacity] = useState("All");
  const [feature, setFeature] = useState("All");
  const [sort, setSort] = useState<"featured" | "capacity" | "name">(
    "featured",
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const results = useMemo(() => {
    const filtered = filterProducts(query, category, catalogue).filter(
      (product) => {
        const hasTank =
          tankCapacity === "All" || product.tankCapacity === tankCapacity;
        const productFeatures = [
          ...(product.features || []),
          ...(product.specifications || []).map(
            (specification) => `${specification.label} ${specification.value}`,
          ),
        ]
          .join(" ")
          .toLocaleLowerCase();
        const hasFeature =
          feature === "All" || productFeatures.includes(feature.toLocaleLowerCase());

        return hasTank && hasFeature;
      },
    );

    return [...filtered].sort((left, right) => {
      if (sort === "name") return left.name.localeCompare(right.name);
      if (sort === "capacity") {
        return (
          Number.parseInt(left.tankCapacity || "0", 10) -
          Number.parseInt(right.tankCapacity || "0", 10)
        );
      }
      return Number(Boolean(right.featured)) - Number(Boolean(left.featured));
    });
  }, [query, category, tankCapacity, feature, sort, catalogue]);
  const productCategories = [
    "All",
    ...new Set(catalogue.map((product) => product.category)),
  ];
  const tankCapacities = [
    "All",
    ...new Set(
      catalogue
        .map((product) => product.tankCapacity)
        .filter((capacity): capacity is string => Boolean(capacity)),
    ),
  ].sort((left, right) => {
    if (left === "All") return -1;
    if (right === "All") return 1;
    return Number.parseInt(left, 10) - Number.parseInt(right, 10);
  });
  const featureOptions = ["All", "Auto Swing", "Inverter compatible"];
  const hasFilters =
    Boolean(query.trim()) ||
    category !== "All" ||
    tankCapacity !== "All" ||
    feature !== "All" ||
    sort !== "featured";

  useEffect(() => {
    const controller = new AbortController();
    loadCatalogue(controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setCatalogue(result.products);
        setState(result.fallback ? "fallback" : "ready");
        setCategory("All");
        setTankCapacity("All");
        setFeature("All");
        setSort("featured");
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
  }, [query, category, tankCapacity, feature, sort, catalogue]);

  function clearFilters() {
    setQuery("");
    setCategory("All");
    setTankCapacity("All");
    setFeature("All");
    setSort("featured");
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
        <div className="catalogue-controls-intro">
          <span><SlidersHorizontal size={17} aria-hidden="true" /> Refine the range</span>
          <p>Use model, range, tank capacity or a useful feature to narrow the catalogue.</p>
        </div>
        <div className="catalogue-filter-grid">
          <div className="catalogue-search">
            <Search size={19} aria-hidden="true" />
            <label className="sr-only" htmlFor="catalogue-search">
              Search the catalogue
            </label>
            <input
              id="catalogue-search"
              type="search"
              value={query}
              placeholder="Search by model or use"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <label className="filter-field">
            <span>Range</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {productCategories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="filter-field">
            <span>Tank capacity</span>
            <select value={tankCapacity} onChange={(event) => setTankCapacity(event.target.value)}>
              {tankCapacities.map((capacity) => <option key={capacity}>{capacity}</option>)}
            </select>
          </label>
          <label className="filter-field">
            <span>Feature</span>
            <select value={feature} onChange={(event) => setFeature(event.target.value)}>
              {featureOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="filter-field">
            <span>Order</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
              <option value="featured">Featured</option>
              <option value="capacity">Tank capacity</option>
              <option value="name">Model name</option>
            </select>
          </label>
        </div>
      </div>

      <div className="catalogue-results-header" aria-live="polite">
        <p>
          {results.length} {results.length === 1 ? "product" : "products"}
          {state === "loading" && " · Checking the latest catalogue"}
          {state === "fallback" &&
            " · Confirm current availability on WhatsApp."}
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
              <ProductImage product={selectedProduct} eager />
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
                label="Enquire about this product"
              />
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
