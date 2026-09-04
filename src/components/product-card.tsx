"use client";

import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import { CoolerVisual } from "@/components/cooler-visual";
import type { Product } from "@/data/products";

type ProductCardProps = {
  product: Product;
  index?: number;
  onSelect: (product: Product) => void;
};

export function ProductCard({ product, index = 0, onSelect }: ProductCardProps) {
  return (
    <article className="product-card" style={{ "--card-index": index } as CSSProperties}>
      <button className="product-visual-link" type="button" onClick={() => onSelect(product)} aria-label={`View ${product.name}`}>
        <span className="product-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <CoolerVisual visualId={`card-${product.slug}`} tone={product.tone} compact />
      </button>
      <div className="product-card-content">
        <p className="product-category">{product.category} series</p>
        <h3><button type="button" onClick={() => onSelect(product)}>{product.name}</button></h3>
        <p>{product.intendedFor}</p>
        <button className="text-link product-detail-trigger" type="button" onClick={() => onSelect(product)}>
          View details <ArrowUpRight size={17} />
        </button>
      </div>
    </article>
  );
}
