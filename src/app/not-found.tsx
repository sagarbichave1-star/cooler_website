import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The requested Trimurti Coolers page could not be found.",
  alternates: {},
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="not-found-page">
      <div className="not-found-ripple" aria-hidden="true"><span /><span /><span /></div>
      <div className="container not-found-content">
        <p className="error-code">404</p>
        <p className="eyebrow">Page not found</p>
        <h1>This page has drifted out of view.</h1>
        <p>The address may have changed, or the page may no longer be available.</p>
        <div className="not-found-actions">
          <Link className="button" href="/"><ArrowLeft size={18} /> Back home</Link>
        </div>
      </div>
    </section>
  );
}
