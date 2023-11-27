import { ANIMATIONS } from './consts';

export type Project = {
	title: string;
	description: string;
	link?: Link
};

export type Link = {
	text: string;
	url: string;
};

export type Socials = {
	twitter?: Link;
	github?: Link;
	discord?: Link;
	twitch?: Link;
	youtube?: Link;
};

export type AnimationUrl = typeof ANIMATIONS[keyof typeof ANIMATIONS];
