import type { MetadataRoute } from "next";
import { hasProductionUrl, siteConfig } from "@/config/site";

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
      disallow: ["/search"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
