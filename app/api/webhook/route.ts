import { redis } from "@/db"
import { PROJECT_TITLE } from "@/lib/constants"
import { parseWebhookEvent, ParseWebhookEvent, verifyAppKeyWithNeynar } from "@farcaster/frame-node"
import axios from "axios"
import { randomUUID } from "crypto"
import { NextRequest, NextResponse } from "next/server"

type UserData = {
    uuid: string
    fid: number
    lastLogged: string | Date
    createdAt: string | Date
    notificationToken?: string
}

export async function POST(req: NextRequest) {
  const { NEXT_PUBLIC_HOST } = process.env
  if (!NEXT_PUBLIC_HOST) throw new Error("WebhookCredentialsNotConfigured")

  try {
    const requestJson = await req.json()

    let data
    try {
      data = await parseWebhookEvent(requestJson, verifyAppKeyWithNeynar)
    } catch (e: unknown) {
      const error = e as ParseWebhookEvent.ErrorType

      switch (error.name) {
        case "VerifyJsonFarcasterSignature.InvalidDataError":
          throw new Error("InvalidDataError")
        case "VerifyJsonFarcasterSignature.InvalidEventDataError":
          throw new Error("InvalidEventDataError")
        case "VerifyJsonFarcasterSignature.InvalidAppKeyError":
          throw new Error("InvalidAppKeyError")
        case "VerifyJsonFarcasterSignature.VerifyAppKeyError":
          throw new Error("VerifyAppKeyError")
      }
    }

    const fid = data.fid

    const event = data.event

    const updateUser = async (updates: Partial<UserData>, upsert = false) => {
        const userRaw = await redis.get(`user:${fid}`)
        let user: UserData | null = userRaw ? JSON.parse(userRaw) : null
        
        if (!user && upsert) {
             user = {
                uuid: randomUUID(),
                fid,
                lastLogged: new Date(),
                createdAt: new Date(),
                ...updates
            } as UserData
        } else if (user) {
            user = { ...user, ...updates }
        }

        if (user) {
            await redis.set(`user:${fid}`, JSON.stringify(user))
        }
        return user
    }

    switch (event.event) {
      case "frame_added":
        if (event.notificationDetails) {
          await updateUser({ notificationToken: event.notificationDetails.token }, true)

          await axios.post("https://api.farcaster.xyz/v1/frame-notifications", {
            notificationId: randomUUID(),
            title: PROJECT_TITLE.toLowerCase(),
            body: "successfully added",
            targetUrl: `https://${NEXT_PUBLIC_HOST}`,
            tokens: [event.notificationDetails.token],
          })
        } else {
          const userRaw = await redis.get(`user:${fid}`)
          const user = userRaw ? JSON.parse(userRaw) : null
          if (user) {
              delete user.notificationToken
              await redis.set(`user:${fid}`, JSON.stringify(user))
          }
        }

        break
      case "frame_removed":
         {
            const userRaw = await redis.get(`user:${fid}`)
            const user = userRaw ? JSON.parse(userRaw) : null
            if (user) {
                delete user.notificationToken
                await redis.set(`user:${fid}`, JSON.stringify(user))
            }
         }
        break
      case "notifications_enabled":
        await updateUser({ notificationToken: event.notificationDetails.token }, true)

        await axios.post("https://api.farcaster.xyz/v1/frame-notifications", {
          notificationId: randomUUID(),
          title: PROJECT_TITLE.toLowerCase(),
          body: "notifications are now enabled",
          targetUrl: `https://${NEXT_PUBLIC_HOST}`,
          tokens: [event.notificationDetails.token],
        })

        break
      case "notifications_disabled":
         {
            const userRaw = await redis.get(`user:${fid}`)
            const user = userRaw ? JSON.parse(userRaw) : null
            if (user) {
                delete user.notificationToken
                await redis.set(`user:${fid}`, JSON.stringify(user))
            }
         }
        break
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
