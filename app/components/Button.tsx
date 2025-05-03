import getStory from "@/lib/api/getStory";
import postStory from "@/lib/api/postStory";
import { initScroll } from "@/lib/audio/scroll";
import { store, updateStore } from "@/store";
import { delay } from "@/utils/delay";
import Image from "next/image";
import { useEffect, useRef } from "react";

const Button = () => {
	const { rules, scrollOpen, muted } = store();

	const scrollSoundRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		initScroll(scrollSoundRef);
	}, []);

	async function handleClick() {
		const { user, story, storyPart } = store.getState();

		if (!muted) scrollSoundRef?.current?.play().catch(console.warn);

		updateStore({ scrollOpen: false });

		try {
			if (rules.enabled) {
				updateStore(prev => ({
					rules: { ...prev.rules, enabled: false },
				}));
			} else if (storyPart) {
				if (story?.uuid && user?.session)
					await postStory(story?.uuid, storyPart, user?.session);
				else throw new Error("Not enough data");

				const { story: newStory } = await getStory();

				updateStore({
					story: newStory,
					storyPart: "",
				});
			}
		} catch (error) {
		} finally {
			await delay(2000);
			updateStore({ scrollOpen: true });
		}
	}

	return (
		<div className="fixed bottom-15 left-5 right-5">
			<button
				className={`flex justify-center w-full py-2.5 rounded-3xl transition-[background-color,opacity] duration-300 cursor-pointer ${
					!scrollOpen ? "bg-gray-300" : "bg-white"
				}`}
				onClick={handleClick}
				disabled={!scrollOpen}
			>
				{rules.enabled ? (
					<Image src="/images/arrow.png" alt="arrow" width={32} height={32} />
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
	);
};

export default Button;
