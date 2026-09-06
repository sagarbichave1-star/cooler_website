import { describe, expect, it } from "vitest";
import { filterProducts, products } from "@/data/products";
import { buildWhatsAppUrl, productEnquiryMessage } from "@/lib/whatsapp";
import { normalizeGooglePlaceReviews } from "@/lib/google-reviews";
import { smoothScrollDuration, smoothScrollEasing } from "@/lib/smooth-scroll";

describe("catalogue search", () => {
  it("contains every supplied product with unique IDs", () => {
    expect(products).toHaveLength(37);
    expect(new Set(products.map((product) => product.slug)).size).toBe(37);
    expect(
      products.filter((product) => product.category === "New Launch"),
    ).toHaveLength(8);
    expect(
      products.filter((product) => product.category === "Commercial / Desert"),
    ).toHaveLength(21);
    expect(
      products.filter((product) => product.category === "Personal / Home"),
    ).toHaveLength(8);
  });

  it("returns an empty list for an unknown query", () => {
    expect(filterProducts("not-a-real-product")).toEqual([]);
  });

  it("combines search and category filters", () => {
    expect(filterProducts("Ice chamber", "Personal / Home")).toHaveLength(8);
    expect(
      filterProducts("14,500 m³/H", "Commercial / Desert").map(
        (product) => product.name,
      ),
    ).toEqual(["Tent Marvel"]);
  });

  it("preserves representative launch and technical details", () => {
    const apex = products.find((product) => product.name === "Apex");
    const titan = products.find((product) => product.name === "Titan");
    const kazer = products.find((product) => product.name === "Kazer");
    expect(apex?.features).toContain("Air throw up to 30 ft");
    expect(titan).toMatchObject({
      tankCapacity: "15 L",
      powerConsumption: "150 W",
      dimensions: "310×470×590 mm",
    });
    expect(titan?.specifications).toContainEqual({
      label: "Fan size",
      value: '9"',
    });
    expect(kazer?.specifications).toContainEqual({
      label: "Ice chamber",
      value: "Yes",
    });
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

  it("creates a direct WhatsApp enquiry using the configured company number", () => {
    expect(buildWhatsAppUrl("Hello")).toBe(
      "https://wa.me/919033148505?text=Hello",
    );
  });
});

describe("Google review normalization", () => {
  it("keeps the public review fields used by the interface", () => {
    const result = normalizeGooglePlaceReviews({
      displayName: { text: "Trimurti Coolers" },
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

describe("smooth scrolling", () => {
  it("uses a longer duration for long page journeys without becoming excessive", () => {
    expect(smoothScrollDuration(200)).toBe(520);
    expect(smoothScrollDuration(4000)).toBe(960);
    expect(smoothScrollDuration(10000)).toBe(1250);
  });

  it("eases gently at both ends of the movement", () => {
    expect(smoothScrollEasing(0)).toBe(0);
    expect(smoothScrollEasing(0.5)).toBe(0.5);
    expect(smoothScrollEasing(1)).toBe(1);
    expect(smoothScrollEasing(0.1)).toBeLessThan(0.01);
  });
});
