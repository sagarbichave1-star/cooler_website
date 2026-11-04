import { listPublicProducts } from "@/lib/product-repository";
import { unstable_cache } from "next/cache";
import {
  listTrimurtiProducts,
  trimurtiCatalogueConfig,
} from "@/lib/trimurti-catalogue";

// Last good Trimurti catalogue, refreshed at most once a minute. A failed
// refresh keeps the previous copy, so the website still shows the latest
// Admin catalogue while the Trimurti server is unreachable.
const cachedTrimurtiProducts = unstable_cache(
  (url: string, token: string) => listTrimurtiProducts({ url, token }),
  ["trimurti-catalogue"],
  { revalidate: 60 },
);

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
        ? {
            products: await cachedTrimurtiProducts(trimurti.url, trimurti.token),
            source: "trimurti",
          }
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
