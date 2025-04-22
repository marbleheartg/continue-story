"use client";

import { User } from "@/types";
import sdk from "@farcaster/frame-sdk";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Poor_Story } from "next/font/google";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";

const poorStory = Poor_Story({
	weight: "400",
});

export default function Home() {
	const { data: user, isLoading } = useQuery<User>({
		queryKey: ["user"],
		queryFn: async (): Promise<User> => (await sdk.context).user as User,
		refetchOnWindowFocus: false,
	});

	const [text, setText] = useState(
		"One rainy afternoon, Emma found an old, rusty key while walking through the park." +
			" "
	);

	const [continuation, setContinuation] = useState("");

	const inputRef = useRef<HTMLTextAreaElement>(null);
	const penSoundRef = useRef<HTMLAudioElement | null>(null);
	const bgSoundRef = useRef<HTMLAudioElement | null>(null);

	const mutation = useMutation({
		mutationFn: async () =>
			fetch("/api/story", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ continuation }),
			}).then(res => {
				if (!res.ok) throw new Error("Failed to send");
				return res.json();
			}),
		onSuccess: data => {
			console.log("Saved!", data);
		},
		onError: error => {
			console.error("Error saving:", error);
		},
	});

	useEffect(() => {
		const context = new AudioContext();

		bgSoundRef.current = new Audio("/sounds/bg.wav");
		bgSoundRef.current.loop = true;

		const source = context.createMediaElementSource(bgSoundRef.current);
		const gainNode = context.createGain();
		gainNode.gain.value = 0.1;
		source.connect(gainNode).connect(context.destination);

		bgSoundRef.current.play().catch(console.warn);

		penSoundRef.current = new Audio("/sounds/pen.wav");

		sdk.actions.ready({ disableNativeGestures: true });
	}, []);

	return (
		<>
			<Header pfpUrl={user?.pfpUrl || "/images/profile.png"} />
			<main>
				<div className="fixed top-32 left-4 right-4 flex justify-center">
					<div className="relative max-w-sm w-full">
						<Image
							src="/images/scroll.png"
							alt="scroll"
							width={400}
							height={539}
							className="relative z-10"
						/>

						<div
							className={`absolute z-10 top-28 left-9 max-w-10/12 text-2xl leading-9 -rotate-1 ${poorStory.className}`}
							onClick={() => inputRef.current?.focus()}
						>
							<span>
								{text} {continuation}
								{" _ ("}
								<span className="inline-block blink">
									{30 - continuation.length}
								</span>
								{")"}
							</span>
							<textarea
								ref={inputRef}
								value={continuation}
								onKeyDown={e => {
									if (
										e.key !== "Backspace" &&
										penSoundRef.current &&
										penSoundRef.current.paused
									) {
										penSoundRef.current.currentTime = 0;
										penSoundRef.current.play().catch(console.warn);
									}
								}}
								onChange={e => {
									if (e.target.value.length >= 31) return;
									setContinuation(e.target.value);
								}}
								className="max-w-full focus:outline-none placeholder-black opacity-0 w-0 h-0"
								spellCheck={false}
								autoCorrect="off"
								autoCapitalize="off"
							/>
						</div>

						<div></div>

						<Image
							className="absolute z-10 bottom-[3.5%] right-[3%] cursor-pointer"
							src="/images/like.png"
							alt="like"
							width={49}
							height={49}
						/>

						<div className="absolute inset-10 shadow-[0_0_20px_50px_rgba(0,0,0,0.3)]"></div>
					</div>
				</div>

				<div className="fixed bottom-13 left-0 right-0 w-full flex justify-center pointer-events-auto">
					<button
						className="flex justify-center w-11/12 py-2.5 bg-white rounded-3xl cursor-pointer"
						onClick={() => mutation.mutate()}
						disabled={mutation.isPending}
					>
						{mutation.isPending ? (
							"..."
						) : (
							<Image
								src="/images/feather.png"
								alt="feather"
								width={32}
								height={32}
							/>
						)}
					</button>
				</div>
			</main>
		</>
	);
}
