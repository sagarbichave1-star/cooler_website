import type { Product } from "@/data/products";

type ProductImageProps = {
  product: Product;
  className?: string;
  eager?: boolean;
};

export function ProductImage({
  product,
  className = "",
  eager = false,
}: ProductImageProps) {
  if (!product.imageUrl) {
    return (
      <span className={`product-image product-image-unavailable ${className}`.trim()}>
        Product image being refreshed
      </span>
    );
  }

  return (
    // The supplied catalogue and Novamax product pages provide product-specific
    // images. A native img keeps those first-party remote sources direct.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`product-image ${className}`.trim()}
      src={product.imageUrl}
      alt={`${product.name} Novamax air cooler`}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
