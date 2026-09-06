import "server-only";
import type { Collection, Document, OptionalUnlessRequiredId } from "mongodb";
import { products, type Product } from "@/data/products";
import { database } from "./mongodb";

export type StoredProduct = Product & {
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export const productCollectionValidator: Document = {
  // Database validation mirrors the API validation. Keeping this defence at
  // the collection boundary prevents malformed writes from any future client.
  $jsonSchema: {
    bsonType: "object",
    required: [
      "slug",
      "name",
      "category",
      "summary",
      "intendedFor",
      "tone",
      "published",
      "createdAt",
      "updatedAt",
    ],
    additionalProperties: false,
    properties: {
      _id: {},
      slug: {
        bsonType: "string",
        minLength: 1,
        maxLength: 80,
        pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
      },
      name: { bsonType: "string", minLength: 1, maxLength: 120 },
      category: { bsonType: "string", minLength: 1, maxLength: 60 },
      summary: { bsonType: "string", minLength: 1, maxLength: 1500 },
      intendedFor: { bsonType: "string", minLength: 1, maxLength: 160 },
      tone: { enum: ["ocean", "lagoon", "aqua", "mist"] },
      published: { bsonType: "bool" },
      featured: { bsonType: "bool" },
      model: { bsonType: "string", maxLength: 160 },
      tankCapacity: { bsonType: "string", maxLength: 160 },
      coolingArea: { bsonType: "string", maxLength: 160 },
      powerConsumption: { bsonType: "string", maxLength: 160 },
      dimensions: { bsonType: "string", maxLength: 160 },
      imageUrl: { bsonType: "string", maxLength: 600 },
      features: {
        bsonType: "array",
        maxItems: 20,
        items: { bsonType: "string", maxLength: 160 },
      },
      specifications: {
        bsonType: "array",
        maxItems: 50,
        items: {
          bsonType: "object",
          required: ["label", "value"],
          additionalProperties: false,
          properties: {
            label: { bsonType: "string", minLength: 1, maxLength: 80 },
            value: { bsonType: "string", minLength: 1, maxLength: 240 },
          },
        },
      },
      createdAt: { bsonType: "date" },
      updatedAt: { bsonType: "date" },
    },
  },
};

let setup: Promise<Collection<StoredProduct>> | undefined;

async function productsCollection() {
  // Share one setup promise so concurrent first requests cannot race to create
  // the collection, seed records or indexes. Clear it after a failed setup.
  if (!setup)
    setup = setupCollection().catch((error) => {
      setup = undefined;
      throw error;
    });
  return setup;
}

async function setupCollection() {
  const db = await database();
  const exists = await db
    .listCollections({ name: "products" }, { nameOnly: true })
    .hasNext();
  let created = false;
  if (!exists) {
    try {
      await db.createCollection<StoredProduct>("products", {
        validator: productCollectionValidator,
      });
      created = true;
    } catch (error) {
      if (!(
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === 48
      ))
        throw error;
    }
  }
  const collection = db.collection<StoredProduct>("products");
  await collection.createIndex(
    { slug: 1 },
    { unique: true, name: "unique_product_slug" },
  );
  await collection.createIndex(
    { published: 1, category: 1, name: 1 },
    { name: "public_catalogue" },
  );
  // Seed only a newly created database. Existing records are never overwritten
  // by a deployment or restart.
  if (created && products.length) {
    const now = new Date();
    await collection.insertMany(
      products.map((product) => ({
        ...product,
        published: true,
        createdAt: now,
        updatedAt: now,
      })),
    );
  }
  return collection;
}

function adminDto(document: StoredProduct) {
  const { published } = document;
  const data = { ...document };
  delete (data as Partial<StoredProduct>).published;
  delete (data as Partial<StoredProduct>).createdAt;
  delete (data as Partial<StoredProduct>).updatedAt;
  return { slug: data.slug, published, data };
}

export async function listPublicProducts() {
  return (await productsCollection())
    .find(
      { published: true },
      { projection: { _id: 0, published: 0, createdAt: 0, updatedAt: 0 } },
    )
    .sort({ featured: -1, name: 1 })
    .limit(100)
    .toArray() as Promise<Product[]>;
}

export async function listAdminProducts() {
  const items = await (
    await productsCollection()
  )
    .find({}, { projection: { _id: 0 } })
    .sort({ updatedAt: -1 })
    .limit(100)
    .toArray();
  return items.map(adminDto);
}

export async function saveProduct(
  originalSlug: string | undefined,
  product: Product,
  published: boolean,
) {
  const collection = await productsCollection();
  const now = new Date();
  const existing = originalSlug
    ? await collection.findOne(
        { slug: originalSlug },
        { projection: { createdAt: 1 } },
      )
    : null;
  // A rename keeps its original creation date, while every write receives an
  // auditable updated timestamp used by the admin listing order.
  const document: OptionalUnlessRequiredId<StoredProduct> = {
    ...product,
    published,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
  if (!originalSlug) {
    await collection.insertOne(document);
    return true;
  }
  return (
    (await collection.replaceOne({ slug: originalSlug }, document))
      .matchedCount === 1
  );
}

export async function removeProduct(slug: string) {
  return (
    (await (await productsCollection()).deleteOne({ slug })).deletedCount === 1
  );
}
