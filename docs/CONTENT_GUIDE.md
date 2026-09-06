# Content guide

This project is designed to remain usable while product information is incomplete. Verified content can be added without changing the page components.

## Product records

Edit `src/data/products.ts`. Each product needs:

- A unique product identifier
- Product name
- Category
- Short factual summary
- Intended setting
- Visual tone

Model, tank capacity, cooling area, power consumption, dimensions, and features are optional. Leave an unknown field out instead of entering placeholder measurements.

## Product images

The supplied Novamax product photographs are currently local, true-alpha PNG cutouts in `public/products/`. Keep these cutouts when changing catalogue records so every placement remains free from a rectangular image background.

- Keep a consistent angle and crop across products
- Use a genuinely transparent background, not a checkerboard or white background baked into the file
- Export modern WebP or AVIF files
- Avoid placing important text inside images
- Add descriptive alternative text based on what is visible
- Do not use a distributor photograph without confirmed usage rights

## Writing rules

- Use short, specific sentences
- Use Indian English consistently
- Avoid unexplained technical terms
- Do not invent statistics, testimonials, awards, certifications, or locations
- Do not describe a feature unless the product team has verified it
- Avoid generic phrases such as best-in-class or revolutionary
- Do not use lorem ipsum
- Do not use emojis
- Do not use em dashes

## Required company information

Before launch, collect:

- Legal or public brand name
- Logo
- WhatsApp number
- Phone and email
- Full address
- Service areas
- Warranty terms
- Verified certifications
- Social profiles
- Final domain
- Google Maps listing URL and Place ID
- Access to the verified Google Business Profile
