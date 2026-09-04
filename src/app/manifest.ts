import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tirupati Coolers",
    short_name: "Tirupati",
    description: "Browse the Tirupati Coolers product catalogue.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f9fc",
    theme_color: "#066bc7",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
