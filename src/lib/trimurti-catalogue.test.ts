import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/products/route";
import { parseCatalogue } from "./catalogue";
import { listPublicProducts } from "./product-repository";

vi.mock("@/lib/product-repository", () => ({ listPublicProducts: vi.fn() }));

const token = "tcat_" + "b".repeat(64);
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("Trimurti catalogue source", () => {
  it("reads published coolers from Trimurti with the server-only token", async () => {
    vi.stubEnv("TRIMURTI_CATALOG_URL", "https://triapp.example/api/v4/public/website-catalog");
    vi.stubEnv("TRIMURTI_CATALOG_TOKEN", token);
    const fetch = vi.fn().mockResolvedValue(Response.json({ products: [{
      slug: "atlas", name: "Atlas", category: "Tower", summary: "Tall cooler",
      intended_for: "Halls", tank_capacity: "90 L", features: ["Remote"],
      image_url: "https://triapp.example/api/v4/public/website-catalog/photo/x.png",
    }] }));
    vi.stubGlobal("fetch", fetch);
    const response = await GET();
    const body = await response.json();
    expect(fetch.mock.calls[0][1].headers["x-trimurti-catalog-token"]).toBe(token);
    expect(body.source).toBe("trimurti");
    expect(listPublicProducts).not.toHaveBeenCalled();
    const [atlas] = parseCatalogue(body);
    expect(atlas.intendedFor).toBe("Halls");
    expect(atlas.tankCapacity).toBe("90 L");
    expect(atlas.imageUrl).toMatch(/^https:\/\/triapp\.example\//);
  });

  it("reports an outage instead of serving a stale database catalogue", async () => {
    vi.stubEnv("TRIMURTI_CATALOG_URL", "https://triapp.example/api/v4/public/website-catalog");
    vi.stubEnv("TRIMURTI_CATALOG_TOKEN", token);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 401 })));
    expect((await GET()).status).toBe(503);
  });

  it("rejects a plain-HTTP catalogue URL", async () => {
    vi.stubEnv("TRIMURTI_CATALOG_URL", "http://triapp.example/feed");
    vi.stubEnv("TRIMURTI_CATALOG_TOKEN", token);
    expect((await GET()).status).toBe(503);
  });
});
