import { redis } from "@/db"
import { Story } from "@/store"
import console from "console"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const fidHeader = req.headers.get("fid")
  if (!fidHeader) throw new Error("NoFID")
  const fid = parseInt(fidHeader)

  try {
    const { uuid } = await req.json()

    const storyRaw = await redis.get(`story:${uuid}`)
    const story: Story | null = storyRaw ? JSON.parse(storyRaw) : null

    if (!story) throw new Error("No story found")

    if (story.likes.length >= 5) throw new Error("Likes limit")

    const hasLiked = story.likes.some(val => val == fid)
    
    let newLikes = story.likes
    if (!hasLiked) {
        newLikes = [...story.likes, fid]
    } else {
        newLikes = story.likes.filter(val => val !== fid)
    }

    const updatedStory = {
        ...story,
        likes: newLikes
    }

    await redis.set(`story:${uuid}`, JSON.stringify(updatedStory))

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
