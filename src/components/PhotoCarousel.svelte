<script lang="ts">
	import Carousel from 'svelte-carousel';

	import { onMount } from 'svelte';

	let isClient = false;

	onMount(() => {
		isClient = true;
	});
</script>

{#if isClient}
	<Carousel particlesToShow={3} particlesToScroll={1} dots={false}>
		<slot />
	</Carousel>
{:else}
	<slot />
{/if}
