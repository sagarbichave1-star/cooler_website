import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
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

// Self-hosted at build time: no font request reaches Google from visitors.
const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  // Metadata uses the same canonical host as robots and sitemap. Do not set a
  // second URL here: search engines need one unambiguous public origin.
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Trimurti Coolers Surat | Authorised Novamax Distributor",
    template: "%s | Trimurti Coolers",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "air cooler Surat",
    "cooler shop Surat",
    "Novamax cooler Surat",
    "Novamax distributor Surat",
    "desert cooler Surat",
    "tower cooler Surat",
    "cooler service Surat",
    "doors and windows Surat",
    "Trimurti Coolers",
  ],
  creator: "Nyomik Tech Studios, LLP",
  publisher: siteConfig.name,
  category: "Home appliances",
  other: {
    // Local search signals for Surat, matching the Google Business Profile.
    "geo.region": "IN-GJ",
    "geo.placename": "Surat",
    "geo.position": "21.1511821;72.8352649",
    ICBM: "21.1511821, 72.8352649",
  },
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
    // This is business identity schema, not a product feed. Keep the physical
    // address, phone and service claims aligned with the Google Business Profile.
    "@context": "https://schema.org",
    "@type": ["Store", "HomeAndConstructionBusiness"],
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.name,
    alternateName: ["Trimurti Enterprise", "Trimurti Coolers Surat"],
    url: siteConfig.url,
    image: `${siteConfig.url}/opengraph-image`,
    hasMap: siteConfig.mapUrl,
    sameAs: [siteConfig.mapUrl, "https://www.instagram.com/trimurti_coolers/"],
    geo: { "@type": "GeoCoordinates", latitude: 21.1511821, longitude: 72.8352649 },
    knowsAbout: ["Air coolers", "Novamax coolers", "Cooler service and spare parts", "Doors and windows"],
    description: siteConfig.description,
    telephone: siteConfig.phone,
    areaServed: [
      { "@type": "City", name: "Surat" },
      { "@type": "AdministrativeArea", name: "Surat district, Gujarat" },
    ],
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
    <html lang="en" className={sans.variable}>
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
