import "server-only";
import { MongoClient, ServerApiVersion } from "mongodb";

declare global {
  var trimurtiMongo: Promise<MongoClient> | undefined;
}

function configuration() {
  const uri = process.env.MONGODB_URI?.trim() || "";
  const database = process.env.MONGODB_DATABASE?.trim() || "trimurti_coolers";
  if (!/^mongodb(?:\+srv)?:\/\//.test(uri) || uri.length > 2048)
    throw new Error("MongoDB is not configured.");
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(database))
    throw new Error("MongoDB database name is invalid.");
  return { uri, database };
}

export function mongoConfigured() {
  try {
    configuration();
    return true;
  } catch {
    return false;
  }
}

export async function database() {
  const { uri, database: name } = configuration();
  const connect = () =>
    new MongoClient(uri, {
      maxPoolSize: 10,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    }).connect();
  const client = global.trimurtiMongo ?? connect();
  if (process.env.NODE_ENV !== "production") global.trimurtiMongo = client;
  return (await client).db(name);
}
