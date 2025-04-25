import { MyStore } from "@/types";
import { create } from "zustand";

export const store = create<MyStore>(set => ({
	newStoryPart: {
		text: "",
		createdAt: new Date(),
	},
	rules: {
		enabled: false,
		text: `Write one sentence to spark a fun short story — the more creative, the better! Each like the authors get earns them 1 point. The story is limited to 5 sentences. Let’s have fun! ♡`,
	},
	scrollOpen: true,
	scrollVisible: true,

	updateStore: newState =>
		set(prev =>
			typeof newState === "function"
				? { ...prev, ...newState(prev) }
				: { ...prev, ...newState }
		),
}));

export const updateStore = store.getState().updateStore;
