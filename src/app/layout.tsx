import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SmoothAnchorLinks } from "@/components/smooth-anchor-links";
import { PublicChrome } from "@/components/public-chrome";
import { PrivacyProvider } from "@/components/privacy-controls";
import { siteConfig } from "@/config/site";
import "./globals.css";
import "./admin-ui.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Trimurti Coolers Surat | Explore Air Coolers",
    template: "%s | Trimurti Coolers",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: siteConfig.name,
    title: "Trimurti Coolers",
    description: siteConfig.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trimurti Coolers",
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#f4fbfc",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    url: siteConfig.url,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Surat",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
  };

  return (
    <html lang="en">
      <body>
        <PrivacyProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationJsonLd).replace(
                /</g,
                "\\u003c",
              ),
            }}
          />
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <PublicChrome>
            <SiteHeader />
          </PublicChrome>
          <main id="main-content">{children}</main>
          <PublicChrome>
            <SiteFooter />
            <ScrollToTop />
            <FloatingWhatsApp />
          </PublicChrome>
          <SmoothAnchorLinks />
          <ServiceWorkerRegistration />
        </PrivacyProvider>
      </body>
    </html>
  );
}
