import Link from "next/link";
import {
  ArrowRight,
  Droplets,
  Gauge,
  MapPin,
  Maximize2,
  Waves,
  Zap,
} from "lucide-react";
import { CatalogueExplorer } from "@/components/catalogue-explorer";
import { GoogleReviews } from "@/components/google-reviews";
import { HeroProductRotator } from "@/components/hero-product-rotator";
import { SectionHeading } from "@/components/section-heading";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { products } from "@/data/products";

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

const faqItems = [
  {
    question: "Is Trimurti Coolers an authorised Novamax distributor?",
    answer:
      "Yes. Trimurti Coolers is an authorised Novamax distributor in Surat. Ask us on WhatsApp about the model that suits your space.",
  },
  {
    question: "Can I see air-cooler specifications before I enquire?",
    answer:
      "Yes. Open any product in the catalogue to review the available capacity, power, dimensions and feature information before starting your WhatsApp enquiry.",
  },
  {
    question: "Do you publish product prices on the website?",
    answer:
      "No. Availability and quotations are handled directly on WhatsApp so you can receive the right recommendation for your requirement.",
  },
];

const heroProductSlugs = [
  "gloster-150",
  "rambo-150",
  "rambo-jr-100",
  "dominator",
  "apex",
];
const heroProducts = heroProductSlugs.flatMap((slug) => {
  const product = products.find((item) => item.slug === slug);
  return product ? [product] : [];
});

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
              <span className="hero-location"><MapPin size={13} aria-hidden="true" /> Authorised Novamax distributor · Surat</span>
            </p>
            <h1>Novamax air coolers, clearly specified.</h1>
            <p className="hero-description">
              Trimurti Coolers presents the Novamax range with the product
              information that matters: capacity, airflow, dimensions and the
              right context for every space.
            </p>
            <div className="hero-actions">
              <Link className="button" href="#catalogue">
                Explore products <ArrowRight size={18} />
              </Link>
              <WhatsAppLink className="button button-secondary" label="Ask on WhatsApp" />
            </div>
          </div>

          <div className="hero-product">
            <HeroProductRotator products={heroProducts} />
          </div>
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="container about-grid">
          <div>
            <p className="eyebrow">About Trimurti Coolers</p>
            <h2>A straightforward way to choose well.</h2>
          </div>
          <div className="about-copy">
            <p>
              Choosing an air cooler is about more than one number on a
              specification sheet. The room, ventilation, refill routine and
              intended use all shape the right choice.
            </p>
            <p>
              As Surat&apos;s authorised Novamax distributor, Trimurti Coolers
              starts with that context. This site makes the range easier to
              understand, then keeps the next conversation direct and useful
              on WhatsApp.
            </p>
          </div>
        </div>
      </section>

      <section className="section catalogue-section" id="catalogue">
        <div className="container">
          <div className="catalogue-intro">
            <SectionHeading
              eyebrow="Product range"
              title={<>The Novamax range, <em>organised around your space.</em></>}
              description="Every model is presented with its available specifications. Filter the range, compare what matters and continue the conversation on WhatsApp when you are ready."
            />
            <aside className="range-guide" aria-labelledby="range-guide-heading">
              <p className="eyebrow">How to assess a cooler</p>
              <h2 id="range-guide-heading">Four practical checks.</h2>
              <ol>
                {selectionPoints.map((point) => {
                  const Icon = point.icon;
                  return (
                    <li key={point.number}>
                      <span>{point.number}</span>
                      <Icon size={18} aria-hidden="true" />
                      <div>
                        <h3>{point.title}</h3>
                        <p>{point.text}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </aside>
          </div>
          <CatalogueExplorer />
        </div>
      </section>

      <section className="section faq-section" id="faq" aria-labelledby="faq-heading">
        <div className="container faq-layout">
          <SectionHeading
            eyebrow="Useful answers"
            title={<>A few things, <em>made clear.</em></>}
            description="Direct answers about the Novamax range, product details and how Trimurti Coolers handles enquiries."
          />
          <div className="faq-list">
            {faqItems.map((item) => (
              <details key={item.question} className="faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <GoogleReviews />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          }).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
