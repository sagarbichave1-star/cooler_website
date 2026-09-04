const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "";
const configuredWhatsAppNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");

export const siteConfig = {
  name: "Tirupati Coolers",
  shortName: "Tirupati",
  description:
    "Explore the Tirupati Coolers catalogue and enquire about a product directly on WhatsApp.",
  location: "Surat, Gujarat, India",
  url: configuredSiteUrl || "http://localhost:3000",
  whatsappNumber: /^\d{10,15}$/.test(configuredWhatsAppNumber) ? configuredWhatsAppNumber : "",
  navigation: [
    { label: "Home", href: "/" },
    { label: "Catalogue", href: "/catalogue" },
    { label: "How to choose", href: "/#guide" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;

export const hasProductionUrl =
  /^https:\/\//.test(configuredSiteUrl) && !configuredSiteUrl.includes("example.com");
