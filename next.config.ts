import type { NextConfig } from "next";

// Catalogue photos managed in Trimurti Admin are served by the business
// server; Vercel's image optimiser fetches each one once and caches it.
const catalogueHost = new URL(
  process.env.TRIMURTI_CATALOG_URL || "https://triapp.trimurticooler.com",
).hostname;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Phones get small files; the largest card/hero renders at ~520 CSS px.
    deviceSizes: [360, 480, 640, 828, 1080],
    imageSizes: [96, 160, 240, 320],
    // Optimised images stay in the edge cache for 31 days.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: catalogueHost,
        pathname: "/api/v4/public/website-catalog/**",
      },
    ],
  },
  async rewrites() {
    // Records imported before the WebP switch still name the old .png files.
    return [{ source: "/products/:name.png", destination: "/products/:name.webp" }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // Photos keep their names when replaced, so cache for 30 days and
        // refresh in the background rather than marking them immutable.
        source: "/:dir(products|brand)/:file*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=604800" },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
    ];
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
