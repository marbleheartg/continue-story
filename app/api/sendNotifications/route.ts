import { users } from "@/db";
import { delay } from "@/utils/delay";
import axios from "axios";
import console from "console";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { secret, title, body } = await req.json();

		if (secret !== "p123jpoix9it4jhlsfkjgapsif934209kpaxvk")
			throw new Error("Unauthorized access");

		const notificationTokens = (
			await users
				.find(
					{ notificationToken: { $exists: true } },
					{ projection: { notificationToken: 1, _id: 0 } }
				)
				.toArray()
		).map(val => val.notificationToken);

		console.log(notificationTokens);

		for (let i = 0; i < notificationTokens.length; i += 100) {
			const {
				data: { successfulTokens, invalidTokens, rateLimitedTokens },
			} = await axios.post("https://api.warpcast.com/v1/frame-notifications", {
				notificationId: randomUUID(),
				title,
				body,
				targetUrl: "https://continuestory.fun",
				tokens: notificationTokens.slice(i, i + 100),
			});

			if (rateLimitedTokens.length)
				console.log("rateLimitedTokens", rateLimitedTokens);

			if (invalidTokens.length) {
				console.log("invalidTokens", invalidTokens);
				await users.updateMany(
					{ notificationToken: { $in: invalidTokens } },
					{ $unset: { notificationToken: "" } }
				);
			}

			await delay(1000);
		}

		return NextResponse.json({ success: true });
	} catch (err) {
		console.error(err);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
