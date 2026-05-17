import { defineCollection, z } from 'astro:content';

const changelog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    cli: z.enum(['draft-cli', 'nda-review-cli', 'sign-cli', 'docx2pdf-cli', 'site']),
    version: z.string().optional(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { changelog };
