import Link from "next/link";
import { ArrowUpRight, MapPin, MessageCircle } from "lucide-react";
import { Brand } from "@/components/brand";
import { siteConfig } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const whatsappUrl = buildWhatsAppUrl(
    "Hello Tirupati Coolers, I would like help choosing a cooler.",
  );

  return (
    <footer className="site-footer" id="contact">
      <div className="container footer-main">
        <div className="footer-intro">
          <Brand />
          <h2>Need help finding the right cooler?</h2>
          <p>Send a direct enquiry. Product and contact details will be completed before launch.</p>
        </div>
        <div className="footer-columns">
          <div>
            <p className="footer-label">Explore</p>
            <Link href="/">Home</Link>
            <Link href="/catalogue">Catalogue</Link>
            <Link href="/search">Search</Link>
          </div>
          <div>
            <p className="footer-label">Contact</p>
            {whatsappUrl ? (
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle size={16} /> WhatsApp <ArrowUpRight size={14} />
              </a>
            ) : (
              <span><MessageCircle size={16} /> Number pending</span>
            )}
            <span><MapPin size={16} /> {siteConfig.location}</span>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>&copy; {year} Tirupati Coolers</p>
        <p>Catalogue preview</p>
      </div>
    </footer>
  );
}
