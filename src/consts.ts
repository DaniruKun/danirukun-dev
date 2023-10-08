// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

import type { Socials } from "./types";

export const SITE_TITLE = 'DaniruKun';
export const SITE_DESCRIPTION = 'DaniruKun\'s dev lair';

export const PORTFOLIO_PROJECTS = [
	{
		title: 'DoKomi 2023 fanbooth website and HoloQuest stamp rally',
		description:
			'Website and PWA app with a digital stamp rally, with real-time events and virtual scoreboard.',
		link: {
			text: 'HoloQuest',
			url: 'https://www.hololivefanbooth.com'
		}
	},
	{
		title: 'Watson Industries project',
		description:
			'A fan website for Amelia Watson, a virtual YouTuber from Hololive EN. It features a stream tracker and a fanart showroom app.',
		link: {
			text: 'Watson Industries Website',
			url: 'https://www.watsonindustries.live'
		}
	},
	{
		title: 'AmeDoko Webapp',
		description:
			'A fan website for Amelia Watson, a virtual YouTuber from Hololive EN. It features a stream tracker and a fanart showroom app.',
		link: {
			text: 'AmeDoko',
			url: 'https://amedoko.watsonindustries.live'
		}
	},
	{
		title: 'HoloCure Save Transfer Tool',
		description: 'Transfer HoloCure save files between different PCs (and users!).',
		link: {
			text: 'HoloCure Save Transfer Tool',
			url: 'https://www.danpetrov.xyz/tasukeru'
		}
	},
	{
		title: 'SpaceX ISS Docking Sim Autopilot',
		description: 'Autopilot for the SpaceX ISS docking simulator web game.',
		link: {
			text: 'SpaceX ISS Docking Sim Autopilot',
			url: 'https://github.com/DaniruKun/spacex-iss-docking-sim-autopilot'
		}
	},
	{
		title: 'Siri Shortcuts for Emacs',
		description: 'Call Siri Shortcuts from Emacs.',
		link: {
			text: 'Siri Shortcuts for Emacs',
			url: 'https://github.com/DaniruKun/siri-shortcuts.el'
		}
	}
];

export const SOCIALS = {
	twitter: {
		url: 'https://twitter.com/DaniruKun',
		text: 'X / Twitter'
	},
	github: {
		url: 'https://github.com/danirukun',
		text: 'Github'
	},
	discord: {
		url: 'https://discord.gg/danirukun',
		text: 'Discord'
	},
	twitch: {
		url: 'https://www.twitch.tv/danirukun',
		text: 'Twitch'
	},
	youtube: {
		url: 'https://www.youtube.com/@danirukun',
		text: 'Youtube'
	},
} as Socials;