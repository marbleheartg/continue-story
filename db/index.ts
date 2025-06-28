import { Story } from "@/store"
import { UserContext } from "@farcaster/frame-core/dist/context"
import { MongoClient } from "mongodb"

const { MONGODB_URI } = process.env
if (!MONGODB_URI) throw new Error("No MONGODB_URI")

export const client = new MongoClient(MONGODB_URI)
await client.connect()

type DatabaseFields = {
  uuid: string
  createdAt: Date
}

export const db = client.db("main")

export const usersCollection = db.collection<
  UserContext & DatabaseFields & { notificationToken?: string; lastLogged: Date; createdAt: Date }
>("users")

export const stories = db.collection<Story & DatabaseFields>("stories")

export const completedStories = db.collection<Story & DatabaseFields>("completedStories")
