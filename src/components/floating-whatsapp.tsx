import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function FloatingWhatsApp() {
  const url = buildWhatsAppUrl(
    "Hello Tirupati Coolers, I would like help choosing a cooler.",
  );

  return (
    <a
      className="floating-whatsapp"
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label="Enquire with Tirupati Coolers on WhatsApp"
    >
      <MessageCircle size={25} aria-hidden="true" />
      <span className="sr-only">WhatsApp enquiry</span>
    </a>
  );
}
