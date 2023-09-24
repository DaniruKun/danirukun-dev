<script lang="ts">
    import type { Link } from "../types";

    export let title: string;
    export let description: string;
    export let link: Link | undefined = undefined;
</script>

{#if link !== undefined}
<a href={link.url} class="no-underline" aria-label={link.text}>
    <section
        class="bg-zinc-950 text-slate-100 border-2 rounded-sm drop-shadow-sm hover:drop-shadow-xl hover:scale-105 transition-all"
    >
        <h2 class="text-2xl text-slate-100 font-bold bg-zinc-900 p-4">{title}</h2>
        <p class="text-base font-light p-4">{description}</p>
    </section>
</a>
{:else}
<section
        class="bg-zinc-950 text-slate-100 border-2 rounded-sm drop-shadow-sm hover:drop-shadow-xl hover:scale-105 transition-all"
    >
        <h2 class="text-2xl text-slate-100 font-bold bg-zinc-900 p-4">{title}</h2>
        <p class="text-base font-light p-4">{description}</p>
</section>
{/if}
