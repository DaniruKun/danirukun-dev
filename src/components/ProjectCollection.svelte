<script lang="ts">

import ProjectEntry from "./ProjectEntry.svelte";
import type {Project} from "../types";

export let projects: Project[];
</script>

<section class="grid grid-cols-1 md:grid-cols-2 gap-4">
	{#each projects as project}
		<ProjectEntry {...project} />
	{/each}
</section>