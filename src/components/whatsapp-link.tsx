import { WhatsAppIcon } from "@/components/brand-icons";
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
      <WhatsAppIcon width={18} height={18} />
      {label}
    </a>
  );
}
