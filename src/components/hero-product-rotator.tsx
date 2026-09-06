"use client";

import { useEffect, useState } from "react";
import { ProductImage } from "@/components/product-image";
import type { Product } from "@/data/products";

const ROTATION_INTERVAL = 4800;

type HeroProductRotatorProps = {
  products: Product[];
};

export function HeroProductRotator({ products }: HeroProductRotatorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [motionAllowed, setMotionAllowed] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setMotionAllowed(!mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    products.forEach((product) => {
      if (!product.imageUrl) return;
      const image = new window.Image();
      image.src = product.imageUrl;
    });
  }, [products]);

  useEffect(() => {
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
            <ProductImage
              product={product}
              className="hero-product-image"
              eager={index === 0}
            />
          </span>
        );
      })}
    </div>
  );
}
