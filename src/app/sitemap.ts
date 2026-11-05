import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Public pages only; never list admin or API routes.
  return [
    {
      url: siteConfig.url,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/doors-windows-surat`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
