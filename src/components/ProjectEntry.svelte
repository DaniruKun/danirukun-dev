<script lang="ts">
	import type { Link } from '../types';

	export let title: string;
	export let description: string;
	export let link: Link | undefined = undefined;
</script>

{#if link !== undefined}
	<a href={link.url} class="no-underline" aria-label={link.text}>
		<section
			class="rounded-sm h-full bg-zinc-950 text-slate-100 drop-shadow-sm transition-all hover:-translate-y-2 hover:drop-shadow-xl"
		>
			<h2 class="rounded-sm bg-zinc-900 p-4 text-2xl font-bold text-slate-100">{title}</h2>
			<p class="p-4 text-base font-light">{description}</p>
		</section>
	</a>
{:else}
	<section
		class="rounded-sm bg-zinc-950 text-slate-100 drop-shadow-sm transition-all hover:-translate-y-2 hover:drop-shadow-xl"
	>
		<h2 class="rounded-sm bg-zinc-900 p-4 text-2xl font-bold text-slate-100">{title}</h2>
		<p class="p-4 text-base font-light">{description}</p>
	</section>
{/if}
