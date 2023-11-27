# My personal website

## 🚀 Project Structure

Inside of the Astro project, you'll see the following folders and files:

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

The project also uses Svelte components, as well as `three.js` for stuff like the VRM avatar.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm run dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm run build`           | Build your production site to `./dist/`          |
| `pnpm run preview`         | Preview your build locally, before deploying     |
| `pnpm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm run astro -- --help` | Get help using the Astro CLI                     |

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).

### Model attributions

Desk by dook [CC-BY] via Poly Pizza

"Smol Ame (Low poly)" (https://skfb.ly/owpSr) by Hasksoft is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).

"Neco-Arc Dakimakura" (https://skfb.ly/oruvR) by K00NB0AT is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).

Painting by Jonathan Granskog [CC-BY] via Poly Pizza

Wall painting by jeremy [CC-BY] via Poly Pizza

Katana by dook [CC-BY] via Poly Pizza

Camera by Poly by Google [CC-BY] via Poly Pizza

Airship by Poly by Google [CC-BY] via Poly Pizza