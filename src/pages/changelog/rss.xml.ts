import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const entries = (await getCollection('changelog')).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  return rss({
    title: 'drbaher CLI suite — changelog',
    description:
      'Release notes for template-vault-cli, draft-cli, nda-review-cli, compare-cli, sign-cli, docx2pdf-cli, and the showcase site.',
    site: context.site!,
    items: entries.map((entry) => ({
      title: entry.data.title,
      pubDate: entry.data.date,
      description: entry.data.summary,
      link: `/changelog/#${entry.id}`,
      categories: [entry.data.cli, ...entry.data.tags],
    })),
    customData: '<language>en-us</language>',
  });
}
