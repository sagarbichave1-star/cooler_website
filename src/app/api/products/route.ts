import { products } from "@/data/products";

export const dynamic = "force-dynamic";

export async function GET() {
  // Replace this data source with a published-only MongoDB query when storage is enabled.
  return Response.json({ products, source: "preview" }, {
    headers: { "Cache-Control": "public, max-age=0, s-maxage=60" },
  });
}
