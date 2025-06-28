import { stories } from "@/db"
import console from "console"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const fidHeader = req.headers.get("fid")
  if (!fidHeader) throw new Error("NoFID")
  const fid = parseInt(fidHeader)

  try {
    const { uuid } = await req.json()

    const story = await stories.findOne({ uuid })
    if (!story) throw new Error("No story found")

    if (story.likes.length >= 5) throw new Error("Likes limit")

    await stories.updateOne(
      { uuid },
      !story.likes.some(val => val == fid)
        ? {
            $push: {
              likes: fid,
            },
          }
        : {
            $pull: {
              likes: fid,
            },
          },
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
