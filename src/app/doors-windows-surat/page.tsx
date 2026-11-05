import type { Metadata } from "next";
import { ArrowUpRight, Hammer, Ruler, Truck } from "lucide-react";
import { WhatsAppIcon } from "@/components/brand-icons";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Doors and Windows in Surat | Measured and Installed",
  description:
    "Trimurti makes doors and windows to your measurements in Surat: a site visit, exact measurement, a written quotation and installation by our team.",
  alternates: { canonical: "/doors-windows-surat" },
  openGraph: {
    title: "Doors and Windows in Surat | Trimurti",
    description:
      "Made-to-measure doors and windows in Surat, with a site visit, quotation and installation.",
    url: "/doors-windows-surat",
  },
};

const steps = [
  {
    icon: Ruler,
    title: "Site visit and measurement",
    text: "Our team visits your home or site in Surat and measures every door and window opening.",
  },
  {
    icon: Hammer,
    title: "Quotation and making",
    text: "You receive a clear written quotation. Each piece is then made to the agreed size.",
  },
  {
    icon: Truck,
    title: "Delivery and installation",
    text: "We deliver and install each piece, and confirm with photos when the work is done.",
  },
];

export default function DoorsWindowsPage() {
  const whatsappUrl = buildWhatsAppUrl(
    "Hello Trimurti, I would like a site visit for doors and windows in Surat.",
  );
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Doors and windows, measured and installed",
    serviceType: "Door and window supply and installation",
    provider: { "@id": `${siteConfig.url}/#business` },
    areaServed: { "@type": "City", name: "Surat" },
    url: `${siteConfig.url}/doors-windows-surat`,
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <section className="section" aria-labelledby="doors-heading">
        <div className="container">
          <p className="eyebrow">Doors &amp; windows · Surat</p>
          <h1 id="doors-heading" className="page-title">Doors and windows, made to measure in Surat.</h1>
          <p className="section-description">
            Besides air coolers, Trimurti measures, makes and installs doors
            and windows for homes, shops and offices in Surat and nearby
            areas. One team takes care of the visit, the quotation and the
            fitting.
          </p>
          <p>
            <a className="button" href={whatsappUrl} target="_blank" rel="noreferrer">
              <WhatsAppIcon width={18} height={18} /> Book a site visit
            </a>
          </p>
        </div>
      </section>
      <section className="section" aria-labelledby="doors-steps">
        <div className="container">
          <SectionHeading
            eyebrow="How it works"
            title={<span id="doors-steps">From measurement to installation.</span>}
          />
          <div className="doors-steps">
            {steps.map(({ icon: Icon, title, text }) => (
              <article key={title} className="doors-step">
                <span className="contact-icon">
                  <Icon size={19} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <p>
            Visit us at {siteConfig.location}, or{" "}
            <a href={siteConfig.mapUrl} target="_blank" rel="noreferrer">
              find us on Google Maps <ArrowUpRight size={14} />
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
