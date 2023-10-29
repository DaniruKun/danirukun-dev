<script lang="ts">
	import type { Link } from '../types';

	export let title: string;
	export let description: string;
	export let link: Link | undefined = undefined;
</script>

{#if link !== undefined}
	<a href={link.url} class="no-underline" aria-label={link.text}>
		<section
			class="h-full space-y-4 rounded-sm bg-primary p-4 text-primary-foreground drop-shadow-sm transition-all hover:-translate-y-2 hover:drop-shadow-xl"
		>
			<h2
				class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
			>
				{title}
			</h2>

			<p class="text-base font-light">{description}</p>
		</section>
	</a>
{:else}
	<section
		class="h-full space-y-4 rounded-sm bg-primary p-4 text-primary-foreground drop-shadow-sm transition-all hover:-translate-y-2 hover:drop-shadow-xl"
	>
		<h2
			class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
		>
			{title}
		</h2>

		<p class="text-base font-light">{description}</p>
	</section>
{/if}
