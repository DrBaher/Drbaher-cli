/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Warm off-white background and near-black text
        cream: {
          50: '#fdfcf9',
          100: '#faf8f3',
          200: '#f3efe5',
        },
        ink: {
          900: '#1a1612',
          800: '#2a2520',
          700: '#3d362f',
          600: '#5e544a',
          500: '#7a7066',
          400: '#9a9088',
        },
        // Forest/teal accent: confident, professional, no-flash
        accent: {
          50: '#e6f4ef',
          100: '#cfe9df',
          200: '#a3d3c0',
          300: '#6cb89c',
          400: '#3d9a78',
          500: '#1f7d5d',
          600: '#0f6e51',
          700: '#0c5642',
          800: '#0a4435',
          900: '#073629',
        },
        mint: {
          50: '#f0f9f5',
          100: '#dff2e8',
          200: '#c4e8d6',
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', '"Source Serif Pro"', 'Georgia', 'ui-serif', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', '"SF Mono"', 'Menlo', 'monospace'],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme('colors.ink.800'),
            maxWidth: 'none',
            a: {
              color: theme('colors.accent.600'),
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': { textDecoration: 'underline' },
            },
            'h1, h2, h3, h4': {
              fontFamily: theme('fontFamily.serif').join(', '),
              color: theme('colors.ink.900'),
              fontWeight: '600',
              letterSpacing: '-0.01em',
            },
            h1: { fontSize: '2.5rem', lineHeight: '1.15', marginBottom: '0.6em' },
            h2: { fontSize: '1.75rem', marginTop: '2em', marginBottom: '0.6em' },
            h3: { fontSize: '1.25rem', marginTop: '1.6em' },
            code: {
              backgroundColor: theme('colors.cream.200'),
              color: theme('colors.ink.900'),
              padding: '1px 6px',
              borderRadius: '3px',
              fontWeight: '400',
              fontSize: '0.9em',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            pre: {
              backgroundColor: theme('colors.ink.900'),
              color: theme('colors.cream.50'),
              borderRadius: '6px',
            },
            blockquote: {
              fontStyle: 'normal',
              fontWeight: '400',
              borderLeftColor: theme('colors.accent.600'),
              backgroundColor: theme('colors.mint.50'),
              padding: '0.75rem 1.25rem',
              borderRadius: '0 4px 4px 0',
              color: theme('colors.ink.800'),
            },
            'blockquote p:first-of-type::before': { content: '""' },
            'blockquote p:last-of-type::after': { content: '""' },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
