# SEO, AEO and Google setup

This site is intentionally one page. The launch goal is to make that page easy for people and search systems to understand—not to create thin pages for every model.

## Included in the code

- An accurate page title, description, canonical URL, Open Graph data and a one-URL sitemap.
- `robots.txt` blocks indexing until `NEXT_PUBLIC_SITE_URL` has a real HTTPS domain.
- Store structured data for Trimurti Coolers, its Surat address and phone number.
- Visible FAQ content with matching FAQ structured data. Keep the visible answers and structured answers identical.
- Semantic sections, clear headings, accessible product dialogs, model-specific WhatsApp enquiries without URLs or price references, and a clearly labelled temporary Google-feedback fallback.
- Consent-aware GA4 support. It remains off until `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set and a visitor allows Google content.

## Before domain launch

1. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS domain. This enables indexing, canonical URLs and the sitemap.
2. In Google Search Console, add the final domain property. Verify it using the DNS method, then submit `https://your-domain/sitemap.xml`.
3. Create or select the GA4 property for Trimurti Coolers. Add its web data stream and copy only the Measurement ID (`G-...`) into `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
4. The verified Google Maps listing is already hardcoded as the public map and review-link fallback. In Google Cloud, create a restricted server-side Places API key and add the correct Google Place ID to `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` to enable the inline live review feed. Restrict the Maps Embed key separately by website and API.
5. Confirm the Google Business Profile name, phone, address, business category, hours and final website URL exactly match the live site.
6. Inspect every catalogue image and specification against the current Novamax source. Do not publish a public price.

## AEO content rules

- Answer customer questions plainly in the visible FAQ before adding them to structured data.
- Use `Trimurti Coolers`, `Novamax`, `Surat` and the precise product model naturally; avoid repeating keywords unnaturally.
- Keep details such as capacity, airflow, power and dimensions tied to the correct model.
- Do not claim stock, delivery time, ratings, price, warranty or coverage area unless it has been confirmed for that model.

## Analytics events worth measuring later

Start with GA4's automatic page view. Once the site is live, add consent-aware custom events for `whatsapp_enquiry`, `catalogue_filter_used`, `product_details_opened` and `maps_opened`. These should measure interaction, not capture enquiry text, phone numbers or other personal data.

## External-account actions still required

The code and environment placeholders are ready, but no GA4 property, Google Cloud API key, Search Console verification or Google Business Profile change has been made from this project. Those are account-side actions and should be completed immediately before launch.
