import clientPromise from "@/lib/mongodb";
import { Story } from "@/types";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const client = await clientPromise;
const db = client.db("main");

export async function POST(req: NextRequest) {
	try {
		const {
			story,
			like,
			session,
		}: { story: Story; like: number; session: string } = await req.json();

		let decoded;
		try {
			decoded = jwt.verify(session, process.env.JWT_SECRET!) as { fid: string };
		} catch (err) {
			return new NextResponse("Invalid or expired token", { status: 400 });
		}

		if (like != 1) return NextResponse.json({ success: false });

		const collection = db.collection<Story>("stories");

		await collection.updateOne(
			{ uuid: story.uuid },
			{
				$inc: { likes: 1 },
			}
		);

		return NextResponse.json({ success: true });
	} catch (err) {
		console.error("POST /api/story error:", err);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
