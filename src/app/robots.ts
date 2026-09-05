import type { MetadataRoute } from "next";
import { hasProductionUrl, siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
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
