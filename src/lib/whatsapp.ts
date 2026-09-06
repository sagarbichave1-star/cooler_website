import { siteConfig } from "@/config/site";

export function buildWhatsAppUrl(message: string) {
  const recipient = siteConfig.whatsappNumber ? `/${siteConfig.whatsappNumber}` : "/";
  return `https://wa.me${recipient}?text=${encodeURIComponent(message)}`;
}

export function productEnquiryMessage(productName: string) {
  return `Hello Trimurti Coolers, I would like to know more about the ${productName}.`;
}
