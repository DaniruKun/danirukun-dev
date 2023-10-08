/** @type {import("prettier").Config} */
module.exports = {
  plugins: ['prettier-plugin-astro', 'prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
}