import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { normalizeGooglePlaceReviews } from "./google-reviews";

const cookieStore = vi.hoisted(() => ({ get: vi.fn(), set: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: async () => cookieStore }));

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://coolers.test");
  vi.stubEnv("ADMIN_ACCESS_KEY", "a".repeat(64));
  vi.stubEnv("ADMIN_SESSION_SECRET", "b".repeat(64));
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.clearAllMocks(); });
const request = (body: unknown, method = "POST") => new Request("https://coolers.test/api/admin/session", {
  method, headers: { origin: "https://coolers.test", "Content-Type": "application/json" }, body: JSON.stringify(body),
});

describe("session and enquiry routes", () => {
  it("rejects a wrong key and creates, verifies and clears a signed cookie", async () => {
    const route = await import("@/app/api/admin/session/route");
    expect((await route.POST(request({ key: "wrong" }))).status).toBe(401);
    const response = await route.POST(request({ key: "a".repeat(64) }));
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    const [name, value, options] = cookieStore.set.mock.calls[0];
    expect(options).toMatchObject({ httpOnly: true, sameSite: "strict", maxAge: 14400 });
    cookieStore.get.mockReturnValue({ value });
    expect(await (await route.GET()).json()).toMatchObject({ authenticated: true });
    expect((await route.DELETE(request({}, "DELETE"))).status).toBe(200);
    expect(cookieStore.set).toHaveBeenLastCalledWith(name, "", expect.objectContaining({ maxAge: 0 }));
  });
  it("counts malformed login attempts before reading another body", async () => {
    const { POST } = await import("@/app/api/admin/session/route");
    for (let i = 0; i < 10; i++) await POST(request([]));
    const response = await POST(request({ key: "a".repeat(64) }));
    expect(response.status).toBe(429);
    expect(Number(response.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect(cookieStore.set).not.toHaveBeenCalled();
  });
  it("drops honeypots and never claims to save a real enquiry", async () => {
    const { POST } = await import("@/app/api/enquiries/route");
    expect((await POST(request({ website: "spam" }))).status).toBe(200);
    const response = await POST(request({ name: "Customer", phone: "+919033148505", message: "Please contact me", consent: true }));
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ error: expect.stringContaining("WhatsApp") });
  });
});

describe("Google reviews boundary", () => {
  it("makes no upstream request without configuration", async () => {
    vi.stubEnv("GOOGLE_PLACES_API_KEY", "");
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const { GET } = await import("@/app/api/google-reviews/route");
    expect((await GET()).status).toBe(503);
    expect(fetch).not.toHaveBeenCalled();
  });
  it("refreshes from Google once a day and serves the saved copy in between", async () => {
    vi.stubEnv("GOOGLE_PLACES_API_KEY", "test-key");
    vi.stubEnv("GOOGLE_PLACE_ID", "test-place");
    const fetch = vi.fn().mockImplementation(async () =>
      Response.json({ rating: 4.9, reviews: [{ rating: 5, originalText: { text: "Best cooler shop" } }] }),
    );
    vi.stubGlobal("fetch", fetch);
    const route = await import("@/app/api/google-reviews/route");
    route.resetReviewCacheForTests();
    expect((await route.GET()).status).toBe(200);
    const second = await (await route.GET()).json();
    expect(second.data.reviews[0].text).toBe("Best cooler shop");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][1]).toMatchObject({ redirect: "error", next: { revalidate: 86400 }, signal: expect.any(AbortSignal) });
  });
  it("keeps showing the last good reviews when Google fails", async () => {
    vi.stubEnv("GOOGLE_PLACES_API_KEY", "test-key");
    vi.stubEnv("GOOGLE_PLACE_ID", "test-place");
    const route = await import("@/app/api/google-reviews/route");
    route.resetReviewCacheForTests();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ reviews: [{ rating: 5, text: { text: "Great" } }] })));
    await route.GET();
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 2 * 86_400_000);
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("down")));
    const body = await (await route.GET()).json();
    vi.useRealTimers();
    expect(body.stale).toBe(true);
    expect(body.data.reviews[0].text).toBe("Great");
  });
  it("caps paid requests while Google keeps failing", async () => {
    vi.stubEnv("GOOGLE_PLACES_API_KEY", "test-key");
    vi.stubEnv("GOOGLE_PLACE_ID", "test-place");
    const route = await import("@/app/api/google-reviews/route");
    route.resetReviewCacheForTests();
    const fetch = vi.fn().mockRejectedValue(new Error("down"));
    vi.stubGlobal("fetch", fetch);
    let limited = 0;
    for (let i = 0; i < 40; i++) if ((await route.GET()).status === 429) limited += 1;
    expect(limited).toBeGreaterThan(0);
    expect(fetch.mock.calls.length).toBeLessThanOrEqual(30);
  });
  it("drops unsafe links, invalid counts and excess review records", () => {
    const result = normalizeGooglePlaceReviews({ userRatingCount: NaN, googleMapsUri: "javascript:alert(1)", reviews: Array(8).fill({ rating: 5, text: { text: "Good" }, authorAttribution: { uri: "data:text/html,hello", photoUri: "http://insecure.test/photo" } }) });
    expect(result.totalReviews).toBe(0);
    expect(result.sourceUrl).toBe("");
    expect(result.reviews).toHaveLength(5);
    expect(result.reviews[0].authorUrl).toBeUndefined();
    expect(result.reviews[0].authorPhotoUrl).toBeUndefined();
  });
});

describe("Google review filtering", () => {
  it("keeps only rated reviews with words, in the original language", () => {
    const result = normalizeGooglePlaceReviews({
      reviews: [
        { rating: 5, text: { text: "Translated" }, originalText: { text: "મૂળ લખાણ" }, googleMapsUri: "https://maps.google.com/review/1" },
        { rating: 4 },
        { rating: 0, text: { text: "No stars" } },
      ],
    });
    expect(result.reviews).toHaveLength(1);
    expect(result.reviews[0].text).toBe("મૂળ લખાણ");
    expect(result.reviews[0].sourceUrl).toBe("https://maps.google.com/review/1");
  });
});
