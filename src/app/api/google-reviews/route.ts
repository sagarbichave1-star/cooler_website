import { normalizeGooglePlaceReviews } from "@/lib/google-reviews";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  const placeId = process.env.GOOGLE_PLACE_ID?.trim();

  if (!apiKey || !placeId) {
    return Response.json(
      { configured: false, message: "Google reviews are not configured yet." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      cache: "no-store",
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews,googleMapsUri",
      },
    });

    if (!response.ok) {
      return Response.json(
        { configured: true, message: "Google reviews are temporarily unavailable." },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    const payload = await response.json();
    return Response.json(
      { configured: true, data: normalizeGooglePlaceReviews(payload) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { configured: true, message: "Google reviews are temporarily unavailable." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
