import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { continuation } = await req.json();

		const client = await clientPromise;
		const db = client.db("main");
		const collection = db.collection("stories");

		const result = await collection.insertOne({
			continuation,
			createdAt: new Date(),
		});

		return NextResponse.json({ success: true, id: result.insertedId });
	} catch (err) {
		console.error("POST /api/story error:", err);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
