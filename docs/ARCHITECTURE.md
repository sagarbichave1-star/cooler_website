# Architecture and maintenance guide

Trimurti Coolers is intentionally a **single public page**. It is not an e-commerce store: products support model discovery, clear specification comparison and a direct WhatsApp conversation. Prices and checkout are deliberately absent.

## Public application

`src/app/page.tsx` owns the fixed public section order and its visible FAQ. It remains a Server Component so the primary page and its JSON-LD are delivered in the initial HTML. Interactive pieces are narrow Client Components:

- `site-header.tsx` manages the mobile navigation and the active-section indicator.
- `smooth-anchor-links.tsx` provides accessible smooth section movement while removing fragments from the address bar after navigation.
- `catalogue-explorer.tsx` loads published products, filters them, and opens the native model-details dialog.
- `hero-product-rotator.tsx`, `google-reviews.tsx`, and privacy controls are client-only because they use timers, browser preferences, storage or network effects.

Do not move the whole homepage behind a `"use client"` boundary. That would send unnecessary JavaScript and weaken the server-rendered SEO baseline.

## Product data

`src/data/products.ts` is the bundled initial seed and outage fallback. MongoDB becomes the live product source when configured:

1. `/api/products` returns only `published` records.
2. `product-repository.ts` creates/indexes/seeds a new collection once; it never overwrites existing records.
3. `catalogue.ts` validates the API response in the browser before rendering it. If the request cannot complete, it exposes the bundled fallback instead.
4. `/admin` is the only product-writing UI. Its API requires a signed session and validates every input before MongoDB receives it.

When changing a model, update its wording/specification from an approved Novamax source. Coverage area must be a published value; do not derive it from tank capacity, airflow or fan size.

## SEO and canonical URL

`src/config/site.ts` is the sole public business-config source. `NEXT_PUBLIC_SITE_URL` must be `https://www.trimurticooler.com` in Vercel Production. That same value drives metadata, Store schema, `robots.txt` and `sitemap.xml`.

The sitemap is intentionally public and is not linked in visitor navigation. Search crawlers must access it. Preview deployments are disallowed in `robots.ts` until a real production URL is set.

The visible FAQ and the FAQPage JSON-LD in `page.tsx` share one array. Keep them aligned; schema must never claim an answer the page does not show.

## Privacy and Google integrations

The layout writes Google Consent Mode’s denied default before interactive scripts run. `PrivacyProvider` stores an essential-only or external-services choice for 180 days and keeps advertising consent denied in all cases.

- GA4 loads only when optional consent is allowed. Its public Measurement ID belongs in Vercel as `NEXT_PUBLIC_GA_MEASUREMENT_ID` **Config** (not Secret), for Production and Preview.
- Google Places uses `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` only on the server. Keep both as private Vercel secrets. `/api/google-reviews` limits calls, has a timeout, rejects redirects and normalises the response before the browser sees it.
- The showroom map does not need optional consent because it is a core location feature. The fallback coordinate embed works even when no Maps Embed key has been configured.

The consent wording is an implementation aid, not legal advice. Review the final DPDP Act notice, business data-retention process and contact process with the business owner.

## Deployment checklist

1. Update the code or public configuration.
2. Run `npm run lint`, `npm run test -- --run` and `npm run build -- --webpack`.
3. Commit only intended files; do not add local lock-file changes accidentally.
4. Push `main`; Vercel creates the production deployment.
5. Verify `https://www.trimurticooler.com/`, `/robots.txt` and `/sitemap.xml` after deployment.
6. In Search Console, inspect the sitemap status and request indexing only after the deployed canonical URL is correct.

## Security boundaries

Admin credentials, MongoDB and Google Places credentials are server-only. Never give them a `NEXT_PUBLIC_` name and never commit values to the repository. The in-process throttles in `request-guards.ts` are a temporary per-instance ceiling; use a shared/edge rate limiter before scaling to multiple server instances or adding real enquiry persistence.
