const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "";
const configuredWhatsAppNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919033148505").replace(/\D/g, "");
const configuredMapUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL?.trim() || "";
const configuredMapQuery = process.env.NEXT_PUBLIC_GOOGLE_MAPS_QUERY?.trim() || "Surat, Gujarat, India";
const configuredMapEmbedKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY?.trim() || "";

export const siteConfig = {
  name: "Tirupati Coolers",
  shortName: "Tirupati",
  description:
    "Explore the Tirupati Coolers catalogue and enquire about a product directly on WhatsApp.",
  location: "Surat, Gujarat, India",
  phone: "+91 90331 48505",
  phoneHref: "tel:+919033148505",
  mapUrl: configuredMapUrl || "https://www.google.com/maps/search/?api=1&query=Surat%2C%20Gujarat%2C%20India",
  mapEmbedUrl: configuredMapEmbedKey
    ? `https://www.google.com/maps/embed/v1/place?key=${configuredMapEmbedKey}&q=${encodeURIComponent(configuredMapQuery)}`
    : `https://www.google.com/maps?q=${encodeURIComponent(configuredMapQuery)}&output=embed`,
  url: configuredSiteUrl || "http://localhost:3000",
  whatsappNumber: /^\d{10,15}$/.test(configuredWhatsAppNumber) ? configuredWhatsAppNumber : "",
  navigation: [
    { label: "About", href: "#about" },
    { label: "Products", href: "#catalogue" },
    { label: "How to choose", href: "#guide" },
    { label: "Reviews", href: "#reviews" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

export const hasProductionUrl =
  /^https:\/\//.test(configuredSiteUrl) && !configuredSiteUrl.includes("example.com");
