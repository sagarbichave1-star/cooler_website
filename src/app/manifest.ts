import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Trimurti Coolers",
    short_name: "Trimurti",
    description: "Browse the Trimurti Coolers product catalogue.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f9fc",
    theme_color: "#066bc7",
    icons: [
      {
        src: "/brand/trimurti-coolers-mark-generated.png",
        sizes: "1254x1254",
        type: "image/png",
      },
    ],
  };
}
