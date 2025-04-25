import clientPromise from "@/lib/mongodb";
import { NewStoryPart, Story } from "@/types";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const client = await clientPromise;
const db = client.db("main");
const collection = db.collection<Story>("stories");

export async function GET() {
	let randStory: Story;

	if (Math.random() < 0.5) {
		const stories = (await collection.find({}).toArray()) as unknown as Story[];

		const randIdx = Math.floor(Math.random() * stories.length);

		randStory = stories[randIdx];
	} else {
		randStory = {
			uuid: randomUUID(),
			parts: [],
			createdAt: new Date(),
		};
	}

	return NextResponse.json({ randStory });
}

export async function POST(req: NextRequest) {
	try {
		const {
			story,
			newStoryPart,
			session,
		}: { story: Story; newStoryPart: NewStoryPart; session: string } =
			await req.json();

		let decoded;
		try {
			decoded = jwt.verify(session, process.env.JWT_SECRET!) as { fid: string };
		} catch (err) {
			return new NextResponse("Invalid or expired token", { status: 400 });
		}

		const validation = z
			.string()
			.min(15, "Text must exceed 15 characters")
			.max(30, "Text must be smaller than 30 characters")
			.safeParse(newStoryPart.text);

		if (!validation.success) {
			return NextResponse.json(
				{ error: validation.error.message },
				{ status: 400 }
			);
		}

		newStoryPart.uuid = randomUUID();
		newStoryPart.text = newStoryPart.text.trimEnd();

		if (newStoryPart.text.at(-1) !== ".")
			newStoryPart.text = newStoryPart.text + ".";

		newStoryPart.text += " ";

		await collection.updateOne(
			{ uuid: story.uuid },
			{
				$push: {
					parts: {
						uuid: randomUUID(),
						fid: decoded.fid,
						text: newStoryPart.text,
						createdAt: new Date(),
					},
				},
				$setOnInsert: {
					createdAt: new Date(),
				},
			},
			{ upsert: true }
		);

		return NextResponse.json({ success: true });
	} catch (err) {
		console.error("POST /api/story error:", err);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
