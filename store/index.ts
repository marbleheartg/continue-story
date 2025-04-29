import { create } from "zustand";
import { StoreData } from "./types";

export const store = create<StoreData>(set => ({
	storyPart: {
		text: "",
	},
	rules: {
		enabled: false,
		text: `Write one sentence to spark a fun short story — the more creative, the better! Each like the authors get earns them 1 point. The story is limited to 5 sentences. Let’s have fun! ♡`,
	},
	scrollOpen: true,
	scrollVisible: false,

	updateStore: newState =>
		set(prev =>
			typeof newState === "function"
				? { ...prev, ...newState(prev) }
				: { ...prev, ...newState }
		),
}));

export const updateStore = store.getState().updateStore;
