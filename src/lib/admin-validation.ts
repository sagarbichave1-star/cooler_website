import type { Product } from "@/data/products";

export class InputError extends Error {}

export function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new InputError("Invalid form data.");
  return value as Record<string, unknown>;
}

export function field(
  data: Record<string, unknown>,
  key: string,
  max: number,
  required = true,
) {
  const value = data[key];
  if (value === undefined && !required) return "";
  if (typeof value !== "string") throw new InputError(`Check ${key}.`);
  const text = value.trim();
  if ((required && !text) || text.length > max)
    throw new InputError(`Check ${key} (maximum ${max} characters).`);
  return text;
}

export function productInput(value: unknown): {
  slug: string;
  published: boolean;
  data: Product;
} {
  const input = record(value);
  const slug = field(input, "slug", 80);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    throw new InputError(
      "Use lowercase letters, numbers and hyphens for the product ID.",
    );
  if (typeof input.published !== "boolean")
    throw new InputError("Choose a publication status.");
  const data: Product = {
    slug,
    name: field(input, "name", 120),
    category: field(input, "category", 60),
    summary: field(input, "summary", 1500),
    intendedFor: field(input, "intendedFor", 160),
    tone: "ocean",
  };
  for (const key of [
    "model",
    "tankCapacity",
    "coolingArea",
    "powerConsumption",
    "dimensions",
  ] as const) {
    const text = field(input, key, 160, false);
    if (text) data[key] = text;
  }
  const imageUrl = field(input, "imageUrl", 600, false);
  if (imageUrl) {
    let url: URL;
    try {
      url = new URL(imageUrl);
    } catch {
      throw new InputError("Enter a valid HTTPS image URL.");
    }
    if (url.protocol !== "https:" || url.username || url.password)
      throw new InputError("Use an HTTPS image URL.");
    data.imageUrl = url.href;
  }
  if (input.features !== undefined) {
    if (!Array.isArray(input.features) || input.features.length > 20)
      throw new InputError("Check product features.");
    data.features = input.features.map((value) => {
      if (
        typeof value !== "string" ||
        !value.trim() ||
        value.trim().length > 160
      )
        throw new InputError("Check product features.");
      return value.trim();
    });
  }
  if (input.specifications !== undefined) {
    if (
      !Array.isArray(input.specifications) ||
      input.specifications.length > 50
    )
      throw new InputError("Check product specifications.");
    data.specifications = input.specifications.map((value) => {
      const specification = record(value);
      return {
        label: field(specification, "label", 80),
        value: field(specification, "value", 240),
      };
    });
  }
  return { slug, published: input.published, data };
}

export function enquiryInput(value: unknown) {
  const input = record(value);
  const phone = field(input, "phone", 24);
  const digits = phone.replace(/\D/g, "").length;
  if (!/^\+?[\d ()-]{10,24}$/.test(phone) || digits < 10 || digits > 15)
    throw new InputError(
      "Enter a valid phone number including the country code.",
    );
  const email = field(input, "email", 200, false);
  if (email && !/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(email))
    throw new InputError("Enter a valid email address.");
  if (input.consent !== true)
    throw new InputError("Please agree to be contacted about your enquiry.");
  return {
    name: field(input, "name", 100),
    phone,
    email,
    message: field(input, "message", 3000),
    consent: true,
  };
}
