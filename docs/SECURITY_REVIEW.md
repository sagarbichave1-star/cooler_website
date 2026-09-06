# Security review

Reviewed on 2026-09-06. This is an application review, not a penetration test or a guarantee against denial of service.

## Blocking

No unresolved blocking issue was found in the reviewed local code.

The previously reported critical Vitest advisory was resolved by upgrading to 4.1.11. `npm audit` reports zero known vulnerabilities.

## Should fix before production

- Replace the in-memory request buckets with a shared limiter or hosting firewall rule. Current limits reset per process and do not protect multiple instances from DDoS traffic.
- Restrict MongoDB network access, use a least-privilege database user, require TLS, rotate credentials, and keep `MONGODB_URI` server-only.
- Add account recovery or an operational key-rotation procedure. The current one-role access-key design has no username, MFA, or recovery flow by requirement.
- Add persistent session revocation if immediate logout of copied session tokens is required. Current signed sessions expire after four hours or when secrets rotate.
- Add upload type, size and content validation before product images are accepted. The current editor stores only validated HTTPS URL text and does not fetch it server-side.
- Add retention, deletion and access rules before enquiry persistence is enabled.

## Reviewed controls

- Product write and delete routes validate the signed admin cookie on the server before reading or changing data.
- Product input has bounded lengths, fixed publication types, safe slugs, HTTPS-only image URLs and capped feature/specification arrays.
- MongoDB applies JSON Schema validation, a unique slug index and a public catalogue index.
- Form bodies are limited to 16 KB, time out after 10 seconds, require the configured same origin, and use exact JSON content types.
- Validation regular expressions operate on bounded strings and contain no nested ambiguous repetition. No evident ReDoS path was found.
- API and admin responses are not stored by the service worker. Admin pages are noindex and deny framing.
- Secrets are server-only and `.env` is ignored by Git. The local admin secrets were rotated after one appeared in conversation context.
- No `eval`, command execution, Supabase code, or user-controlled HTML rendering is present.

## Verification

Run `npm run lint`, `npm test`, `npm run build`, and `npm audit` before release. Repeat this review when enquiry persistence, uploads, a shared rate limiter, or a new authentication model is added.
