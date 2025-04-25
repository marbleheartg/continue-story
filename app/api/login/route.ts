import { domain } from "@/config";
import clientPromise from "@/lib/mongodb";
import { User } from "@/types";
import { createAppClient, viemConnector } from "@farcaster/auth-client";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const appClient = createAppClient({
			relay: "https://relay.farcaster.xyz",
			ethereum: viemConnector(),
		});

		const {
			message,
			signature,
			nonce,
		}: { message: string; signature: `0x${string}`; nonce: string } =
			await req.json();

		const { data, success, fid, isError, error } =
			await appClient.verifySignInMessage({
				message,
				signature,
				nonce,
				domain,
			});

		if (!success) {
			console.error("Farcaster login error:", error);
			return new NextResponse("Unsuccessful login", { status: 400 });
		}

		const client = await clientPromise;
		const db = client.db("main");
		const users = db.collection<User>("users");

		await users.updateOne(
			{ fid: fid.toString() },
			{
				$setOnInsert: {
					uuid: randomUUID(),
					fid: fid.toString(),
					createdAt: new Date(),
				},
			},
			{ upsert: true }
		);

		const payload = {
			fid,
			iat: Math.floor(Date.now() / 1000),
		};

		const secret = process.env.JWT_SECRET!;

		const session = jwt.sign(payload, secret, {
			expiresIn: "1 day",
		});

		return NextResponse.json({ success: true, session });
	} catch (err) {
		console.error("POST /api/story error:", err);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

// 0x3dc6bb57e5f11318c4a8c8b831ea149490e07c6e615a778dee2ef3505084b0015027b507e40cd5141ac889db5f8feb8564ff9c656b2b189d5466cf20f3635ab61c
// SiweMessage {
//   scheme: undefined,
//   domain: 'fcc-ram-shaft-botswana.trycloudflare.com',
//   address: '0x0f265f15C3AA26aCfD5A6d40eC0A20f51656Cad5',
//   statement: 'Farcaster Auth',
//   uri: 'https://fcc-ram-shaft-botswana.trycloudflare.com/',
//   version: '1',
//   nonce: 'Hj8xeQGeP8Gb',
//   issuedAt: '2025-04-23T20:49:19.047Z',
//   expirationTime: undefined,
//   notBefore: undefined,
//   requestId: undefined,
//   chainId: 10,
//   resources: [ 'farcaster://fid/1021214' ]
// } true 1021214 false undefined
