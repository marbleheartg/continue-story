import { users } from "@/db";
import { createAppClient, viemConnector } from "@farcaster/auth-client";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const {
			message,
			signature,
			nonce,
		}: { message: string; signature: `0x${string}`; nonce: string } =
			await req.json();

		const appClient = createAppClient({
			relay: "https://relay.farcaster.xyz",
			ethereum: viemConnector(),
		});

		const { data, success, fid, isError, error } =
			await appClient.verifySignInMessage({
				message,
				signature,
				nonce,
				domain: process.env.DOMAIN!,
			});

		if (!success) throw new Error("verifySignInMessage");

		const user = await users.findOne({ fid: fid.toString() });

		if (!user)
			await users.insertOne({
				uuid: randomUUID(),
				fid: fid.toString(),
				lastLogged: new Date(),
				createdAt: new Date(),
			});
		else {
			await users.updateOne(
				{ fid: fid.toString() },
				{ $set: { lastLogged: new Date() } }
			);
		}

		const payload = {
			fid,
			iat: Math.floor(Date.now() / 1000),
		};

		const session = jwt.sign(payload, process.env.JWT_SECRET!, {
			expiresIn: "1 day",
		});

		return NextResponse.json({ success: true, session });
	} catch (err) {
		console.error(err);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
