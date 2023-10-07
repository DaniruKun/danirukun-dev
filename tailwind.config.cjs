import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: ['class'],
	theme: {
		container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
		extend: {
			colors: {
				border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
				borderRadius: {
					lg: "var(--radius)",
					md: "calc(var(--radius) - 2px)",
					sm: "calc(var(--radius) - 4px)"
				},
				fontFamily: {
					sans: ["Inter", ...fontFamily.sans]
				},
				'zinc': {
					'50': '#fafafa',
					'100': '#f4f4f5',
					'200': '#e4e4e7',
					'300': '#d4d4d8',
					'400': '#a1a1aa',
					'500': '#71717a',
					'600': '#52525b',
					'700': '#3f3f46',
					'800': '#27272a',
					'900': '#18181b',
					'950': '#09090b',
				},
			}
		},
	},
	plugins: [],
}
