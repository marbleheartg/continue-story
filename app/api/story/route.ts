import { client, completedStories, stories } from "@/db";
import { verifySession } from "@/lib/auth/verifySession";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
	const chance = Math.random();

	let story;

	if (chance < 0.3) {
		story = {
			uuid: randomUUID(),
			parts: [],
			likes: [],
			createdAt: new Date(),
		};
	} else {
		try {
			const allStories = await stories.find({}).toArray();

			if (!allStories.length) {
				story = {
					uuid: randomUUID(),
					parts: [],
					likes: [],
					createdAt: new Date(),
				};
			} else {
				story = allStories[Math.floor(Math.random() * allStories.length)];
			}
		} catch (err) {
			console.error(err);
			return new NextResponse("Internal Server Error", { status: 500 });
		}
	}

	return NextResponse.json({ story });
}

export async function POST(req: NextRequest) {
	try {
		const {
			uuid,
			text,
			session,
		}: {
			uuid: string;
			text: string;
			session: string;
		} = await req.json();

		z.object({
			uuid: z.string(),
			text: z.string().min(15).max(30),
			session: z.string(),
		}).parse({
			uuid,
			text,
			session,
		});

		const { fid } = verifySession(session);

		const story = await stories.findOne({ uuid });

		let formattedText = text.trimEnd();

		if (formattedText.at(-1) == ".") {
			formattedText += " ";
		} else {
			formattedText += ". ";
		}

		const newStoryPart = {
			uuid: randomUUID(),
			fid,
			text: formattedText,
			createdAt: new Date(),
		};

		if (!story) {
			await stories.insertOne({
				uuid: randomUUID(),
				parts: [newStoryPart],
				likes: [],
				createdAt: new Date(),
			});

			return NextResponse.json({ success: true });
		}

		if (story.parts.length < 4) {
			await stories.updateOne(
				{ uuid },
				{
					$push: {
						parts: newStoryPart,
					},
				}
			);
		} else {
			const session = client.startSession();

			try {
				await stories.deleteOne({ uuid }, { session });

				await completedStories.insertOne(
					{
						...story,
						parts: [...story?.parts, newStoryPart],
					},
					{ session }
				);
			} finally {
				await session.endSession();
			}
		}

		return NextResponse.json({ success: true });
	} catch (err) {
		console.error(err);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
