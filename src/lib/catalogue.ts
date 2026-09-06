import { products, type Product } from "@/data/products";
import { productInput, record } from "./admin-validation";

export function parseCatalogue(value: unknown): Product[] {
  // Treat the public endpoint as untrusted input even though it is first-party:
  // this protects the client fallback from malformed database/API responses.
  const items = record(value).products;
  if (!Array.isArray(items) || items.length > 100) throw new Error("Invalid catalogue.");
  const slugs = new Set<string>();
  return items.map((item) => {
    const input = record(item);
    // Bundled cutouts are an intentionally closed set of first-party assets.
    // The admin API continues to accept HTTPS-only image URLs from users.
    const bundledImage = typeof input.imageUrl === "string" &&
      /^\/products\/[a-z0-9-]+\.png$/.test(input.imageUrl)
      ? input.imageUrl
      : undefined;
    const { data } = productInput({
      ...input,
      imageUrl: bundledImage ? undefined : input.imageUrl,
      published: true,
    });
    if (bundledImage) data.imageUrl = bundledImage;
    if (slugs.has(data.slug)) throw new Error("Duplicate product ID.");
    slugs.add(data.slug);
    if (["ocean", "lagoon", "aqua", "mist"].includes(String(input.tone)))
      data.tone = input.tone as Product["tone"];
    if (Array.isArray(input.features) && input.features.length <= 20 &&
      input.features.every((text) => typeof text === "string" && text.length <= 160))
      data.features = input.features;
    data.featured = input.featured === true;
    return data;
  });
}

export async function loadCatalogue(signal: AbortSignal) {
  try {
    const response = await fetch("/api/products", {
      signal: AbortSignal.any([signal, AbortSignal.timeout(5000)]),
    });
    if (!response.ok) throw new Error("Catalogue unavailable.");
    return { products: parseCatalogue(await response.json()), fallback: false };
  } catch (error) {
    if (signal.aborted) throw error;
    // Initial seed data keeps model discovery working during a short database
    // outage, but callers must expose that availability may have changed.
    return { products, fallback: true };
  }
}
