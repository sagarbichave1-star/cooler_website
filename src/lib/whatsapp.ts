import { siteConfig } from "@/config/site";

export function buildWhatsAppUrl(message: string) {
  if (!siteConfig.whatsappNumber) return null;

  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function productEnquiryMessage(productName: string, pageUrl?: string) {
  const lines = [
    `Hello Tirupati Coolers, I would like to know more about the ${productName}.`,
    pageUrl ? `Product page: ${pageUrl}` : "",
  ].filter(Boolean);

  return lines.join("\n");
}
