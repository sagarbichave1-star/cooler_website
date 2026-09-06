const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "";
const configuredWhatsAppNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919033148505").replace(/\D/g, "");
const configuredMapUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL?.trim() || "";
const configuredMapQuery =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_QUERY?.trim() ||
  "5 Sonal Industrial, GHB Road, near Comet Motors, Surat, Gujarat 394210";
const configuredMapEmbedKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY?.trim() || "";
const trimurtiGoogleMapsUrl = "https://maps.app.goo.gl/NnSCA2dcJWgCNA5g8";
const trimurtiMapCoordinates = "21.1511821,72.8352649";

export const siteConfig = {
  name: "Trimurti Coolers",
  shortName: "Trimurti",
  description:
    "Trimurti Coolers is an authorised Novamax distributor in Surat. Explore air-cooler models, specifications and direct WhatsApp enquiries.",
  location: "5 Sonal Industrial, GHB Road, near Comet Motors, Surat, Gujarat 394210",
  phone: "+91 90331 48505",
  phoneHref: "tel:+919033148505",
  mapUrl:
    configuredMapUrl ||
    trimurtiGoogleMapsUrl,
  mapEmbedUrl: configuredMapEmbedKey
    ? `https://www.google.com/maps/embed/v1/place?key=${configuredMapEmbedKey}&q=${encodeURIComponent(configuredMapQuery)}`
    : `https://www.google.com/maps?q=${trimurtiMapCoordinates}&z=17&output=embed`,
  url: configuredSiteUrl || "http://localhost:3000",
  whatsappNumber: /^\d{10,15}$/.test(configuredWhatsAppNumber) ? configuredWhatsAppNumber : "",
  navigation: [
    { label: "About", href: "#about" },
    { label: "Products", href: "#catalogue" },
    { label: "Choosing a cooler", href: "#catalogue" },
    { label: "Reviews", href: "#reviews" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

export const hasProductionUrl =
  /^https:\/\//.test(configuredSiteUrl) && !configuredSiteUrl.includes("example.com");
