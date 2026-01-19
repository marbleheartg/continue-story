import { createClient } from "redis"

if (!process.env.REDIS_URL) {
  throw new Error("Missing REDIS_URL")
}

const globalForRedis = global as unknown as { redis: ReturnType<typeof createClient> }

export const redis =
  globalForRedis.redis ||
  createClient({ url: process.env.REDIS_URL })
    .on("error", (err) => console.error("Redis Client Error", err))

if (!redis.isOpen) {
  await redis.connect()
}

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis
