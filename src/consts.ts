// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

import type { Socials } from "./types";

export const SITE_TITLE = 'DaniruKun';
export const SITE_DESCRIPTION = 'DaniruKun\'s Personal Website';

export const PORTFOLIO_PROJECTS = [
	{
		title: 'LiveTL Website Rebuild',
		description: 'Rebuild of the LiveTL website, a collection of browser extensions for foreign language streams.',
		link: {
			text: 'LiveTL Website',
			url: 'https://livetl.app'
		}
	},
	{
		title: 'Haato\'s Diary Visual Novel',
		description: 'I worked as the UI programmer and QA for the visual novel Haato\'s Diary, a fan project for Haachama from Hololive.',
		link: {
			text: 'Haato\'s Diary on Itch',
			url: 'https://wws-haato.itch.io/haatos-diary'
		}
	},
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
	},
	{
		title: 'Holodex Elixir client',
		description: 'A Hex package for convenient access to the Holodex API.',
		link: {
			text: 'Holodex Elixir client on Github',
			url: 'https://github.com/DaniruKun/ex-holodex'
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

export const MODELS = {
	'danirukun-vrm-arkit': '/assets/models/DaniruKun - Catboy - ARKit.vrm',
	'ceiling-light': '/assets/models/Ceiling Light.glb',
	'bed-single': '/assets/models/Bed Single.glb',
	'desk': '/assets/models/Desk.glb',
	'smol-ame-low-poly': '/assets/models/smol_ame_low_poly-v1.glb',
	'neco-arc-dakimakura': '/assets/models/neco-arc_dakimakura-v1.glb',
	'painting-cow': '/assets/models/Painting.glb',
	'painting-mountains': '/assets/models/Wall painting.glb',
	'katana': '/assets/models/Katana.glb',
	'camera': '/assets/models/Camera.glb',
	'airship': '/assets/models/Airship.glb',
} as const;

export const ANIMATIONS = {
	'breathing-idle': '/assets/animations/Breathing Idle.fbx',
	'silly-dancing': '/assets/animations/Silly Dancing.fbx',
	'flair': '/assets/animations/Flair.fbx',
	'swimming': '/assets/animations/Swimming.fbx',
	'typing': '/assets/animations/Typing.fbx',
} as const;

export const TEXTURES = {
	'light-wood-laminate': '/assets/textures/light-wood-laminate.jpg',
	'grunge-concrete-cement': '/assets/textures/old-grey-wall-grunge-concrete-background-with-natural-cement-texture.jpg',
}

/**
 * A map from Mixamo rig name to VRM Humanoid bone name
 */
export const mixamoVRMRigMap = {
	mixamorigHips: 'hips',
	mixamorigSpine: 'spine',
	mixamorigSpine1: 'chest',
	mixamorigSpine2: 'upperChest',
	mixamorigNeck: 'neck',
	mixamorigHead: 'head',
	mixamorigLeftShoulder: 'leftShoulder',
	mixamorigLeftArm: 'leftUpperArm',
	mixamorigLeftForeArm: 'leftLowerArm',
	mixamorigLeftHand: 'leftHand',
	mixamorigLeftHandThumb1: 'leftThumbMetacarpal',
	mixamorigLeftHandThumb2: 'leftThumbProximal',
	mixamorigLeftHandThumb3: 'leftThumbDistal',
	mixamorigLeftHandIndex1: 'leftIndexProximal',
	mixamorigLeftHandIndex2: 'leftIndexIntermediate',
	mixamorigLeftHandIndex3: 'leftIndexDistal',
	mixamorigLeftHandMiddle1: 'leftMiddleProximal',
	mixamorigLeftHandMiddle2: 'leftMiddleIntermediate',
	mixamorigLeftHandMiddle3: 'leftMiddleDistal',
	mixamorigLeftHandRing1: 'leftRingProximal',
	mixamorigLeftHandRing2: 'leftRingIntermediate',
	mixamorigLeftHandRing3: 'leftRingDistal',
	mixamorigLeftHandPinky1: 'leftLittleProximal',
	mixamorigLeftHandPinky2: 'leftLittleIntermediate',
	mixamorigLeftHandPinky3: 'leftLittleDistal',
	mixamorigRightShoulder: 'rightShoulder',
	mixamorigRightArm: 'rightUpperArm',
	mixamorigRightForeArm: 'rightLowerArm',
	mixamorigRightHand: 'rightHand',
	mixamorigRightHandPinky1: 'rightLittleProximal',
	mixamorigRightHandPinky2: 'rightLittleIntermediate',
	mixamorigRightHandPinky3: 'rightLittleDistal',
	mixamorigRightHandRing1: 'rightRingProximal',
	mixamorigRightHandRing2: 'rightRingIntermediate',
	mixamorigRightHandRing3: 'rightRingDistal',
	mixamorigRightHandMiddle1: 'rightMiddleProximal',
	mixamorigRightHandMiddle2: 'rightMiddleIntermediate',
	mixamorigRightHandMiddle3: 'rightMiddleDistal',
	mixamorigRightHandIndex1: 'rightIndexProximal',
	mixamorigRightHandIndex2: 'rightIndexIntermediate',
	mixamorigRightHandIndex3: 'rightIndexDistal',
	mixamorigRightHandThumb1: 'rightThumbMetacarpal',
	mixamorigRightHandThumb2: 'rightThumbProximal',
	mixamorigRightHandThumb3: 'rightThumbDistal',
	mixamorigLeftUpLeg: 'leftUpperLeg',
	mixamorigLeftLeg: 'leftLowerLeg',
	mixamorigLeftFoot: 'leftFoot',
	mixamorigLeftToeBase: 'leftToes',
	mixamorigRightUpLeg: 'rightUpperLeg',
	mixamorigRightLeg: 'rightLowerLeg',
	mixamorigRightFoot: 'rightFoot',
	mixamorigRightToeBase: 'rightToes',
} as const;
