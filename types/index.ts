import { AccountLocation } from "@farcaster/frame-core/dist/context";

type DatabaseFields = {
	uuid?: string;
	createdAt?: Date;
	lastLogged?: Date;
};

export type User = {
	session?: string;
	fid?: number;
	username?: string;
	displayName?: string;
	pfpUrl?: string;
	location?: AccountLocation;
} & DatabaseFields;

export type StoryPart = {
	fid?: number;
	text: string;
} & DatabaseFields;

export type fid = number;

export type Story = {
	parts: StoryPart[];
	likes: fid[];
} & DatabaseFields;
