import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {};

// Client and promise for reuse
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// For hot reload in development, use global cache
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MONGODB_URI to your .env file");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Production: new client each time
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getMongoDb() {
  const client = await clientPromise;
  return client.db(); // Default DB from your connection string
}
