"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { GoogleReviewSummary } from "@/lib/google-reviews";
import { usePrivacy } from "./privacy-controls";

type ReviewResponse = {
  configured: boolean;
  data?: GoogleReviewSummary;
  message?: string;
};

type CuratedReview = {
  id: string;
  author: string;
  relativeDate: string;
  text: string;
};

// Temporary no-billing fallback. These are concise paraphrases of selected
// five-star comments observed on the verified Google listing on 2026-09-06.
const curatedReviews: CuratedReview[] = [
  {
    id: "dhanashri-kakade",
    author: "Dhanashri Kakade",
    relativeDate: "3 years ago",
    text: "Great product quality and good customer service.",
  },
  {
    id: "jaspreet-singh",
    author: "Jaspreet Singh",
    relativeDate: "3 years ago",
    text: "The team understood the need and suggested the right cooler.",
  },
  {
    id: "ankita-rathod",
    author: "Ankita Rathod",
    relativeDate: "3 years ago",
    text: "Amazing cooler design, comfortable airflow and wonderful service.",
  },
  {
    id: "surbhi-agarwal",
    author: "Surbhi Agarwal",
    relativeDate: "3 years ago",
    text: "Good quality, compact design and cool colours.",
  },
  {
    id: "madhushree-kakade",
    author: "Madhushree Kakade",
    relativeDate: "3 years ago",
    text: "Amazing product with great quality and customer service.",
  },
  {
    id: "amol-khatri",
    author: "Amol Khatri",
    relativeDate: "2 years ago",
    text: "A fine range of coolers and ACs with good customer service.",
  },
  {
    id: "kanchan-khatri",
    author: "Kanchan Khatri",
    relativeDate: "3 years ago",
    text: "Nice service and a quality cooler.",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="review-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={15}
          fill={index < Math.round(rating) ? "currentColor" : "none"}
        />
      ))}
    </span>
  );
}

function CuratedReviews() {
  const [reviewIndex, setReviewIndex] = useState(0);
  const visibleReviews = Array.from({ length: 3 }, (_, offset) =>
    curatedReviews[(reviewIndex + offset) % curatedReviews.length],
  );

  function moveReviews(direction: -1 | 1) {
    setReviewIndex(
      (current) =>
        (current + direction + curatedReviews.length) % curatedReviews.length,
    );
  }

  return (
    <section
      className="section reviews-section"
      id="reviews"
      aria-labelledby="reviews-heading"
    >
      <div className="container">
        <div className="reviews-heading-row">
          <div>
            <p className="eyebrow">Selected Google feedback</p>
            <h2 id="reviews-heading">What customers say.</h2>
          </div>
          <div
            className="review-summary"
            aria-label="5.0 out of 5 from 50 Google reviews"
          >
            <strong>5.0</strong>
            <div>
              <Stars rating={5} />
              <span>50 Google reviews</span>
            </div>
          </div>
        </div>

        <div className="reviews-carousel-wrap">
          <div className="reviews-grid" aria-live="polite">
            {visibleReviews.map((review) => (
              <article className="review-card" key={review.id}>
                <div className="review-card-top">
                  <div className="review-author">
                    <span aria-hidden="true">{review.author.charAt(0)}</span>
                    <div>
                      <strong>{review.author}</strong>
                      <small>{review.relativeDate}</small>
                    </div>
                  </div>
                  <Stars rating={5} />
                </div>
                <p>{review.text}</p>
                <a
                  className="review-source"
                  href={siteConfig.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on Google Maps <ArrowUpRight size={14} />
                </a>
              </article>
            ))}
          </div>
          <div
            className="reviews-carousel-controls"
            aria-label="Review carousel controls"
          >
            <span>7 selected summaries</span>
            <div>
              <button
                type="button"
                onClick={() => moveReviews(-1)}
                aria-label="Previous reviews"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => moveReviews(1)}
                aria-label="Next reviews"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="reviews-placeholder reviews-source-note">
          <div>
            <h3>See all 50 reviews on Google.</h3>
            <p>
              These selected summaries are a temporary presentation while the
              server-side Google Places connection is being configured.
            </p>
          </div>
          <a
            className="button button-secondary"
            href={siteConfig.mapUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open Google Maps <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}

export function GoogleReviews() {
  const { external } = usePrivacy();
  if (!external) return <CuratedReviews />;
  return <EnabledGoogleReviews />;
}

function EnabledGoogleReviews() {
  const [state, setState] = useState<"loading" | "ready" | "empty" | "error">(
    "loading",
  );
  const [summary, setSummary] = useState<GoogleReviewSummary | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadReviews() {
      try {
        const response = await fetch("/api/google-reviews", {
          signal: controller.signal,
        });
        const payload = (await response.json()) as ReviewResponse;
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

  if (state === "empty" || state === "error") return <CuratedReviews />;

  const sourceUrl = summary?.sourceUrl || siteConfig.mapUrl;

  return (
    <section
      className="section reviews-section"
      id="reviews"
      aria-labelledby="reviews-heading"
    >
      <div className="container">
        <div className="reviews-heading-row">
          <div>
            <p className="eyebrow">Google reviews</p>
            <h2 id="reviews-heading">What customers say.</h2>
          </div>
          {summary && (
            <div
              className="review-summary"
              aria-label={`${summary.rating} out of 5 from ${summary.totalReviews} Google reviews`}
            >
              <strong>{summary.rating.toFixed(1)}</strong>
              <div>
                <Stars rating={summary.rating} />
                <span>{summary.totalReviews} Google reviews</span>
              </div>
            </div>
          )}
        </div>

        {state === "loading" && (
          <div
            className="reviews-grid"
            aria-label="Loading Google reviews"
            aria-busy="true"
          >
            {Array.from({ length: 3 }, (_, index) => (
              <div className="review-skeleton skeleton" key={index} />
            ))}
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
                      <img
                        src={review.authorPhotoUrl}
                        alt=""
                        width="42"
                        height="42"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span aria-hidden="true">
                        {review.authorName.charAt(0)}
                      </span>
                    )}
                    <div>
                      {review.authorUrl ? (
                        <a
                          href={review.authorUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {review.authorName}
                        </a>
                      ) : (
                        <strong>{review.authorName}</strong>
                      )}
                      <small>{review.relativeDate}</small>
                    </div>
                  </div>
                  <Stars rating={review.rating} />
                </div>
                <p>
                  {review.text || "This reviewer left a star rating on Google."}
                </p>
                <a
                  className="review-source"
                  href={review.sourceUrl || sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on Google Maps <ArrowUpRight size={14} />
                </a>
              </article>
            ))}
          </div>
        )}

        <p className="reviews-note">
          Live reviews will replace this temporary selection once Google Places
          credentials are enabled on the client server.
        </p>
      </div>
    </section>
  );
}
