import { products, type Product } from "@/data/products";
import { productInput, record } from "./admin-validation";

export function parseCatalogue(value: unknown): Product[] {
  const items = record(value).products;
  if (!Array.isArray(items) || items.length > 100) throw new Error("Invalid catalogue.");
  const slugs = new Set<string>();
  return items.map((item) => {
    const input = record(item);
    const { data } = productInput({ ...input, published: true });
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
    return { products, fallback: true };
  }
}
