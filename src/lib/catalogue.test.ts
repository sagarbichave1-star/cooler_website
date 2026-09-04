import { describe, expect, it } from "vitest";
import { filterProducts } from "@/data/products";
import { buildWhatsAppUrl, productEnquiryMessage } from "@/lib/whatsapp";

describe("catalogue search", () => {
  it("finds a product by its intended use", () => {
    expect(filterProducts("compact").map((product) => product.slug)).toEqual([
      "tower-cooler",
    ]);
  });

  it("returns an empty list for an unknown query", () => {
    expect(filterProducts("not-a-real-product")).toEqual([]);
  });

  it("combines search and category filters", () => {
    expect(filterProducts("cooler", "Personal")).toHaveLength(1);
  });
});

describe("WhatsApp enquiry copy", () => {
  it("includes the product and optional page URL", () => {
    const message = productEnquiryMessage(
      "Tower Cooler",
      "https://example.com/catalogue/tower-cooler",
    );

    expect(message).toContain("Tower Cooler");
    expect(message).toContain("https://example.com/catalogue/tower-cooler");
  });

  it("creates a number-free WhatsApp share link before a number is configured", () => {
    expect(buildWhatsAppUrl("Hello")).toBe("https://wa.me/?text=Hello");
  });
});
