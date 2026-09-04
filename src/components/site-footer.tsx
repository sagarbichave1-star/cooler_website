import { ArrowUpRight, MapPin } from "lucide-react";
import { Brand } from "@/components/brand";
import { WhatsAppIcon } from "@/components/brand-icons";
import { siteConfig } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const whatsappUrl = buildWhatsAppUrl(
    "Hello Tirupati Coolers, I would like help choosing a cooler.",
  );

  return (
    <footer className="site-footer" id="contact">
      <section className="contact-section" aria-labelledby="contact-heading">
        <div className="container">
          <div className="contact-heading-row">
            <div>
              <p className="eyebrow light">Contact</p>
              <h2 id="contact-heading">Get in touch.</h2>
            </div>
            <p>Tell us which cooler category you are considering and we will continue the conversation on WhatsApp.</p>
          </div>

          <div className="contact-grid">
            <div className="contact-details">
              <article>
                <span className="contact-icon"><MapPin size={19} /></span>
                <div><p>Registered location</p><strong>{siteConfig.location}</strong><small>Exact address awaiting verification</small></div>
              </article>
              <article>
                <span className="contact-icon"><WhatsAppIcon width={19} height={19} /></span>
                <div><p>Product enquiries</p><a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp Tirupati Coolers <ArrowUpRight size={15} /></a><small>Company number can be added before launch</small></div>
              </article>
              <a className="button button-light" href={whatsappUrl} target="_blank" rel="noreferrer">
                <WhatsAppIcon width={18} height={18} /> Start an enquiry
              </a>
            </div>

            <div className="map-frame">
              <iframe
                title="Map showing Tirupati Coolers in Surat, Gujarat"
                src={siteConfig.mapEmbedUrl}
                width="760"
                height="440"
                loading="lazy"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <a href={siteConfig.mapUrl} target="_blank" rel="noreferrer">Open in Google Maps <ArrowUpRight size={15} /></a>
            </div>
          </div>
        </div>
      </section>

      <div className="footer-strip">
        <div className="container footer-bottom">
          <Brand />
          <p>&copy; {year} Tirupati Coolers</p>
          <a href="#home">Back to top</a>
        </div>
      </div>
    </footer>
  );
}
