import { usersCollection } from "@/db"
import { randomUUID } from "crypto"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const fidHeader = req.headers.get("fid")
  if (!fidHeader) throw new Error("NoFID")

  const fid = parseInt(fidHeader)

  try {
    let user = await usersCollection.findOne({ fid })

    if (!user) {
      await usersCollection.insertOne({
        uuid: randomUUID(),
        fid,
        lastLogged: new Date(),
        createdAt: new Date(),
      })
    } else {
      if (!user.createdAt) await usersCollection.updateOne({ fid }, { $set: { createdAt: new Date() } })
      await usersCollection.updateOne({ fid }, { $set: { lastLogged: new Date() } })
    }

    user = await usersCollection.findOne({ fid })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
