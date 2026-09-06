"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
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
  return (
    <section
      className="section reviews-section"
      id="reviews"
      aria-labelledby="reviews-heading"
    >
      <div className="container">
        <div className="reviews-heading-row">
          <div>
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

        <div className="reviews-marquee" tabIndex={0} aria-label="Automatically moving customer reviews">
          <div className="reviews-marquee-track">
            {[...curatedReviews, ...curatedReviews].map((review, index) => (
              <article className="review-card" key={`${review.id}-${index}`}>
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
              </article>
            ))}
          </div>
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
  const [reviewIndex, setReviewIndex] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

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

  useEffect(() => {
    const reviewCount = summary?.reviews.length || 0;
    if (state !== "ready" || isCarouselPaused || reviewCount < 2) return;
    const timer = window.setInterval(() => {
      setReviewIndex((current) => (current + 1) % reviewCount);
    }, 5600);
    return () => window.clearInterval(timer);
  }, [isCarouselPaused, state, summary?.reviews.length]);

  if (state === "empty" || state === "error") return <CuratedReviews />;

  return (
    <section
      className="section reviews-section"
      id="reviews"
      aria-labelledby="reviews-heading"
    >
      <div className="container">
        <div className="reviews-heading-row">
          <div>
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
          <div
            className="reviews-carousel-wrap"
            onMouseEnter={() => setIsCarouselPaused(true)}
            onMouseLeave={() => setIsCarouselPaused(false)}
            onFocus={() => setIsCarouselPaused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setIsCarouselPaused(false);
              }
            }}
          >
            <div className="reviews-grid" aria-live="polite">
              {Array.from({ length: Math.min(3, summary.reviews.length) }, (_, offset) =>
                summary.reviews[(reviewIndex + offset) % summary.reviews.length],
              ).map((review) => (
                <article className="review-card review-card-enter" key={`${review.id}-${reviewIndex}`}>
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
                        <span aria-hidden="true">{review.authorName.charAt(0)}</span>
                      )}
                      <div>
                        {review.authorUrl ? (
                          <a href={review.authorUrl} target="_blank" rel="noreferrer">
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
                  <p>{review.text || "This reviewer left a star rating on Google."}</p>
                </article>
              ))}
            </div>
            {summary.reviews.length > 1 && (
              <div className="reviews-carousel-controls" aria-label="Review carousel controls">
                <div>
                  <button
                    type="button"
                    onClick={() => setReviewIndex((current) => (current - 1 + summary.reviews.length) % summary.reviews.length)}
                    aria-label="Previous reviews"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewIndex((current) => (current + 1) % summary.reviews.length)}
                    aria-label="Next reviews"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
