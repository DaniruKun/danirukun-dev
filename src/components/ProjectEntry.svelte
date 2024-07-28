<script lang="ts">
	export let name: string;
	export let description: string;
	export let projectURL: string | undefined = undefined;
</script>

{#if projectURL !== undefined}
	<a href={projectURL} class="no-underline" aria-label={projectURL}>
		<section
			class="h-full space-y-4 rounded-sm p-4 border-[1px] transition-all hover:drop-shadow-sm hover:bg-slate-50"
		>
			<h2
				class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
			>
				{name}
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
			{name}
		</h2>

		<p class="text-base font-light">{description}</p>
	</section>
{/if}
