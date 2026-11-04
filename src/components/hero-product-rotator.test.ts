import { describe, expect, it } from "vitest";
import type { Product } from "@/data/products";
import { heroSelection } from "./hero-product-rotator";

const cooler = (slug: string, extra: Partial<Product> = {}): Product => ({
  slug, name: slug, category: "Tower", summary: "", intendedFor: "", tone: "ocean",
  imageUrl: `/products/${slug}.png`, ...extra,
});

describe("hero banner selection", () => {
  it("shows featured coolers with photos, in catalogue order, up to five", () => {
    const list = [cooler("a", { featured: true }), cooler("b"), cooler("c", { featured: true, imageUrl: undefined }),
      ...["d", "e", "f", "g", "h"].map((slug) => cooler(slug, { featured: true }))];
    expect(heroSelection(list).map((item) => item.slug)).toEqual(["a", "d", "e", "f", "g"]);
  });

  it("falls back to the first coolers with photos when none are featured", () => {
    expect(heroSelection([cooler("x"), cooler("y", { imageUrl: undefined }), cooler("z")])
      .map((item) => item.slug)).toEqual(["x", "z"]);
  });
});
