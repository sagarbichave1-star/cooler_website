import { ArrowUpRight, MapPin } from "lucide-react";
import { Brand } from "@/components/brand";
import { WhatsAppIcon } from "@/components/brand-icons";
import { siteConfig } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { ContactMap } from "./contact-map";
import { PrivacySettingsButton } from "./privacy-controls";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const whatsappUrl = buildWhatsAppUrl(
    "Hello Trimurti Coolers, I would like help choosing a cooler.",
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
            <p>
              Tell us which cooler category you are considering and we will
              continue the conversation on WhatsApp.
            </p>
          </div>

          <div className="contact-grid">
            <div className="contact-details">
              <article>
                <span className="contact-icon">
                  <MapPin size={19} />
                </span>
                <div>
                  <p>Visit Trimurti Coolers</p>
                  <strong>{siteConfig.location}</strong>
                  <small>Near Comet Motors, GHB Road</small>
                </div>
              </article>
              <article>
                <span className="contact-icon">
                  <WhatsAppIcon width={19} height={19} />
                </span>
                <div>
                  <p>Product enquiries</p>
                  <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
                  <a href={whatsappUrl} target="_blank" rel="noreferrer">
                    WhatsApp Trimurti Coolers <ArrowUpRight size={15} />
                  </a>
                </div>
              </article>
              <a
                className="button button-light"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon width={18} height={18} /> Start an enquiry
              </a>
            </div>

            <ContactMap />
          </div>
        </div>
      </section>

      <div className="footer-strip">
        <div className="container footer-bottom">
          <Brand />
          <p>&copy; {year} Trimurti Coolers</p>
          <p className="site-credit">
            This site is created and maintained by{" "}
            <a href="https://www.nyomik.in" target="_blank" rel="noreferrer">
              Nyomik Tech Studios, LLP
            </a>
          </p>
          <PrivacySettingsButton />
          <a href="#home">Back to top</a>
        </div>
      </div>
    </footer>
  );
}
