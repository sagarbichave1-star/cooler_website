import { describe, expect, it } from "vitest";
import { filterProducts } from "@/data/products";
import { buildWhatsAppUrl, productEnquiryMessage } from "@/lib/whatsapp";
import { normalizeGooglePlaceReviews } from "@/lib/google-reviews";

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

describe("Google review normalization", () => {
  it("keeps the public review fields used by the interface", () => {
    const result = normalizeGooglePlaceReviews({
      displayName: { text: "Tirupati Coolers" },
      rating: 4.6,
      userRatingCount: 18,
      googleMapsUri: "https://maps.google.com/example",
      reviews: [
        {
          name: "places/example/reviews/one",
          rating: 5,
          text: { text: "Helpful service." },
          relativePublishTimeDescription: "a month ago",
          authorAttribution: { displayName: "Customer" },
        },
      ],
    });

    expect(result.rating).toBe(4.6);
    expect(result.totalReviews).toBe(18);
    expect(result.reviews[0]?.authorName).toBe("Customer");
  });

  it("handles an empty response without inventing reviews", () => {
    expect(normalizeGooglePlaceReviews({}).reviews).toEqual([]);
  });
});
