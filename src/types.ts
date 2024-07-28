import { ANIMATIONS } from './consts';

export type Project = {
	name: string;
	description: string;
	projectURL?: string;
	slug: Slug;
};

export type Link = {
	text: string;
	url: string;
};

export type Slug = {
	current: string, _type: string
};

export type Socials = {
	twitter?: Link;
	github?: Link;
	discord?: Link;
	twitch?: Link;
	youtube?: Link;
};

export type AnimationUrl = typeof ANIMATIONS[keyof typeof ANIMATIONS];
