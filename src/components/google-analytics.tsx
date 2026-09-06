"use client";

import Script from "next/script";
import { usePrivacy } from "@/components/privacy-controls";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function ConsentAwareGoogleAnalytics() {
  const { external } = usePrivacy();

  if (!external || !measurementId) return null;
  const safeMeasurementId = JSON.stringify(measurementId);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
window.gtag('consent', 'update', {
  analytics_storage: 'granted',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied'
});
window.gtag('js', new Date());
window.gtag('config', ${safeMeasurementId});`}
      </Script>
    </>
  );
}
