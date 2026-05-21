import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkCliLinks from './src/plugins/remark-cli-links.js';

// https://astro.build/config
export default defineConfig({
  site: 'https://cli.drbaher.com',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/og/'),
    }),
  ],
  build: {
    format: 'directory',
  },
  compressHTML: true,
  markdown: {
    remarkPlugins: [remarkCliLinks],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: { className: ['heading-anchor'], 'aria-label': 'Permalink to this heading' },
          content: { type: 'text', value: '#' },
        },
      ],
    ],
  },
});
