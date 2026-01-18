import { createClient } from "redis"

if (!process.env.REDIS_URL) {
  throw new Error("Missing REDIS_URL")
}

export const redis = await createClient({ url: process.env.REDIS_URL })
  .on("error", err => console.error("Redis Client Error", err))
  .connect()