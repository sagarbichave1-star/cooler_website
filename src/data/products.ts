export type ProductTone = "ocean" | "lagoon" | "aqua" | "mist";

export type Product = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  intendedFor: string;
  tone: ProductTone;
  featured?: boolean;
  model?: string;
  tankCapacity?: string;
  coolingArea?: string;
  powerConsumption?: string;
  dimensions?: string;
  features?: string[];
  imageUrl?: string;
};

export const products: Product[] = [
  {
    slug: "desert-cooler",
    name: "Desert Cooler",
    category: "Desert",
    summary: "A catalogue preview for the Tirupati desert cooler range.",
    intendedFor: "Larger spaces",
    tone: "ocean",
    featured: true,
  },
  {
    slug: "personal-cooler",
    name: "Personal Cooler",
    category: "Personal",
    summary: "A catalogue preview for the Tirupati personal cooler range.",
    intendedFor: "Personal spaces",
    tone: "lagoon",
    featured: true,
  },
  {
    slug: "tower-cooler",
    name: "Tower Cooler",
    category: "Tower",
    summary: "A catalogue preview for the Tirupati tower cooler range.",
    intendedFor: "Compact floor space",
    tone: "aqua",
    featured: true,
  },
  {
    slug: "commercial-cooler",
    name: "Commercial Cooler",
    category: "Commercial",
    summary: "A catalogue preview for the Tirupati commercial cooler range.",
    intendedFor: "Commercial spaces",
    tone: "mist",
  },
];

export function filterProducts(query: string, category = "All", catalogue = products) {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  return catalogue.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const searchableText = [
      product.name,
      product.category,
      product.summary,
      product.intendedFor,
      product.model,
      ...(product.features || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase();

    return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
  });
}
