import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl, productEnquiryMessage } from "@/lib/whatsapp";

type WhatsAppLinkProps = {
  productName?: string;
  pageUrl?: string;
  label?: string;
  className?: string;
};

export function WhatsAppLink({
  productName,
  pageUrl,
  label = "Enquire on WhatsApp",
  className = "button",
}: WhatsAppLinkProps) {
  const message = productName
    ? productEnquiryMessage(productName, pageUrl)
    : "Hello Tirupati Coolers, I would like help choosing a cooler.";
  const url = buildWhatsAppUrl(message);

  return (
    <a className={className} href={url} target="_blank" rel="noreferrer">
      <MessageCircle size={18} />
      {label}
    </a>
  );
}
