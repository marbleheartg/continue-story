import { UserContext } from "@farcaster/frame-core/dist/context";

type fid = number;
type StoryPart = string;

export type User = UserContext & {
	session: string;
};

export type Story = {
	uuid: string;
	parts: {
		fid: fid;
		text: StoryPart;
	}[];
	likes: fid[];
};

export type StoreData = {
	user?: User;
	story?: Story;
	storyPart: StoryPart;
	rules: { enabled: boolean; text: string };
	scrollOpen: boolean;
	scrollVisible: boolean;
	muted: boolean;
	updateStore: (
		newState: Partial<StoreData> | ((prev: StoreData) => Partial<StoreData>)
	) => void;
};
