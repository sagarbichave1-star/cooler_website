import { WhatsAppIcon } from "@/components/brand-icons";
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
      title="Enquire on WhatsApp"
    >
      <WhatsAppIcon width={25} height={25} />
    </a>
  );
}
