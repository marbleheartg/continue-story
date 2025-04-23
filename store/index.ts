import { User } from "@/types";
import { Store } from "@tanstack/store";

type MyStore = {
	user?: User;
	story?: string;
	continue: string;
	rules: { enabled: boolean; text: string };
	scrollOpen: boolean;
	scrollAnimationDone: boolean;
};

export const store = new Store<MyStore>({
	story:
		"One rainy afternoon, Emma found an old, rusty key while walking through the park.",
	continue: "",
	rules: {
		enabled: false,
		text: "No rules! Though you get 1 point for each like from others.",
	},
	scrollOpen: true,
	scrollAnimationDone: true,
});

store.subscribe(() => {
	console.log("Change:", store.state);
});
