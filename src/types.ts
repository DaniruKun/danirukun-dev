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