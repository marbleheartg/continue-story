import { store, updateStore } from "@/store";

export default async function getStory() {
	const { rules } = store.getState();

	if (rules.enabled) {
		updateStore(prev => ({
			rules: { enabled: false, text: prev.rules.text },
		}));
	} else {
		try {
			const res = await fetch("/api/story");

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
		}
	}
}
