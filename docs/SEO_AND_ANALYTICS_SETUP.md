# SEO, AEO and Google setup

This site is intentionally one page. The launch goal is to make that page easy for people and search systems to understand—not to create thin pages for every model.

## Included in the code

- An accurate page title, description, canonical URL, Open Graph data and a one-URL sitemap.
- `robots.txt` blocks indexing until `NEXT_PUBLIC_SITE_URL` has a real HTTPS domain.
- Store structured data for Trimurti Coolers, its Surat address and phone number.
- Visible FAQ content with matching FAQ structured data. Keep the visible answers and structured answers identical.
- Semantic sections, clear headings, accessible product dialogs, model-specific WhatsApp enquiries without URLs or price references, and a clearly labelled temporary Google-feedback fallback.
- Consent-aware GA4 support. It remains off until `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set and a visitor allows Google features. Google Consent Mode v2 starts denied, then grants only analytics storage after that affirmative choice; all advertising consent categories remain denied.

## Completed Google wiring — 6 September 2026

- The `sc-domain:trimurticooler.com` Google Search Console property is verified through the Cloudflare DNS record.
- `https://www.trimurticooler.com/sitemap.xml` has been submitted in Search Console. Processing/indexing is asynchronous; verification and submission do not mean every result is indexed immediately.
- The GA4 property **Trimurti Coolers** and its `https://www.trimurticooler.com` web stream have been created. Its Measurement ID is configured in Vercel as `NEXT_PUBLIC_GA_MEASUREMENT_ID` **Config** for Production and Preview. The ID is public by design, but analytics still loads only after optional consent.
- Vercel Production uses `https://www.trimurticooler.com` as `NEXT_PUBLIC_SITE_URL`. The root domain redirects to that canonical `www` host.

## Ongoing launch responsibilities

1. Keep `NEXT_PUBLIC_SITE_URL` set to the final HTTPS canonical host. It controls metadata, schema, `robots.txt` and the sitemap.
2. The verified Google Maps listing is hardcoded as the map and review-link fallback. In Google Cloud, create a restricted server-side Places API key and add the correct Google Place ID to `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` to enable the inline live review feed. Restrict the Maps Embed key separately by website and API.
3. Confirm the Google Business Profile name, phone, address, business category, hours and final website URL exactly match the live site.
4. Inspect every catalogue image and specification against the current Novamax source. Do not publish a public price.

## AEO content rules

- Answer customer questions plainly in the visible FAQ before adding them to structured data.
- Use `Trimurti Coolers`, `Novamax`, `Surat` and the precise product model naturally; avoid repeating keywords unnaturally.
- Keep details such as capacity, airflow, power and dimensions tied to the correct model.
- Do not claim stock, delivery time, ratings, price, warranty or coverage area unless it has been confirmed for that model.

## Analytics events worth measuring later

Start with GA4's automatic page view. Once the site is live, add consent-aware custom events for `whatsapp_enquiry`, `catalogue_filter_used`, `product_details_opened` and `maps_opened`. These should measure interaction, not capture enquiry text, phone numbers or other personal data.

## External-account actions still required

Google Cloud Places credentials and the final Google Business Profile website/details still need to be completed. The Search Console property, sitemap submission, GA4 property and Vercel GA4 configuration are already in place.
