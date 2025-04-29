import { Story, StoryPart, User } from "@/types";

export type StoreData = {
	user?: User;
	story?: Story;
	storyPart: StoryPart;
	rules: { enabled: boolean; text: string };
	scrollOpen: boolean;
	scrollVisible: boolean;
	updateStore: (
		newState: Partial<StoreData> | ((prev: StoreData) => Partial<StoreData>)
	) => void;
};
