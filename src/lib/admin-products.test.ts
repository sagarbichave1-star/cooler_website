import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  isAdmin: vi.fn(),
  list: vi.fn(),
  save: vi.fn(),
  remove: vi.fn(),
}));

vi.mock("@/lib/admin-auth", () => ({ isAdmin: mocks.isAdmin }));
vi.mock("@/lib/product-repository", () => ({
  listAdminProducts: mocks.list,
  saveProduct: mocks.save,
  removeProduct: mocks.remove,
}));

const product = {
  slug: "apex",
  name: "Apex",
  category: "New Launch",
  summary: "Powerful air delivery.",
  intendedFor: "Indoor, Outdoor, Café, Office",
  tone: "ocean",
  published: true,
};
const request = (body: unknown, method = "PUT") =>
  new Request("https://coolers.test/api/admin/products", {
    method,
    headers: {
      origin: "https://coolers.test",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://coolers.test");
  mocks.isAdmin.mockResolvedValue(true);
  mocks.save.mockResolvedValue(true);
  mocks.remove.mockResolvedValue(true);
});

describe("admin product API", () => {
  it("rejects unauthenticated reads and writes before accessing MongoDB", async () => {
    mocks.isAdmin.mockResolvedValue(false);
    const route = await import("@/app/api/admin/products/route");
    expect((await route.GET()).status).toBe(401);
    expect((await route.PUT(request({ product }))).status).toBe(401);
    expect(mocks.list).not.toHaveBeenCalled();
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it("validates and persists a complete product", async () => {
    const { PUT } = await import("@/app/api/admin/products/route");
    const response = await PUT(request({ product }));
    expect(response.status).toBe(200);
    expect(mocks.save).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({ name: "Apex" }),
      true,
    );
  });

  it("rejects invalid product data before writing", async () => {
    const { PUT } = await import("@/app/api/admin/products/route");
    expect(
      (await PUT(request({ product: { ...product, slug: "../admin" } })))
        .status,
    ).toBe(400);
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it("removes a requested product", async () => {
    const { DELETE } = await import("@/app/api/admin/products/route");
    expect((await DELETE(request({ slug: "apex" }, "DELETE"))).status).toBe(
      200,
    );
    expect(mocks.remove).toHaveBeenCalledWith("apex");
  });
});
