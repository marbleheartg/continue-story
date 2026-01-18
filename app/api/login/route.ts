import { redis } from "@/db"
import { randomUUID } from "crypto"
import { NextRequest, NextResponse } from "next/server"

type UserData = {
    uuid: string
    fid: number
    lastLogged: string | Date
    createdAt: string | Date
}

export async function POST(req: NextRequest) {
  const fidHeader = req.headers.get("fid")
  if (!fidHeader) throw new Error("NoFID")

  const fid = parseInt(fidHeader)

  try {
    const userRaw = await redis.get(`user:${fid}`)
    let user: UserData | null = userRaw ? JSON.parse(userRaw) : null

    if (!user) {
      user = {
        uuid: randomUUID(),
        fid,
        lastLogged: new Date(),
        createdAt: new Date(),
      }
      await redis.set(`user:${fid}`, JSON.stringify(user))
    } else {
      // Update fields
      const updatedUser = {
        ...user,
        lastLogged: new Date(),
        createdAt: user.createdAt || new Date()
      }
      await redis.set(`user:${fid}`, JSON.stringify(updatedUser))
      user = updatedUser
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
