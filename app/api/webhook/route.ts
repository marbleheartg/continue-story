import { users } from "@/db";
import { verifySession } from "@/lib/auth/verifySession";
import console from "console";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { session, notificationToken } = await req.json();

		// Non client events handling
		if (!notificationToken) return NextResponse.json({ success: true });

		console.log("wh route", notificationToken);

		const { fid } = verifySession(session);

		await users.updateOne({ fid }, { $set: { notificationToken } });

		return NextResponse.json({ success: true });
	} catch (err) {
		console.error(err);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

//
