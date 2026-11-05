import { normalizeGooglePlaceReviews, type GoogleReviewSummary } from "@/lib/google-reviews";
import { privateReply, RequestError, throttle } from "@/lib/request-guards";

export const dynamic = "force-dynamic";

const DAY_MS = 86_400_000;
// The last good answer from Google. Reviews refresh once a day; if Google
// fails, visitors keep seeing this copy instead of an empty section.
let lastGood: { data: GoogleReviewSummary; at: number } | null = null;

export function resetReviewCacheForTests() {
  lastGood = null;
}

export async function GET() {
  // Places credentials stay server-only. The client receives a deliberately
  // narrowed, sanitised summary rather than Google’s raw response.
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  const placeId = process.env.GOOGLE_PLACE_ID?.trim();

  if (!apiKey || !placeId)
    return privateReply({ configured: false }, 503);

  if (lastGood && Date.now() - lastGood.at < DAY_MS)
    return privateReply({ configured: true, data: lastGood.data, refreshedAt: new Date(lastGood.at).toISOString() });

  try {
    // A local cost ceiling, not a replacement for provider quotas or edge limits.
    throttle("google-reviews", 30, 60000);
    const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      // Shared daily cache across server instances; a failed refresh keeps
      // serving the previous copy.
      next: { revalidate: DAY_MS / 1000 },
      signal: AbortSignal.timeout(5000),
      redirect: "error",
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews,googleMapsUri",
      },
    });

    if (!response.ok) throw new Error("Places request failed.");
    const data = normalizeGooglePlaceReviews(await response.json());
    lastGood = { data, at: Date.now() };
    return privateReply({ configured: true, data, refreshedAt: new Date(lastGood.at).toISOString() });
  } catch (error) {
    if (lastGood)
      return privateReply({ configured: true, data: lastGood.data, stale: true, refreshedAt: new Date(lastGood.at).toISOString() });
    return privateReply({ configured: true, message: "Google reviews are temporarily unavailable." },
      error instanceof RequestError ? error.status : 502,
      error instanceof RequestError ? error.retryAfter : undefined);
  }
}
