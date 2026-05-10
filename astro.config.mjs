import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://drbaher-cli-site.vercel.app',
  integrations: [tailwind()],
  build: {
    format: 'directory',
  },
  compressHTML: true,
});
