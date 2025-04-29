import getStory from "@/lib/api/getStory";
import postStory from "@/lib/api/postStory";
import { store, updateStore } from "@/store";
import { delay } from "@/utils/delay";
import Image from "next/image";

const Button = () => {
	const { rules, scrollOpen } = store();

	const isDisabled = !scrollOpen;

	async function handleClick() {
		const { user, story, storyPart } = store.getState();

		updateStore({ scrollOpen: false });

		try {
			if (rules.enabled) {
				updateStore(prev => ({
					rules: { ...prev.rules, enabled: false },
				}));
			} else {
				if (story?.uuid && user?.session)
					await postStory(story?.uuid, storyPart.text, user?.session);
				else throw new Error("Not enough data");

				const { story: newStory } = await getStory();

				updateStore({ story: newStory });
			}
		} catch (error) {
		} finally {
			await delay(1500);
			updateStore({ scrollOpen: true });
		}
	}

	return (
		<div className="fixed bottom-13 left-0 right-0 w-full flex justify-center pointer-events-auto">
			<button
				className={`flex justify-center w-11/12 py-2.5 rounded-3xl transition-[background-color,opacity] duration-300 cursor-pointer ${
					isDisabled ? "bg-gray-300" : "bg-white"
				}`}
				onClick={handleClick}
				disabled={isDisabled}
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
