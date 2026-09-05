# Admin workspace

The current phase is UI and interaction logic only. MongoDB is the selected database for the next phase; integration is paused by request.

## Routes and access

- `/admin`: one administrator role, access-key sign-in, no username or registration.
- `/api/admin/session`: creates, checks and clears a four-hour session.
- `/api/enquiries`: validates contact input and the honeypot, then returns HTTP 503 until storage is connected. It does not persist personal data or return a false success for a real enquiry.

Create two different random secrets in `.env.local`:

```env
ADMIN_ACCESS_KEY=<random value of at least 32 characters>
ADMIN_SESSION_SECRET=<different random value of at least 32 characters>
```

Generate each value locally with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`.
Never use NEXT_PUBLIC prefixes for these values, commit them, or share screenshots containing them. Restart the dev server after editing the environment. Enter ADMIN_ACCESS_KEY in the login screen. There is no default key or preview bypass. Sign-in remains disabled when configuration is missing.

The access key is compared using constant-time digest comparison. A signed session cookie is HttpOnly, SameSite=Strict and Secure in production. Rotating either secret invalidates existing sessions. Signing out removes the browser cookie; a copied session token remains valid until expiry or secret rotation. A database session registry can add per-session revocation later.

The UI checks expiry on focus and every minute. Any future privileged data endpoint must independently validate the session. Hiding an admin button is not authorization.

## Product preview

The editor supports names, IDs, categories, descriptions, model numbers, capacity, cooling area, dimensions, power and an optional HTTPS image URL. Fields are validated before updating the preview. IDs must be unique. Products can be marked ready to publish, edited or removed after confirmation.

Drafts live in React state only. Refreshing, signing out or session expiry clears them. Nothing is published to the public catalogue. Existing category previews are loaded as editable starting points. Image URLs are captured in drafts; asset upload and rendering are part of the later storage integration.

## Enquiries and privacy

The contact form includes field limits, consent, a hidden `website` honeypot, origin checks, JSON request size limits and a temporary per-process rate limiter. It preserves form data on failure and offers to send the prepared enquiry to +91 9033148505 on WhatsApp. Direct WhatsApp conversations are not automatically visible in the admin inbox.

The inbox intentionally has no sample customer records. The database phase will connect a paginated list, enquiry details and new/contacted/closed status controls.

Cookie settings persist an essential/external preference in local storage for up to 180 days. Google Maps and the reviews component (including external avatars) mount only after external-content consent. Essential-only revokes that display. Cookie settings can be reopened from the footer. No analytics or advertising scripts are installed.

## Hosting and next phase

Use a Next.js server deployment with HTTPS. Set NEXT_PUBLIC_SITE_URL to the actual origin, including scheme and port for local development if specified. Plain static hosting cannot run key verification.

MongoDB has been selected but no database has been provisioned or connected. Next steps:

1. Connect MongoDB through a server-only client with connection pooling. Add product/enquiry repositories with server authorization on every operation. Keep MONGODB_URI out of public environment variables.
2. Connect publishing to the homepage and add upload validation and storage.
3. Add enquiry pagination, detail/status controls and retention/deletion handling.
4. Replace the temporary global, per-process request limiter with a shared rate-limit store and deployment-level throttling. The present limiter resets on restart and is not shared between instances.
5. Add persistent session revocation and operational logging that excludes keys and message contents.

Planned collections: `products` (unique slug, draft/published state, verified details), `enquiries` (customer details, consent timestamp, status and created time), `admin_sessions` (hashed session identifier and TTL expiry), and `rate_limits` (atomic attempt counters and TTL expiry). Do not create a customer accounts collection; only the single admin role is required. Use paginated inbox queries indexed by creation time and status. Publish changes only after database acknowledgement; failed writes must preserve the editor state.

Admin HTML and API responses must not be cached. The service worker excludes `/admin` and `/api`, and the admin route is marked noindex and disallows framing.

## Verification

Run `npm run lint`, `npm test`, and `npm run build`. Security tests cover missing credentials, key comparison, tampered/expired sessions, key rotation, cross-origin requests, oversized bodies, validation and throttling. Live database workflows cannot be tested until the storage phase.
