"use client";

import { store } from "@/store";
import sdk from "@farcaster/frame-sdk";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import Button from "./components/Button";
import Header from "./components/Header";
import Scroll from "./components/Scroll";

// Поставить React Query, вынести лишний текст в lib
// Проверять пользователя на подпись для достоверности данных
// Добавить коллекции users, stories, глянуть пример из папки
// использовать uuid для всего, удобно добавлять для ссылок

export default function Home() {
	const bgSoundRef = useRef<HTMLAudioElement | null>(null);

	useQuery({
		queryKey: ["user"],
		queryFn: async () => {
			const context = await sdk.context;

			store.setState(state => ({
				...state,
				user: context.user,
			}));
		},
	});

	useEffect(() => {
		const audioCtx = new AudioContext();
		bgSoundRef.current = new Audio("/sounds/bg.wav");
		bgSoundRef.current.loop = true;
		const source = audioCtx.createMediaElementSource(bgSoundRef.current);
		const gainNode = audioCtx.createGain();
		gainNode.gain.value = 0.1;
		source.connect(gainNode).connect(audioCtx.destination);
		bgSoundRef.current.play().catch(console.warn);

		sdk.actions.ready({ disableNativeGestures: true });
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
