"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { GoogleReviewSummary } from "@/lib/google-reviews";

type ReviewResponse = {
  configured: boolean;
  data?: GoogleReviewSummary;
  message?: string;
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="review-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} size={15} fill={index < Math.round(rating) ? "currentColor" : "none"} />
      ))}
    </span>
  );
}

export function GoogleReviews() {
  const [state, setState] = useState<"loading" | "ready" | "empty" | "error">("loading");
  const [summary, setSummary] = useState<GoogleReviewSummary | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadReviews() {
      try {
        const response = await fetch("/api/google-reviews", { signal: controller.signal });
        const payload = await response.json() as ReviewResponse;
        if (!response.ok || !payload.data) {
          setState(payload.configured ? "error" : "empty");
          return;
        }
        setSummary(payload.data);
        setState(payload.data.reviews.length ? "ready" : "empty");
      } catch (error) {
        if ((error as Error).name !== "AbortError") setState("error");
      }
    }

    loadReviews();
    return () => controller.abort();
  }, []);

  const sourceUrl = summary?.sourceUrl || siteConfig.mapUrl;

  return (
    <section className="section reviews-section" id="reviews" aria-labelledby="reviews-heading">
      <div className="container">
        <div className="reviews-heading-row">
          <div>
            <p className="eyebrow">Google reviews</p>
            <h2 id="reviews-heading">What customers say.</h2>
          </div>
          {summary && (
            <div className="review-summary" aria-label={`${summary.rating} out of 5 from ${summary.totalReviews} Google reviews`}>
              <strong>{summary.rating.toFixed(1)}</strong>
              <div><Stars rating={summary.rating} /><span>{summary.totalReviews} Google reviews</span></div>
            </div>
          )}
        </div>

        {state === "loading" && (
          <div className="reviews-grid" aria-label="Loading Google reviews" aria-busy="true">
            {Array.from({ length: 3 }, (_, index) => <div className="review-skeleton skeleton" key={index} />)}
          </div>
        )}

        {state === "ready" && summary && (
          <div className="reviews-grid">
            {summary.reviews.slice(0, 3).map((review) => (
              <article className="review-card" key={review.id}>
                <div className="review-card-top">
                  <div className="review-author">
                    {review.authorPhotoUrl ? (
                      // Google review avatars are dynamic third-party URLs and cannot use a fixed Next Image host allowlist.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={review.authorPhotoUrl} alt="" width="42" height="42" referrerPolicy="no-referrer" />
                    ) : <span aria-hidden="true">{review.authorName.charAt(0)}</span>}
                    <div>
                      {review.authorUrl ? <a href={review.authorUrl} target="_blank" rel="noreferrer">{review.authorName}</a> : <strong>{review.authorName}</strong>}
                      <small>{review.relativeDate}</small>
                    </div>
                  </div>
                  <Stars rating={review.rating} />
                </div>
                <p>{review.text || "This reviewer left a star rating on Google."}</p>
                <a className="review-source" href={review.sourceUrl || sourceUrl} target="_blank" rel="noreferrer">View on Google Maps <ArrowUpRight size={14} /></a>
              </article>
            ))}
          </div>
        )}

        {(state === "empty" || state === "error") && (
          <div className="reviews-placeholder">
            <div>
              <p className="eyebrow">Live connection pending</p>
              <h3>{state === "error" ? "Reviews are temporarily unavailable." : "Google reviews will appear here."}</h3>
              <p>The layout is ready. Verified reviews will load automatically after the Google Place ID and API credentials are added.</p>
            </div>
            <a className="button button-secondary" href={siteConfig.mapUrl} target="_blank" rel="noreferrer">Open Google Maps <ArrowUpRight size={17} /></a>
          </div>
        )}

        <p className="reviews-note">Reviews shown are selected by Google and ordered by relevance.</p>
      </div>
    </section>
  );
}
