import { InputError } from "./admin-validation";

export class RequestError extends Error {
  constructor(
    public status: number,
    message: string,
    public retryAfter?: number,
  ) {
    super(message);
  }
}

export async function readFormJson(request: Request): Promise<unknown> {
  // Browser-originated state changes are same-origin only. API routes do not
  // accept arbitrary form posts just because they contain valid JSON.
  const origin = request.headers.get("origin");
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL;
  if (!configuredOrigin && process.env.NODE_ENV === "production")
    throw new RequestError(503, "The site origin is not configured.");
  const expected = configuredOrigin || new URL(request.url).origin;
  if (!origin || origin !== new URL(expected).origin)
    throw new RequestError(403, "Request origin rejected.");
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  )
    throw new RequestError(415, "Send JSON form data.");
  // Cap streamed input as well as Content-Length: a sender can omit or forge
  // the header while still attempting to consume server memory.
  const maximumBytes = 16384;
  if (Number(request.headers.get("content-length")) > maximumBytes)
    throw new RequestError(413, "Form data is too large.");
  const reader = request.body?.getReader();
  if (!reader) throw new RequestError(400, "Missing form data.");
  // Fixed allocation also bounds memory for many tiny or empty chunks.
  const body = new Uint8Array(maximumBytes);
  let size = 0;
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    void reader.cancel().catch(() => {});
  }, 10000);
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (timedOut) throw new RequestError(408, "Form upload timed out.");
      if (done) break;
      if (size + value.byteLength > maximumBytes) {
        void reader.cancel().catch(() => {});
        throw new RequestError(413, "Form data is too large.");
      }
      body.set(value, size);
      size += value.byteLength;
    }
  } finally {
    clearTimeout(timeout);
    reader.releaseLock();
  }
  try {
    return JSON.parse(new TextDecoder().decode(body.subarray(0, size)));
  } catch {
    throw new RequestError(400, "Invalid form data.");
  }
}

export function privateReply(data: unknown, status = 200, retryAfter?: number) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      ...(retryAfter ? { "Retry-After": String(retryAfter) } : {}),
    },
  });
}

export function formFailure(error: unknown) {
  if (error instanceof RequestError)
    return privateReply(
      { error: error.message },
      error.status,
      error.retryAfter,
    );
  if (error instanceof InputError)
    return privateReply({ error: error.message }, 400);
  return privateReply(
    { error: "The service is temporarily unavailable. Please try again." },
    503,
  );
}

// Temporary, per-process protection for this UI phase. A shared limiter is required
// before deploying multiple instances or connecting production enquiry storage.
type Bucket =
  "admin-login" | "admin-products" | "contact-preview" | "google-reviews";
const attempts = new Map<Bucket, { count: number; until: number }>();
export function throttle(
  key: Bucket,
  limit: number,
  windowMs = 15 * 60 * 1000,
) {
  const now = Date.now();
  const previous = attempts.get(key);
  const bucket =
    previous && previous.until > now
      ? previous
      : { count: 0, until: now + windowMs };
  bucket.count += 1;
  attempts.set(key, bucket);
  if (bucket.count > limit)
    throw new RequestError(
      429,
      "Too many attempts. Please try again later.",
      Math.ceil((bucket.until - now) / 1000),
    );
}
