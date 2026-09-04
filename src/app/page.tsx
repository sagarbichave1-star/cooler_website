import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Droplets,
  Gauge,
  MapPin,
  Maximize2,
  MessageCircle,
  Search,
  Waves,
  Zap,
} from "lucide-react";
import { CoolerVisual } from "@/components/cooler-visual";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { products } from "@/data/products";

const selectionPoints = [
  {
    number: "01",
    icon: Maximize2,
    title: "Measure the space",
    text: "Start with where the cooler will be used and how much open space is available.",
  },
  {
    number: "02",
    icon: Droplets,
    title: "Check the water tank",
    text: "Compare tank capacity with how often you would prefer to refill it.",
  },
  {
    number: "03",
    icon: Gauge,
    title: "Review air delivery",
    text: "Use verified air-delivery details when the final product specifications are available.",
  },
  {
    number: "04",
    icon: Zap,
    title: "Compare power needs",
    text: "Check the rated consumption and compatibility before making a decision.",
  },
];

export default function HomePage() {
  const featuredProducts = products.filter((product) => product.featured);

  return (
    <>
      <section className="hero">
        <div className="hero-watermark" aria-hidden="true">COOL</div>
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="hero-eyebrow">
              <span className="hero-eyebrow-mark" aria-hidden="true"><Waves size={15} /></span>
              <span className="hero-eyebrow-name">Tirupati Coolers</span>
              <span className="hero-eyebrow-divider" aria-hidden="true" />
              <span className="hero-location"><MapPin size={13} aria-hidden="true" /> Surat, Gujarat</span>
            </p>
            <h1>Find the right cooler for your space.</h1>
            <p className="hero-description">
              Explore a clear, easy-to-use catalogue and send your product enquiry directly on WhatsApp.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/catalogue">
                Browse catalogue <ArrowRight size={18} />
              </Link>
              <WhatsAppLink className="button button-secondary" label="Ask on WhatsApp" />
            </div>
            <a className="scroll-cue" href="#featured">
              <span><ArrowDown size={16} /></span>
              Scroll to explore
            </a>
          </div>

          <div className="hero-product">
            <div className="hero-orbit orbit-one" aria-hidden="true" />
            <div className="hero-orbit orbit-two" aria-hidden="true" />
            <CoolerVisual visualId="home-hero" tone="ocean" />
            <div className="hero-note note-top">
              <span className="note-dot" />
              <p><strong>Catalogue preview</strong>Details are being finalized</p>
            </div>
            <div className="hero-note note-bottom">
              <MessageCircle size={18} />
              <p><strong>Direct enquiry</strong>Continue on WhatsApp</p>
            </div>
          </div>
        </div>
        <div className="hero-ruler" aria-hidden="true">
          {Array.from({ length: 15 }).map((_, index) => <span key={index} />)}
        </div>
      </section>

      <section className="section featured-section" id="featured">
        <div className="container">
          <div className="section-header-row">
            <SectionHeading
              eyebrow="Catalogue preview"
              title={<>A cooler for every <em>kind of space.</em></>}
              description="Browse the initial product categories. Final models and verified specifications can be added without changing the design."
            />
            <Link className="text-link view-all-link" href="/catalogue">
              View full catalogue <ArrowRight size={18} />
            </Link>
          </div>
          <div className="product-grid home-product-grid">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.slug} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="catalogue-method">
        <div className="container method-grid">
          <div className="method-intro">
            <p className="eyebrow light">A clearer catalogue</p>
            <h2>Only the details that help you decide.</h2>
            <p>
              Every product page is prepared for verified specifications, straightforward comparisons, and a direct way to ask questions.
            </p>
            <Link className="button button-light" href="/catalogue">
              Explore products <ArrowRight size={18} />
            </Link>
          </div>
          <ol className="method-list">
            <li>
              <span>01</span>
              <div><Search size={22} /><h3>Find</h3><p>Search by product name, type, or intended space.</p></div>
            </li>
            <li>
              <span>02</span>
              <div><Check size={22} /><h3>Compare</h3><p>Review available product information in a consistent format.</p></div>
            </li>
            <li>
              <span>03</span>
              <div><MessageCircle size={22} /><h3>Enquire</h3><p>Send the exact product page with your WhatsApp enquiry.</p></div>
            </li>
          </ol>
        </div>
      </section>

      <section className="section guide-section" id="guide">
        <div className="container">
          <SectionHeading
            eyebrow="Before you choose"
            title={<>Four useful things <em>to check.</em></>}
            description="A simple starting point for comparing products once the final catalogue information is available."
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

      <section className="section final-cta-section">
        <div className="container final-cta">
          <div className="final-cta-wave" aria-hidden="true">
            <svg viewBox="0 0 480 190" preserveAspectRatio="none">
              <path d="M-10 101c64-71 115 69 178 0s114 69 177 0 105 52 151 2" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M-10 131c64-71 115 69 178 0s114 69 177 0 105 52 151 2" fill="none" stroke="currentColor" strokeWidth="2" opacity=".4" />
            </svg>
          </div>
          <div>
            <p className="eyebrow">Start exploring</p>
            <h2>The catalogue is ready for a closer look.</h2>
          </div>
          <Link className="circle-link" href="/catalogue" aria-label="Open the catalogue">
            <ArrowRight size={28} />
          </Link>
        </div>
      </section>
    </>
  );
}
