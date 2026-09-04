export const siteConfig = {
  name: "Tirupati Coolers",
  shortName: "Tirupati",
  description:
    "Explore the Tirupati Coolers catalogue and enquire about a product directly on WhatsApp.",
  location: "Surat, Gujarat, India",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000",
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, ""),
  navigation: [
    { label: "Home", href: "/" },
    { label: "Catalogue", href: "/catalogue" },
    { label: "How to choose", href: "/#guide" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;

export const hasProductionUrl = siteConfig.url !== "http://localhost:3000";
