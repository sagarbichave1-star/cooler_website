import { normalizeGooglePlaceReviews } from "@/lib/google-reviews";
import { privateReply, RequestError, throttle } from "@/lib/request-guards";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  const placeId = process.env.GOOGLE_PLACE_ID?.trim();

  if (!apiKey || !placeId)
    return privateReply({ configured: false }, 503);

  try {
    // A local cost ceiling, not a replacement for provider quotas or edge limits.
    throttle("google-reviews", 30, 60000);
    const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
      redirect: "error",
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews,googleMapsUri",
      },
    });

    if (!response.ok) throw new Error("Places request failed.");
    return privateReply({ configured: true, data: normalizeGooglePlaceReviews(await response.json()) });
  } catch (error) {
    return privateReply({ configured: true, message: "Google reviews are temporarily unavailable." },
      error instanceof RequestError ? error.status : 502,
      error instanceof RequestError ? error.retryAfter : undefined);
  }
}
