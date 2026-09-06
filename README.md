# Trimurti Coolers

A responsive one-page Next.js catalogue website for Trimurti Coolers, Surat, Gujarat. The website uses honest preview content until verified company and product information is available.

## Technology

- Next.js App Router
- TypeScript
- Custom responsive CSS
- Helvetica-first system font stack
- Lucide icons
- Vitest
- Progressive service worker
- Google Maps embed
- Server-side Google Places review integration

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

The `/admin` workspace uses a single access key. Product additions, edits, publication state and deletion are stored in MongoDB. The contact form still offers WhatsApp while enquiry storage is pending. See [admin setup and scope](docs/ADMIN.md).

Use the generated, git-ignored `.env`, or copy `.env.example` to `.env`, and add the available configuration:

```env
NEXT_PUBLIC_SITE_URL=https://www.example.com
NEXT_PUBLIC_WHATSAPP_NUMBER=919999999999
NEXT_PUBLIC_GOOGLE_MAPS_URL=https://maps.google.com/...
NEXT_PUBLIC_GOOGLE_MAPS_QUERY=Trimurti Coolers, Surat, Gujarat
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY=
GOOGLE_PLACES_API_KEY=
GOOGLE_PLACE_ID=
MONGODB_URI=mongodb+srv://...
MONGODB_DATABASE=trimurti_coolers
```

The WhatsApp number must include the country code and contain digits only. Until it is configured, enquiry controls use WhatsApp's recipient chooser with a prefilled message. The preview site blocks indexing until a production URL is configured.

`GOOGLE_PLACES_API_KEY` is server-only and must never use the `NEXT_PUBLIC_` prefix. Restrict the separate Maps Embed key by website and API in Google Cloud. Until the review credentials are configured, the review section displays an honest setup state instead of sample testimonials.

## Product catalogue

The catalogue contains 37 supplied products across New Launch, Commercial / Desert and Personal / Home ranges. Company information from the source catalogue is intentionally excluded. `src/data/products.ts` is the initial seed and public fallback. A new MongoDB collection receives these records once as published products.

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

Catalogue search checks the product name, category, summary, intended setting, model, and features. Product enquiry links create a WhatsApp message containing the selected product name. Navigation and search stay on the homepage and use smooth section scrolling.

## SEO and indexing

The project includes:

- Page metadata and canonical URLs
- Generated `robots.txt`
- Generated `sitemap.xml`
- `llms.txt`
- Semantic page structure
- A one-URL sitemap
- LocalBusiness structured data

Structured product data should be added only after product details have been verified.

## Offline behaviour

The service worker is registered only in production. It never caches admin pages or API responses, so catalogue publication changes are not trapped behind an offline cache.

When changing caching behaviour, update `CACHE_VERSION` in `public/sw.js`.

## Before launch

Review [the security notes](docs/SECURITY_REVIEW.md), especially the hosting-level rate limit and MongoDB deployment controls.

- Add the verified company logo
- Replace preview product records and illustrations
- Add the real WhatsApp number and production URL
- Add the exact Google Maps listing, Place ID and verified address
- Configure the Google Places and Maps Embed credentials
- Add verified contact details and service areas
- Review every claim and specification
- Create final social-sharing artwork
- Validate metadata and structured data
- Test the installed service worker update path
- Run accessibility, Lighthouse, and cross-browser checks
