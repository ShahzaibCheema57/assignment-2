import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
export const mongoClient = new MongoClient(uri);

export async function getMongoDb() {
  if (!mongoClient.topology?.isConnected()) {
    await mongoClient.connect();
  }
  return mongoClient.db();  // default DB from URI
}
