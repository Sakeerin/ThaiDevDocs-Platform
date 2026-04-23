import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

const docsPageSchema = pageSchema.extend({
  topic: z.enum(['laravel', 'vue', 'devops', 'ai', 'thai-context']),
  subtopic: z.string().min(1),
  tags: z.array(z.string()).default([]),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  laravel_version: z.string().optional(),
  vue_version: z.string().optional(),
  verified_at: z.string(),
  author: z.string().min(1),
  contributors: z.array(z.string()).default([]),
  reading_time: z.number().int().positive().optional(),
  is_premium: z.boolean().default(false),
});

export type DocsPageFrontmatter = z.infer<typeof docsPageSchema>;

// You can customize Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: docsPageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
