import Image from "next/image";
import type { Product } from "@/data/products";

type ProductImageProps = {
  product: Product;
  className?: string;
  eager?: boolean;
};

const catalogueHost = (() => {
  try {
    return new URL(
      process.env.TRIMURTI_CATALOG_URL || "https://triapp.trimurticooler.com",
    ).hostname;
  } catch {
    return "";
  }
})();

/** Bundled photos and Trimurti catalogue photos go through the image optimiser. */
export function optimisable(src: string) {
  if (src.startsWith("/")) return true;
  try {
    const url = new URL(src);
    return (
      url.protocol === "https:" &&
      url.hostname === catalogueHost &&
      url.pathname.startsWith("/api/v4/public/website-catalog/")
    );
  } catch {
    return false;
  }
}

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
    // Width/height only reserve the box (cutouts are transparent and
    // object-fit: contain); CSS sets the rendered size. `sizes` lets phones
    // download a ~360-480 px file instead of the full photo. Other HTTPS
    // addresses an Admin enters load as they are.
    <Image
      className={`product-image ${className}`.trim()}
      src={product.imageUrl}
      alt={`${product.name} Novamax air cooler`}
      width={667}
      height={1000}
      sizes="(max-width: 640px) 86vw, (max-width: 1100px) 45vw, 430px"
      priority={eager}
      loading={eager ? undefined : "lazy"}
      unoptimized={!optimisable(product.imageUrl)}
    />
  );
}
