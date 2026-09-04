# Tirupati Coolers

A responsive one-page Next.js catalogue website for Tirupati Coolers, Surat, Gujarat. The website uses honest preview content until verified company and product information is available.

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

Copy `.env.example` to `.env.local` and add the available business configuration:

```env
NEXT_PUBLIC_SITE_URL=https://www.example.com
NEXT_PUBLIC_WHATSAPP_NUMBER=919999999999
NEXT_PUBLIC_GOOGLE_MAPS_URL=https://maps.google.com/...
NEXT_PUBLIC_GOOGLE_MAPS_QUERY=Tirupati Coolers, Surat, Gujarat
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY=
GOOGLE_PLACES_API_KEY=
GOOGLE_PLACE_ID=
```

The WhatsApp number must include the country code and contain digits only. Until it is configured, enquiry controls use WhatsApp's recipient chooser with a prefilled message. The preview site blocks indexing until a production URL is configured.

`GOOGLE_PLACES_API_KEY` is server-only and must never use the `NEXT_PUBLIC_` prefix. Restrict the separate Maps Embed key by website and API in Google Cloud. Until the review credentials are configured, the review section displays an honest setup state instead of sample testimonials.

## Product catalogue

All product content is stored in `src/data/products.ts`. Products are searched and opened in an accessible detail dialog on the homepage. Optional specification fields remain hidden when they are not available. Do not publish invented values to make the catalogue appear complete.

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

The service worker is registered only in production. It uses network-first navigation for the homepage and caches versioned framework assets and images. Google review API responses are deliberately excluded from service-worker caching.

When changing caching behaviour, update `CACHE_VERSION` in `public/sw.js`.

## Before launch

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
