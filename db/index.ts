import { Story, User } from "@/types";
import { MongoClient } from "mongodb";

const { MONGODB_URI } = process.env;
if (!MONGODB_URI) throw new Error("No MONGODB_URI");

export const client = new MongoClient(MONGODB_URI);
await client.connect();

export const db = client.db("main");

export const users = db.collection<User>("users");
export const stories = db.collection<Story>("stories");
export const completedStories = db.collection<Story>("completedStories");
