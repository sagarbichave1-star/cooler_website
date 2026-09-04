# Tirupati Coolers

A responsive Next.js catalogue website for Tirupati Coolers, Surat, Gujarat. The website uses honest preview content until verified company and product information is available.

## Technology

- Next.js App Router
- TypeScript
- Custom responsive CSS
- Helvetica-first system font stack
- Lucide icons
- Vitest
- Progressive service worker

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

Copy `.env.example` to `.env.local` and replace both values:

```env
NEXT_PUBLIC_SITE_URL=https://www.example.com
NEXT_PUBLIC_WHATSAPP_NUMBER=919999999999
```

The WhatsApp number must include the country code and contain digits only. Until it is configured, enquiry controls are visibly disabled. The preview site also blocks indexing until a production URL is configured.

## Product catalogue

All product content is stored in `src/data/products.ts`. Optional specification fields remain hidden when they are not available. Do not publish invented values to make a product page appear complete.

See `docs/CONTENT_GUIDE.md` before replacing preview content.

## Commands

```bash
npm run dev
npm run lint
npm run test
npm run build
npm run start
```

## Search and enquiry

Catalogue search checks the product name, category, summary, intended setting, model, and features. Product enquiry links create a WhatsApp message containing the product name and its page URL.

## SEO and indexing

The project includes:

- Page metadata and canonical URLs
- Generated `robots.txt`
- Generated `sitemap.xml`
- `llms.txt`
- Breadcrumbs
- Semantic page structure

Structured product data should be added only after product details have been verified.

## Offline behaviour

The service worker is registered only in production. It uses network-first navigation so catalogue pages prefer current information, then uses a cached page if the network fails. Versioned framework assets and images use cache-first behaviour.

When changing caching behaviour, update `CACHE_VERSION` in `public/sw.js`.

## Before launch

- Add the verified company logo
- Replace preview product records and illustrations
- Add the real WhatsApp number and production URL
- Add verified contact details and service areas
- Review every claim and specification
- Create final social-sharing artwork
- Validate metadata and structured data
- Test the installed service worker update path
- Run accessibility, Lighthouse, and cross-browser checks
