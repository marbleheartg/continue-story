import { store, updateStore } from "@/store";
import Image from "next/image";

const Button = () => {
	const { rules, scrollOpen, scrollVisible } = store();
	// const [loading, setLoading] = useState(false);

	// TODO: Animation after getting a new story

	return (
		<div className="fixed bottom-13 left-0 right-0 w-full flex justify-center pointer-events-auto">
			<button
				className="flex justify-center w-11/12 py-2.5 bg-white rounded-3xl cursor-pointer"
				onClick={async () => {
					const { rules, user, story, newStoryPart } = store.getState();

					if (rules.enabled) {
						updateStore(prev => ({
							rules: { enabled: false, text: prev.rules.text },
						}));
					} else {
						try {
							// setLoading(true);

							updateStore({
								scrollOpen: false,
							});

							let res = await fetch("/api/story", {
								method: "POST",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify({
									story,
									newStoryPart,
									session: user?.session,
								}),
							});

							if (!res.ok) {
								updateStore({
									scrollOpen: true,
								});
								throw new Error("Failed to send story");
							}

							res = await fetch("/api/story");

							const { randStory } = await res.json();

							updateStore({
								story: randStory,
								newStoryPart: { text: "" },
							});

							updateStore({
								scrollOpen: true,
							});
						} catch (err) {
							console.error(err);
						} finally {
							// setLoading(false);
						}
					}
				}}
				disabled={!scrollOpen || !scrollVisible}
			>
				{rules.enabled ? (
					<Image src="/images/arrow.png" alt="arrow" width={32} height={32} />
				) : !scrollOpen || !scrollVisible ? (
					<span>...</span>
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
