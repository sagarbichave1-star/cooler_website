import Link from "next/link";
import {
  ArrowRight,
  Droplets,
  Gauge,
  Maximize2,
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
    question: "Is Trimurti Coolers an authorised Novamax distributor and service provider?",
    answer:
      "Yes. Trimurti Coolers is an authorised Novamax distributor and service provider in Surat. We help customers understand the range, choose a suitable model and receive local support for their Novamax cooler.",
  },
  {
    question: "How should I choose a Novamax cooler for my space?",
    answer:
      "Start with the space, ventilation and intended use. Then compare the model's water-tank capacity, air flow, dimensions and available features. We can help you narrow the range on WhatsApp before you decide.",
  },
  {
    question: "Can I see air-cooler specifications before I enquire?",
    answer:
      "Yes. Open any model in the catalogue to review its available tank capacity, power, dimensions, air flow and feature information before starting a WhatsApp enquiry.",
  },
  {
    question: "What does the coverage-area filter mean?",
    answer:
      "It groups models into published coverage bands: up to 200 sq ft, 200–350 sq ft, 350–500 sq ft and 500 sq ft and above. Models without a verified published coverage figure remain visible when all coverage areas are selected.",
  },
  {
    question: "Can I enquire for a commercial, office or event space?",
    answer:
      "Yes. Tell us the type of space, approximate size and ventilation on WhatsApp. We will help you identify suitable Novamax commercial or personal-range models from the available catalogue.",
  },
  {
    question: "Do you publish product prices on the website?",
    answer:
      "No. Availability and quotations are handled directly on WhatsApp, after we understand the cooling requirement and the model you are considering.",
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
            <h1>Surat&apos;s authorised Novamax distributor &amp; service provider.</h1>
            <p className="hero-description">
              Commercial strength. Personal comfort. Novamax air coolers built
              to take on Surat&apos;s heat—with clear product details, practical
              selection guidance and local service support.
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
            <h2>Novamax range knowledge, close to home.</h2>
          </div>
          <div className="about-copy">
            <p>
              With more than a decade of experience in air-cooler guidance,
              Trimurti Coolers knows the difference a well-matched model can
              make. The right choice starts with the space: its scale,
              ventilation, daily use and refill routine.
            </p>
            <p>
              As an authorised Novamax distributor and service provider in
              Surat, we make the range accessible through clearly presented
              specifications, direct local guidance and support. It is a
              focused extension of the Novamax range—not a generic
              marketplace—with the next conversation kept simple on WhatsApp.
            </p>
          </div>
        </div>
      </section>

      <section className="section catalogue-section" id="catalogue">
        <div className="container">
          <div className="catalogue-intro">
            <SectionHeading
              eyebrow="Product range"
              title={<>The Novamax range, <em>made easier to navigate.</em></>}
              description="Every model is presented with the available product information. Filter by capacity, coverage area and feature, then compare the details that matter for your space."
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
            eyebrow="Helpful guidance"
            title={<>Practical answers, <em>before you enquire.</em></>}
            description="Straightforward guidance on the Novamax range, the information shown here and how Trimurti Coolers can help you choose."
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
