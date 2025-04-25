"use client";

import { updateStore } from "@/store";
import { generateNonce } from "@farcaster/auth-client";
import sdk from "@farcaster/frame-sdk";
import { useEffect } from "react";
import Button from "./components/Button";
import Header from "./components/Header";
import Scroll from "./components/Scroll";

export default function Home() {
	// const bgSoundRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		// const audioCtx = new AudioContext();
		// bgSoundRef.current = new Audio("/sounds/bg.wav");
		// bgSoundRef.current.loop = true;
		// const source = audioCtx.createMediaElementSource(bgSoundRef.current);
		// const gainNode = audioCtx.createGain();
		// gainNode.gain.value = 0.1;
		// source.connect(gainNode).connect(audioCtx.destination);
		// bgSoundRef.current.play().catch(console.warn);

		async function init() {
			const context = await sdk.context;

			updateStore({
				user: context.user,
			});

			const nonce = generateNonce();

			await sdk.actions.ready({ disableNativeGestures: true });

			const { message, signature } = await sdk.actions.signIn({
				nonce,
			});

			const res = await fetch("/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					message,
					signature,
					nonce,
				}),
			});

			const { session }: { session: string } = await res.json();

			updateStore(prev => ({
				user: {
					...prev.user,
					session,
				},
			}));
		}

		init();
	}, []);

	return (
		<>
			<Header />
			<main>
				<Scroll />
				<Button />
			</main>
		</>
	);
}
