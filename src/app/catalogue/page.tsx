import type { Metadata } from "next";
import Link from "next/link";
import { CatalogueExplorer } from "@/components/catalogue-explorer";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Cooler Catalogue",
  description: "Browse the Tirupati Coolers catalogue by product type and intended space.",
  alternates: { canonical: "/catalogue" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "Cooler Catalogue | Tirupati Coolers",
    description: "Browse the Tirupati Coolers catalogue by product type and intended space.",
    url: "/catalogue",
    images: ["/opengraph-image"],
  },
};

export default function CataloguePage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Catalogue", item: `${siteConfig.url}/catalogue` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <section className="page-hero catalogue-hero">
        <div className="container">
          <nav className="breadcrumbs page-breadcrumbs" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li aria-current="page">Catalogue</li>
            </ol>
          </nav>
          <div className="page-hero-grid">
            <div>
              <p className="eyebrow">Product catalogue</p>
              <h1>Cooling options, clearly organised.</h1>
            </div>
            <div className="page-hero-aside">
              <span>Preview catalogue</span>
              <p>Final models and verified specifications will be added when the product information is ready.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="catalogue-section">
        <div className="container">
          <CatalogueExplorer />
        </div>
      </section>
    </>
  );
}
