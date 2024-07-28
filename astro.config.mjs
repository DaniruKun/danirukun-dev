import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";

import sanity from "@sanity/astro";

// https://astro.build/config
export default defineConfig({
  site: 'https://danirukun.com',
  integrations: [mdx(), sitemap(), tailwind(), svelte(), sanity({
    projectId: 'rq2xumfz',
    dataset: 'production',
  })]
});