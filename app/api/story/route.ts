import { redis } from "@/db"
import { Story } from "@/store"
import { randomUUID } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

export async function GET(req: NextRequest) {
  const chance = Math.random()

  let story

  if (chance < 0.3) {
    story = {
      uuid: randomUUID(),
      parts: [],
      likes: [],
      createdAt: new Date(),
    }
  } else {
    try {
      const activeStories = await redis.sMembers("stories:active")

      if (!activeStories.length) {
        story = {
          uuid: randomUUID(),
          parts: [],
          likes: [],
          createdAt: new Date(),
        }
      } else {
        const randomStoryUuid = activeStories[Math.floor(Math.random() * activeStories.length)]
        const storyRaw = await redis.get(`story:${randomStoryUuid}`)
        story = storyRaw ? JSON.parse(storyRaw) : null
        
        // Fallback if key is missing but in set
        if (!story) {
           story = {
            uuid: randomUUID(),
            parts: [],
            likes: [],
            createdAt: new Date(),
          }
        }
      }
    } catch (err) {
      console.error(err)
      return new NextResponse("Internal Server Error", { status: 500 })
    }
  }

  return NextResponse.json({ story })
}

export async function POST(req: NextRequest) {
  const fidHeader = req.headers.get("fid")
  if (!fidHeader) throw new Error("NoFID")
  const fid = parseInt(fidHeader)

  try {
    const {
      uuid,
      text,
    }: {
      uuid: string
      text: string
    } = await req.json()

    z.object({
      uuid: z.string(),
      text: z.string().min(15).max(30),
    }).parse({
      uuid,
      text,
    })

    const storyRaw = await redis.get(`story:${uuid}`)
    const story: Story | null = storyRaw ? JSON.parse(storyRaw) : null

    let formattedText = text.trimEnd()

    if (formattedText.at(-1) == ".") {
      formattedText += " "
    } else {
      formattedText += ". "
    }

    const newStoryPart = {
      uuid: randomUUID(),
      fid,
      text: formattedText,
      createdAt: new Date(),
    }

    if (!story) {
      const newStory = {
        uuid: randomUUID(),
        parts: [newStoryPart],
        likes: [],
        createdAt: new Date(),
      }
      await redis.set(`story:${newStory.uuid}`, JSON.stringify(newStory))
      await redis.sAdd("stories:active", newStory.uuid)

      return NextResponse.json({ success: true })
    }

    const updatedStory = {
      ...story,
      parts: [...story.parts, newStoryPart],
    }

    if (story.parts.length < 4) {
      await redis.set(`story:${uuid}`, JSON.stringify(updatedStory))
    } else {
      await redis.set(`story:${uuid}`, JSON.stringify(updatedStory))
      await redis.sRem("stories:active", uuid)
      await redis.sAdd("stories:completed", uuid)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
