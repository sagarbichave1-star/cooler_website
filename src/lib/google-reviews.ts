export type GoogleReview = {
  id: string;
  authorName: string;
  authorPhotoUrl?: string;
  authorUrl?: string;
  sourceUrl?: string;
  rating: number;
  text?: string;
  relativeDate: string;
};

export type GoogleReviewSummary = {
  businessName: string;
  rating: number;
  totalReviews: number;
  sourceUrl: string;
  reviews: GoogleReview[];
};

type GoogleText = { text?: unknown };
type GoogleAuthor = { displayName?: unknown; uri?: unknown; photoUri?: unknown };
type GoogleReviewResponse = {
  name?: unknown;
  rating?: unknown;
  text?: GoogleText;
  relativePublishTimeDescription?: unknown;
  googleMapsUri?: unknown;
  authorAttribution?: GoogleAuthor;
};

type GooglePlaceResponse = {
  displayName?: GoogleText;
  rating?: unknown;
  userRatingCount?: unknown;
  googleMapsUri?: unknown;
  reviews?: GoogleReviewResponse[];
};

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function safeRating(value: unknown) {
  return typeof value === "number" && value >= 0 && value <= 5 ? value : 0;
}

function httpsUrl(value: unknown) {
  if (typeof value !== "string" || value.length > 2048) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export function normalizeGooglePlaceReviews(payload: GooglePlaceResponse): GoogleReviewSummary {
  const sourceUrl = httpsUrl(payload.googleMapsUri) || "";
  const reviews = Array.isArray(payload.reviews) ? payload.reviews : [];

  return {
    businessName: optionalString(payload.displayName?.text) || "Tirupati Coolers",
    rating: safeRating(payload.rating),
    totalReviews: typeof payload.userRatingCount === "number" && Number.isSafeInteger(payload.userRatingCount) ? Math.max(0, payload.userRatingCount) : 0,
    sourceUrl,
    reviews: reviews.filter((review) => review && typeof review === "object").slice(0, 5).map((review, index) => ({
      id: optionalString(review.name) || `review-${index}`,
      authorName: optionalString(review.authorAttribution?.displayName) || "Google reviewer",
      authorPhotoUrl: httpsUrl(review.authorAttribution?.photoUri),
      authorUrl: httpsUrl(review.authorAttribution?.uri),
      sourceUrl: httpsUrl(review.googleMapsUri),
      rating: safeRating(review.rating),
      text: optionalString(review.text?.text),
      relativeDate: optionalString(review.relativePublishTimeDescription) || "Published on Google",
    })),
  };
}
