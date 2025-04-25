import { AccountLocation } from "@farcaster/frame-core/dist/context";

export type MyStore = {
	user?: User;
	story?: Story;
	newStoryPart: NewStoryPart;
	rules: { enabled: boolean; text: string };
	scrollOpen: boolean;
	scrollVisible: boolean;
	updateStore: (
		newState: Partial<MyStore> | ((prev: MyStore) => Partial<MyStore>)
	) => void;
};

// подумать убрать дб поля или нет

export type User = {
	uuid?: string;
	fid?: string | number;
	username?: string;
	displayName?: string;
	pfpUrl?: string;
	location?: AccountLocation;
	session?: string;
	createdAt?: Date;
};

export type NewStoryPart = {
	uuid?: string;
	fid?: string;
	text: string;
	createdAt?: Date;
};

export type Story = {
	uuid?: string;
	parts?: NewStoryPart[];
	createdAt?: Date;
};
