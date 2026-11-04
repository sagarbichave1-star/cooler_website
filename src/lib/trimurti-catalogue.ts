import type { Product } from "@/data/products";

// The cooler catalogue is managed in Trimurti Enterprise Admin on the
// business server. This server-only client reads its published coolers with
// an Admin-issued token; the token never reaches the browser.
export function trimurtiCatalogueConfig() {
  const url = process.env.TRIMURTI_CATALOG_URL?.trim();
  const token = process.env.TRIMURTI_CATALOG_TOKEN?.trim();
  if (!url || !token) return null;
  if (!url.startsWith("https://") || !/^tcat_[0-9a-f]{64}$/.test(token))
    throw new Error("Trimurti catalogue settings are invalid.");
  return { url, token };
}

const text = (value: unknown) =>
  typeof value === "string" && value.trim() ? value : undefined;

export async function listTrimurtiProducts(config: {
  url: string;
  token: string;
}): Promise<Product[]> {
  const response = await fetch(config.url, {
    headers: { "x-trimurti-catalog-token": config.token },
    redirect: "error",
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("Trimurti catalogue unavailable.");
  const body: unknown = await response.json();
  const items = (body as { products?: unknown })?.products;
  if (!Array.isArray(items) || items.length > 100)
    throw new Error("Invalid Trimurti catalogue.");
  // Field names follow the Trimurti feed; the browser re-validates the result.
  return items.map((value) => {
    const item = value as Record<string, unknown>;
    const name = String(item.name);
    const category = String(item.category);
    return {
      slug: String(item.slug),
      name,
      category,
      // Optional in Trimurti but required by the website's validator: one
      // blank cooler must not reject the whole catalogue.
      summary: text(item.summary) ?? `${name} air cooler.`,
      intendedFor: text(item.intended_for) ?? category,
      tone: "ocean",
      featured: item.featured === true,
      model: text(item.model),
      tankCapacity: text(item.tank_capacity),
      coolingArea: text(item.cooling_area),
      powerConsumption: text(item.power_consumption),
      dimensions: text(item.dimensions),
      features: Array.isArray(item.features) ? (item.features as string[]) : [],
      specifications: Array.isArray(item.specifications)
        ? (item.specifications as Product["specifications"])
        : [],
      imageUrl: text(item.image_url),
    };
  });
}
