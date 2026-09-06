import Link from "next/link";
import {
  ArrowRight,
  Check,
  Droplets,
  Gauge,
  MapPin,
  Maximize2,
  Search,
  Waves,
  Zap,
} from "lucide-react";
import { CatalogueExplorer } from "@/components/catalogue-explorer";
import { CoolerVisual } from "@/components/cooler-visual";
import { GoogleReviews } from "@/components/google-reviews";
import { ScrollToExplore } from "@/components/scroll-to-explore";
import { SectionHeading } from "@/components/section-heading";
import { WhatsAppLink } from "@/components/whatsapp-link";

const selectionPoints = [
  {
    number: "01",
    icon: Maximize2,
    title: "Measure your space",
    text: "Start with the room or open area where the cooler will be used.",
  },
  {
    number: "02",
    icon: Droplets,
    title: "Check tank capacity",
    text: "Compare the tank size with how often you would prefer to refill it.",
  },
  {
    number: "03",
    icon: Gauge,
    title: "Review air delivery",
    text: "Match verified air delivery to the size and ventilation of the space.",
  },
  {
    number: "04",
    icon: Zap,
    title: "Compare power needs",
    text: "Check rated consumption and electrical compatibility before choosing.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero" id="home">
        <div className="hero-watermark" aria-hidden="true">COOL</div>
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="hero-eyebrow">
              <span className="hero-eyebrow-mark" aria-hidden="true"><Waves size={15} /></span>
              <span className="hero-eyebrow-name">Trimurti Coolers</span>
              <span className="hero-eyebrow-divider" aria-hidden="true" />
              <span className="hero-location"><MapPin size={13} aria-hidden="true" /> Surat, Gujarat</span>
            </p>
            <h1>Find the right cooler for your space.</h1>
            <p className="hero-description">
              Explore the Trimurti cooler range and send a direct product enquiry on WhatsApp.
            </p>
            <div className="hero-actions">
              <Link className="button" href="#catalogue">
                Explore products <ArrowRight size={18} />
              </Link>
              <WhatsAppLink className="button button-secondary" label="Ask on WhatsApp" />
            </div>
            <ScrollToExplore />
          </div>

          <div className="hero-product">
            <div className="hero-orbit orbit-one" aria-hidden="true" />
            <div className="hero-orbit orbit-two" aria-hidden="true" />
            <CoolerVisual visualId="home-hero" tone="ocean" />
            <div className="hero-note note-top">
              <span className="note-dot" />
              <p><strong>Made for Indian spaces</strong>Product range preview</p>
            </div>
            <div className="hero-note note-bottom">
              <MapPin size={18} />
              <p><strong>Based in Surat</strong>Gujarat, India</p>
            </div>
          </div>
        </div>
        <div className="hero-ruler" aria-hidden="true">
          {Array.from({ length: 15 }).map((_, index) => <span key={index} />)}
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="container about-grid">
          <div>
            <p className="eyebrow">About Trimurti</p>
            <h2>Cooling choices, made clear.</h2>
          </div>
          <div className="about-copy">
            <p>
              Trimurti Coolers is based in Surat, Gujarat. This website is being prepared as a clear catalogue for exploring cooler categories and starting a direct enquiry.
            </p>
            <p>
              Product names, specifications and company details will be published only after they are verified.
            </p>
          </div>
          <div className="about-facts">
            <article><MapPin size={20} /><span>Location</span><strong>Surat, Gujarat</strong></article>
            <article><Search size={20} /><span>Catalogue</span><strong>Simple product search</strong></article>
            <article><Check size={20} /><span>Enquiries</span><strong>Direct on WhatsApp</strong></article>
          </div>
        </div>
      </section>

      <section className="section catalogue-section" id="catalogue">
        <div className="container">
          <SectionHeading
            eyebrow="Product range"
            title={<>Explore cooler <em>categories.</em></>}
            description="Browse the initial range below. Accurate models and specifications can be added as soon as the final catalogue is available."
          />
          <CatalogueExplorer />
        </div>
      </section>

      <section className="catalogue-method" aria-labelledby="method-title">
        <div className="container method-grid">
          <div className="method-intro">
            <p className="eyebrow light">A clearer catalogue</p>
            <h2 id="method-title">Only the details that help you decide.</h2>
            <p>Find a category, compare verified information and continue the conversation directly on WhatsApp.</p>
          </div>
          <ol className="method-list">
            <li><span>01</span><div><Search size={22} /><h3>Find</h3><p>Search by product name, type or intended space.</p></div></li>
            <li><span>02</span><div><Check size={22} /><h3>Compare</h3><p>Review product information in one consistent format.</p></div></li>
            <li><span>03</span><div><ArrowRight size={22} /><h3>Enquire</h3><p>Send the selected product with your WhatsApp enquiry.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="section guide-section" id="guide">
        <div className="container guide-layout">
          <SectionHeading
            eyebrow="How to choose"
            title={<>Four useful things <em>to check.</em></>}
            description="A practical starting point for comparing cooler models when verified specifications become available."
          />
          <div className="selection-list">
            {selectionPoints.map((point) => {
              const Icon = point.icon;
              return (
                <article key={point.number} className="selection-item">
                  <span className="selection-number">{point.number}</span>
                  <span className="selection-icon"><Icon size={21} /></span>
                  <h3>{point.title}</h3>
                  <p>{point.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <GoogleReviews />
    </>
  );
}
