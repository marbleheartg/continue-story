import { stories } from "@/db";
import { verifySession } from "@/lib/auth/verifySession";
import console from "console";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { uuid, session } = await req.json();

		const { fid } = verifySession(session);

		const story = await stories.findOne({ uuid });
		if (!story) throw new Error("No story found");

		if (story.likes.length >= 5) throw new Error("Likes limit");

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
				  }
		);

		return NextResponse.json({ success: true });
	} catch (err) {
		console.error(err);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
