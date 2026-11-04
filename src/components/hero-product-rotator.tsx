"use client";

import { useEffect, useState } from "react";
import { ProductImage } from "@/components/product-image";
import type { Product } from "@/data/products";
import { loadCatalogue } from "@/lib/catalogue";

const ROTATION_INTERVAL = 4800;
const HERO_LIMIT = 5;

/** Featured coolers with photos lead the banner, in catalogue order. */
export function heroSelection(catalogue: Product[]) {
  const withPhoto = catalogue.filter((product) => product.imageUrl);
  const featured = withPhoto.filter((product) => product.featured);
  return (featured.length ? featured : withPhoto).slice(0, HERO_LIMIT);
}

type HeroProductRotatorProps = {
  products: Product[];
};

export function HeroProductRotator({
  products: initialProducts,
}: HeroProductRotatorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [liveProducts, setLiveProducts] = useState<Product[] | null>(null);
  // The server renders the bundled set; the live catalogue (Trimurti Admin)
  // replaces it so unpublished coolers leave the banner. During an outage
  // the bundled set stays, matching the catalogue's own fallback.
  const products = liveProducts ?? initialProducts;

  useEffect(() => {
    const controller = new AbortController();
    loadCatalogue(controller.signal)
      .then((result) => {
        if (result.fallback) return;
        const selection = heroSelection(result.products);
        if (selection.length) {
          setActiveIndex(0);
          setLiveProducts(selection);
        }
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);
  const [motionAllowed, setMotionAllowed] = useState(true);

  useEffect(() => {
    // Respect an operating-system motion preference instead of offering a
    // second, inconsistent local setting for decorative hero motion.
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setMotionAllowed(!mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);


  useEffect(() => {
    // Only one interval is active for a given product list; changing the list
    // safely restarts rotation with the current number of frames.
    if (!motionAllowed || products.length < 2) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % products.length);
    }, ROTATION_INTERVAL);

    return () => window.clearInterval(interval);
  }, [motionAllowed, products.length]);

  if (!products.length) return null;

  return (
    <div className="hero-rotator">
      {products.map((product, index) => {
        const isActive = index === activeIndex % products.length;

        return (
          <span
            className={`hero-rotator-frame${isActive ? " is-active" : ""}`}
            key={product.slug}
            aria-hidden={!isActive}
          >
            {/* Only the first photo loads up front; the next one is fetched
                one frame ahead so the cross-fade never shows an empty box. */}
            {index <= (activeIndex % products.length) + 1 ||
            (activeIndex % products.length === products.length - 1 &&
              index === 0) ? (
              <ProductImage
                product={product}
                className="hero-product-image"
                eager={index === 0}
              />
            ) : null}
          </span>
        );
      })}
    </div>
  );
}
