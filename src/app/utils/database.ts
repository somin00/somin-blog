import { MongoClient } from "mongodb";

const DB_URL: string = process.env.NEXT_PUBLIC_DB_URL || "";
export default async function connectDB() {
  const client = await MongoClient.connect(DB_URL);
  return client;
}
