<script lang="ts">
import Icon from 'svelte-awesome';

import github from 'svelte-awesome/icons/github';
import twitter from 'svelte-awesome/icons/twitter';
import twitch from 'svelte-awesome/icons/twitch';
import youtubePlay from 'svelte-awesome/icons/youtubePlay';

import { faDiscord } from '@fortawesome/free-brands-svg-icons/faDiscord';
import type { Socials } from '../types';

export let socials: Socials;
</script>

<div class="flex flex-row place-content-center space-x-4 align-middle place-items-center">
	{#if socials.twitter !== undefined}		
	<a href={socials.twitter.url} target="_blank" rel="noopener noreferrer" class="hover:text-blue-400 transition-colors">
				<Icon data={twitter} scale={2} />
				</a>
	{/if}
	{#if socials.github !== undefined}
	<a href={socials.github.url} target="_blank" rel="noopener noreferrer" class="hover:text-zinc-400 transition-colors">
	<Icon data={github} scale={2} />
	</a>
	{/if}
	{#if socials.discord !== undefined}
	<a href={socials.discord.url} target="_blank" rel="noopener noreferrer" class="hover:text-indigo-400 transition-colors">
	<Icon data={faDiscord} scale={2} />
	</a>
	{/if}
	{#if socials.twitch !== undefined}
	<a href={socials.twitch.url} target="_blank" rel="noopener noreferrer" class="hover:text-purple-400 transition-colors">
	<Icon data={twitch} scale={2} />
	</a>
	{/if}
	{#if socials.youtube !== undefined}
	<a href={socials.youtube.url} target="_blank" rel="noopener noreferrer" class="hover:text-red-400 transition-colors">
	<Icon data={youtubePlay} scale={2} />
	</a>
	{/if}
</div>
