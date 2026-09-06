# Trimurti Coolers

A responsive one-page Next.js catalogue website for **Trimurti Coolers**, an authorised Novamax distributor in Surat, Gujarat. It is built for model discovery and direct WhatsApp enquiries; public prices are intentionally excluded.

## Technology

- Next.js App Router
- TypeScript
- Custom responsive CSS
- Editorial, product-first visual system
- Lucide icons
- Vitest
- Progressive service worker
- Google Maps embed
- Server-side Google Places review integration
- Consent-aware Google Analytics 4 support

## Local development

Requirements:

- Node.js 20.9 or newer
- npm

Install and start the development server:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment configuration

The `/admin` workspace uses a single access key. Product additions, edits, publication state and deletion are stored in MongoDB. The public site keeps product conversations on WhatsApp rather than using a contact form. See [admin setup and scope](docs/ADMIN.md).

Use the generated, git-ignored `.env`, or copy `.env.example` to `.env`, and add the available configuration:

```env
NEXT_PUBLIC_SITE_URL=https://www.example.com
NEXT_PUBLIC_WHATSAPP_NUMBER=919999999999
NEXT_PUBLIC_GOOGLE_MAPS_URL=https://maps.app.goo.gl/NnSCA2dcJWgCNA5g8
NEXT_PUBLIC_GOOGLE_MAPS_QUERY=5 Sonal Industrial, GHB Road, Surat, Gujarat 394210
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY=
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GOOGLE_PLACES_API_KEY=
GOOGLE_PLACE_ID=
MONGODB_URI=mongodb+srv://...
MONGODB_DATABASE=trimurti_coolers
```

The WhatsApp number must include the country code and contain digits only. Until it is configured, enquiry controls use WhatsApp's recipient chooser with a prefilled message. The preview site blocks indexing until a production URL is configured.

The verified Trimurti Coolers Google Maps listing is built in as the map and review-link fallback. Until live review credentials are configured, the review section shows seven labelled, paraphrased summaries from the verified listing and links visitors to Google for all reviews. `GOOGLE_PLACES_API_KEY` is server-only and must never use the `NEXT_PUBLIC_` prefix. Restrict the separate Maps Embed key by website and API in Google Cloud.

## Product catalogue

The catalogue contains 37 supplied Novamax models across New Launch, Commercial / Desert and Personal / Home ranges. Each record is a separate enquiry target and uses manufacturer-hosted imagery. `src/data/products.ts` is the initial seed and public fallback. Before launch, visually verify each image and model specification against the current Novamax source.

The hero presents five selected models in a restrained automatic rotation. It preloads the selected images and stops rotation when the visitor prefers reduced motion.

The homepage requests published records from `/api/products`. The protected admin product API persists validated changes. If MongoDB is unavailable, the public carousel clearly uses the bundled fallback. Search covers common fields, features and technical specifications.

See `docs/CONTENT_GUIDE.md` before replacing preview content.

## Commands

```bash
npm run dev
npm run lint
npm run test
npm run build
```

The homepage is statically rendered, while `/api/google-reviews` runs on the server to protect the Places API key. Deploy to a Next.js-compatible host such as Vercel, Netlify with the Next.js runtime, or a Node server. A plain static file host cannot run the live review endpoint.

## Search and enquiry

Catalogue search checks the product name, category, summary, intended setting, model and features. The explorer offers a compact range, tank-capacity, feature and order filter set. Product enquiry links create a WhatsApp message containing only the selected product name. Navigation and search stay on the homepage and use smooth section scrolling.

## SEO and indexing

The project includes:

- Page metadata and canonical URLs
- Generated `robots.txt`
- Generated `sitemap.xml`
- `llms.txt`
- Semantic page structure
- A one-URL sitemap
- Store and FAQ structured data
- Consent-aware GA4 component (inactive until configured)

See [SEO and analytics setup](docs/SEO_AND_ANALYTICS_SETUP.md) for the launch sequence, Google account actions and content rules. See [brand notes](docs/BRAND_GUIDELINES.md) for the locked customer-facing identity and visual direction.

## Offline behaviour

The service worker is registered only in production. It never caches admin pages or API responses, so catalogue publication changes are not trapped behind an offline cache.

When changing caching behaviour, update `CACHE_VERSION` in `public/sw.js`.

## Before launch

Review [the security notes](docs/SECURITY_REVIEW.md), especially the hosting-level rate limit and MongoDB deployment controls.

- Add the production URL
- Inspect every product image and specification against the current Novamax source
- Configure GA4, Google Search Console, Google Places and Maps Embed credentials
- Confirm the Google Business Profile details and final website URL
- Create final social-sharing artwork
- Validate metadata and structured data
- Test the installed service worker update path
- Run accessibility, Lighthouse, and cross-browser checks
