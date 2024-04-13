<script lang="ts">
	import type { Link } from '../types';

	export let title: string;
	export let description: string;
	export let link: Link | undefined = undefined;
</script>

{#if link !== undefined}
	<a href={link.url} class="no-underline" aria-label={link.text}>
		<section
			class="h-full space-y-4 rounded-sm p-4 border-[1px] transition-all hover:drop-shadow-sm hover:bg-slate-50"
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
		class="h-full space-y-4 rounded-sm p-4 border-[1px] transition-all hover:drop-shadow-sm hover:bg-slate-50"
	>
		<h2
			class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
		>
			{title}
		</h2>

		<p class="text-base font-light">{description}</p>
	</section>
{/if}
