import { afterEach, describe, expect, it, vi } from "vitest";
import { products, filterProducts } from "@/data/products";
import { GET } from "@/app/api/products/route";
import { loadCatalogue, parseCatalogue } from "./catalogue";

afterEach(() => vi.unstubAllGlobals());

describe("dynamic catalogue", () => {
  it("serves a cacheable public preview until MongoDB is connected", async () => {
    const response = await GET();
    expect(response.headers.get("Cache-Control")).toContain("s-maxage=60");
    expect(await response.json()).toEqual({ products, source: "preview" });
  });
  it("uses fetched products and searches newly returned categories", async () => {
    const product = { ...products[0], slug: "new-product", name: "New model", category: "New category" };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ products: [product] })));
    const result = await loadCatalogue(new AbortController().signal);
    expect(result.fallback).toBe(false);
    expect(filterProducts("New model", "New category", result.products)).toHaveLength(1);
  });
  it("preserves a valid empty catalogue instead of inventing availability", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ products: [] })));
    expect(await loadCatalogue(new AbortController().signal)).toEqual({ products: [], fallback: false });
  });
  it.each(["network", "timeout", "http", "malformed"])("keeps previews after %s failure", async (failure) => {
    const fetch = vi.fn();
    if (failure === "network" || failure === "timeout") fetch.mockRejectedValue(new Error(failure));
    else fetch.mockResolvedValue(Response.json(failure === "http" ? {} : { products: [null] }, { status: failure === "http" ? 503 : 200 }));
    vi.stubGlobal("fetch", fetch);
    expect(await loadCatalogue(new AbortController().signal)).toEqual({ products, fallback: true });
  });
  it("rejects duplicate IDs, oversized catalogues and unsafe URLs", () => {
    expect(() => parseCatalogue({ products: [products[0], products[0]] })).toThrow();
    expect(() => parseCatalogue({ products: Array(101).fill(products[0]) })).toThrow();
    expect(() => parseCatalogue({ products: [{ ...products[0], imageUrl: "javascript:alert(1)" }] })).toThrow();
  });
  it("does not apply fallback data after component unmount", async () => {
    const controller = new AbortController();
    controller.abort();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("aborted")));
    await expect(loadCatalogue(controller.signal)).rejects.toThrow("aborted");
  });
});
