import { listPublicProducts } from "@/lib/product-repository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return Response.json(
      { products: await listPublicProducts(), source: "database" },
      {
        headers: {
          "Cache-Control": "public, max-age=0, s-maxage=60",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  } catch {
    return Response.json(
      { error: "Catalogue temporarily unavailable." },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  }
}
