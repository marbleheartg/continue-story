import { stories } from "@/db";
import { verifySession } from "@/lib/auth/verifySession";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const {
			uuid,
			like,
			session,
		}: { uuid: string; like: boolean; session: string } = await req.json();

		const { fid } = verifySession(session);

		const story = await stories.findOne({ uuid });
		if (!story) throw new Error("No story found");

		await stories.updateOne(
			{ uuid },
			like
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
