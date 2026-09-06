import type { MetadataRoute } from "next";
import { hasProductionUrl, siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // Block preview/localhost deployments. The live host is intentionally
  // allowed, and the sitemap stays public because crawlers must be able to read it.
  if (!hasProductionUrl) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ['/admin', '/api/'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
