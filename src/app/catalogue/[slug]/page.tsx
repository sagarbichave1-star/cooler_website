import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Info, MapPin } from "lucide-react";
import { CoolerVisual } from "@/components/cooler-visual";
import { ProductCard } from "@/components/product-card";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { siteConfig } from "@/config/site";
import { getProductBySlug, products } from "@/data/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: `/catalogue/${product.slug}` },
    openGraph: {
      title: `${product.name} | Tirupati Coolers`,
      description: product.summary,
      url: `/catalogue/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const productUrl = `${siteConfig.url}/catalogue/${product.slug}`;
  const related = products.filter((item) => item.slug !== product.slug).slice(0, 3);

  return (
    <>
      <section className="product-detail-section">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/catalogue">Catalogue</Link></li>
              <li aria-current="page">{product.name}</li>
            </ol>
          </nav>

          <div className="product-detail-grid">
            <div className="product-detail-visual">
              <span className="visual-label">Catalogue preview</span>
              <CoolerVisual tone={product.tone} />
            </div>
            <div className="product-detail-copy">
              <p className="eyebrow">{product.category} series</p>
              <h1>{product.name}</h1>
              <p className="product-lead">{product.summary}</p>

              <div className="draft-notice">
                <Info size={19} />
                <div>
                  <strong>Product information in progress</strong>
                  <p>Model numbers, images, features, and specifications will appear here after verification.</p>
                </div>
              </div>

              <dl className="product-facts">
                <div><dt>Product type</dt><dd>{product.category} cooler</dd></div>
                <div><dt>Suggested setting</dt><dd>{product.intendedFor}</dd></div>
                <div><dt>Brand location</dt><dd><MapPin size={15} /> {siteConfig.location}</dd></div>
              </dl>

              <div className="product-actions">
                <WhatsAppLink productName={product.name} pageUrl={productUrl} />
                <Link className="button button-secondary" href="/catalogue">
                  Back to catalogue <ArrowLeft size={17} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="specification-section">
        <div className="container specification-grid">
          <div>
            <p className="eyebrow">Product details</p>
            <h2>Specifications will be added here.</h2>
          </div>
          <div className="specification-placeholder">
            <CheckCircle2 size={23} />
            <div>
              <h3>Prepared for verified information</h3>
              <p>The final page will show capacity, power consumption, dimensions, air delivery, features, and other available details.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section related-section">
        <div className="container">
          <div className="section-header-row">
            <div className="section-heading">
              <p className="eyebrow">Continue exploring</p>
              <h2>Other cooler types.</h2>
            </div>
            <Link className="text-link" href="/catalogue">Full catalogue <ArrowRight size={18} /></Link>
          </div>
          <div className="product-grid">
            {related.map((item, index) => <ProductCard key={item.slug} product={item} index={index} />)}
          </div>
        </div>
      </section>
    </>
  );
}
