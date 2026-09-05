import { afterEach, describe, expect, it, vi } from "vitest";
import {
  adminConfigured,
  createAdminSession,
  validAccessKey,
  validAdminSession,
} from "./admin-token";
import { enquiryInput, productInput } from "./admin-validation";
import { readFormJson, throttle } from "./request-guards";

afterEach(() => vi.unstubAllEnvs());
function configureAdmin() {
  vi.stubEnv("ADMIN_ACCESS_KEY", "test-access-key-with-at-least-32-characters");
  vi.stubEnv(
    "ADMIN_SESSION_SECRET",
    "different-test-signing-secret-at-least-32-characters",
  );
}

describe("admin key and sessions", () => {
  it("fails closed without configuration", () => {
    vi.stubEnv("ADMIN_ACCESS_KEY", "");
    vi.stubEnv("ADMIN_SESSION_SECRET", "");
    expect(adminConfigured()).toBe(false);
    expect(validAccessKey("")).toBe(false);
    expect(validAdminSession("fake")).toBe(false);
  });
  it("accepts only the configured key", () => {
    configureAdmin();
    expect(validAccessKey("test-access-key-with-at-least-32-characters")).toBe(
      true,
    );
    expect(validAccessKey("wrong")).toBe(false);
  });
  it("rejects tampered, expired and rotated sessions", () => {
    configureAdmin();
    const now = Date.now();
    const session = createAdminSession(now);
    expect(validAdminSession(session, now)).toBe(true);
    expect(validAdminSession(session + "x", now)).toBe(false);
    expect(validAdminSession(session, now + 4 * 3600000)).toBe(false);
    vi.stubEnv(
      "ADMIN_ACCESS_KEY",
      "replacement-key-with-at-least-32-characters",
    );
    expect(validAdminSession(session, now)).toBe(false);
  });
});

describe("enquiry and product boundaries", () => {
  const enquiry = {
    name: "A customer",
    phone: "+91 9033148505",
    email: "",
    message: "Please help me choose a cooler.",
    consent: true,
  };
  it("accepts contact details and explicitly requires consent", () => {
    expect(enquiryInput(enquiry).phone).toBe("+91 9033148505");
    expect(() => enquiryInput({ ...enquiry, consent: false })).toThrow();
    expect(() =>
      enquiryInput({ ...enquiry, message: "a".repeat(3001) }),
    ).toThrow();
    expect(() => enquiryInput({ ...enquiry, phone: "hello" })).toThrow();
  });
  it("rejects executable image URLs and invalid product IDs", () => {
    const product = {
      slug: "desert-80",
      name: "Desert 80",
      category: "Desert",
      summary: "Product description",
      intendedFor: "Large rooms",
      published: false,
    };
    expect(productInput(product).data.slug).toBe("desert-80");
    expect(() => productInput({ ...product, slug: "../admin" })).toThrow();
    expect(() =>
      productInput({ ...product, imageUrl: "javascript:alert(1)" }),
    ).toThrow();
  });
});

describe("request protection", () => {
  it("rejects cross-site requests, invalid JSON and oversized bodies", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://coolers.test");
    const request = (body: string, origin = "https://coolers.test") =>
      new Request("https://coolers.test/api/enquiries", {
        method: "POST",
        headers: { origin, "Content-Type": "application/json" },
        body,
      });
    await expect(
      readFormJson(request("{}", "https://other.test")),
    ).rejects.toThrow("origin");
    await expect(readFormJson(request("{broken"))).rejects.toThrow("Invalid");
    await expect(readFormJson(request("a".repeat(16385)))).rejects.toThrow(
      "too large",
    );
    await expect(readFormJson(request('{"name":"Customer"}'))).resolves.toEqual(
      { name: "Customer" },
    );
  });
  it("limits repeated attempts without trusting forwarded IP headers", () => {
    throttle("test-only-bucket", 1);
    expect(() => throttle("test-only-bucket", 1)).toThrow("Too many");
  });
});
