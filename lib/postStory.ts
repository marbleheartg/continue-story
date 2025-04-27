import { store, updateStore } from "@/store";

export default async function postStory() {
	const { user, story, newStoryPart } = store.getState();

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
}
