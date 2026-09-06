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
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${safeMeasurementId});`}
      </Script>
    </>
  );
}
