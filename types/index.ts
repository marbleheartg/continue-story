import { AccountLocation } from "@farcaster/frame-core/dist/context";

type DatabaseFields = {
	uuid?: string;
	createdAt?: Date;
};

export type User = {
	fid?: number;
	username?: string;
	displayName?: string;
	pfpUrl?: string;
	location?: AccountLocation;
	session?: string;
} & DatabaseFields & { lastLogged?: Date };

export type StoryPart = {
	fid?: number;
	text: string;
} & DatabaseFields;

export type fid = number;

export type Story = {
	parts: StoryPart[];
	likes: fid[];
} & DatabaseFields;
