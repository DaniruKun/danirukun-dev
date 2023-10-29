<script lang="ts">
	import ProjectEntry from './ProjectEntry.svelte';
	import type { Project } from '../types';

	export let projects: Project[];
</script>

<section class="grid grid-cols-1 gap-4 bg-background md:grid-cols-2 px-2">
	{#each projects as project}
		<ProjectEntry {...project} />
	{/each}
</section>
