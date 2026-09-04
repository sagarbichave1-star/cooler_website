import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import { CoolerVisual } from "@/components/cooler-visual";
import type { Product } from "@/data/products";

type ProductCardProps = {
  product: Product;
  index?: number;
};

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <article className="product-card" style={{ "--card-index": index } as CSSProperties}>
      <Link className="product-visual-link" href={`/catalogue/${product.slug}`} aria-label={`View ${product.name}`}>
        <span className="product-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <CoolerVisual visualId={`card-${product.slug}`} tone={product.tone} compact />
      </Link>
      <div className="product-card-content">
        <p className="product-category">{product.category} series</p>
        <h3><Link href={`/catalogue/${product.slug}`}>{product.name}</Link></h3>
        <p>{product.intendedFor}</p>
        <Link className="text-link" href={`/catalogue/${product.slug}`}>
          View product <ArrowUpRight size={17} />
        </Link>
      </div>
    </article>
  );
}
