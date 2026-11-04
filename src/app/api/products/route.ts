import { listPublicProducts } from "@/lib/product-repository";
import {
  listTrimurtiProducts,
  trimurtiCatalogueConfig,
} from "@/lib/trimurti-catalogue";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Cache successful public reads briefly at the edge, while never caching a
    // failure that could hide a recovered catalogue after an outage.
    // Trimurti Admin is the catalogue authority once connected; MongoDB stays
    // the source only for deployments without Trimurti settings.
    const trimurti = trimurtiCatalogueConfig();
    return Response.json(
      trimurti
        ? { products: await listTrimurtiProducts(trimurti), source: "trimurti" }
        : { products: await listPublicProducts(), source: "database" },
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
