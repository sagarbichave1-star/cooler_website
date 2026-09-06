import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SmoothAnchorLinks } from "@/components/smooth-anchor-links";
import { PublicChrome } from "@/components/public-chrome";
import { PrivacyProvider } from "@/components/privacy-controls";
import { ConsentAwareGoogleAnalytics } from "@/components/google-analytics";
import { siteConfig } from "@/config/site";
import "./globals.css";
import "./admin-ui.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Trimurti Coolers Surat | Authorised Novamax Distributor",
    template: "%s | Trimurti Coolers",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: siteConfig.name,
    title: "Trimurti Coolers | Novamax Air Coolers in Surat",
    description: siteConfig.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trimurti Coolers | Novamax Air Coolers in Surat",
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
    "@type": "Store",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    telephone: siteConfig.phone,
    areaServed: { "@type": "City", name: "Surat" },
    address: {
      "@type": "PostalAddress",
      streetAddress: "5 Sonal Industrial, GHB Road, near Comet Motors",
      addressLocality: "Surat",
      addressRegion: "Gujarat",
      postalCode: "394210",
      addressCountry: "IN",
    },
  };

  return (
    <html lang="en">
      <body>
        {/* No Google request occurs here: this creates the deny-by-default queue
            before any optional Google tag can load. */}
        <Script id="google-consent-default" strategy="beforeInteractive">
          {`window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
window.gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});`}
        </Script>
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
          <ConsentAwareGoogleAnalytics />
        </PrivacyProvider>
      </body>
    </html>
  );
}
