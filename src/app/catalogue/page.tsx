import type { Metadata } from "next";
import { CatalogueExplorer } from "@/components/catalogue-explorer";

export const metadata: Metadata = {
  title: "Cooler Catalogue",
  description: "Browse the Tirupati Coolers catalogue by product type and intended space.",
  alternates: { canonical: "/catalogue" },
};

export default function CataloguePage() {
  return (
    <>
      <section className="page-hero catalogue-hero">
        <div className="container page-hero-grid">
          <div>
            <p className="eyebrow">Product catalogue</p>
            <h1>Cooling options, clearly organised.</h1>
          </div>
          <div className="page-hero-aside">
            <span>Preview catalogue</span>
            <p>Final models and verified specifications will be added when the product information is ready.</p>
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
