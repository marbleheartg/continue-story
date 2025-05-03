"use client";

import { login } from "@/lib/auth/login";
import { updateStore } from "@/store";
import { generateNonce } from "@farcaster/auth-client";
import sdk from "@farcaster/frame-sdk";
import { useEffect } from "react";
import Button from "./components/Button";
import Header from "./components/Header";
import Scroll from "./components/Scroll";

export default function Home() {
	useEffect(() => {
		init();
	}, []);

	return (
		<div onDragStart={e => e.preventDefault()}>
			<Header />
			<main>
				<Scroll />
				<Button />
			</main>
		</div>
	);
}

async function init() {
	const context = await sdk.context;

	updateStore({
		user: context.user,
	});

	const nonce = generateNonce();

	await sdk.actions.ready({ disableNativeGestures: true });

	try {
		const { message, signature } = await sdk.actions.signIn({
			nonce,
		});

		const { session } = await login(message, signature, nonce);

		updateStore(prev => ({
			user: {
				...prev.user,
				session,
			},
		}));
	} catch (error) {
		console.error(error);
		await sdk.actions.close();
	}
}
