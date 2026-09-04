import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/catalogue`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.url}/catalogue/${product.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
