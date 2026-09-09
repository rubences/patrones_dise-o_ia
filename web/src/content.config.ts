import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const family = z.enum([
  'foundations',
  'agentic-workflows',
  'knowledge-context',
  'reasoning',
  'multi-agent',
  'safety-security',
  'reliability',
  'production-finops',
  'evaluation-qa',
  'human-experience',
]);

const patterns = defineCollection({
  loader: glob({ pattern: '**/*.md', base: '../content/patterns' }),
  schema: z.object({
    patternId: z.number().int().min(1).max(102),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(2),
    summary: z.string().min(20).max(240),
    family,
    legacyGroup: z.number().int().min(1).max(23),
    level: z.enum(['code', 'component', 'workflow', 'architecture', 'system']),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    maturity: z.enum(['foundational', 'established', 'emerging', 'experimental']),
    llmRequired: z.boolean(),
    stateful: z.boolean(),
    evidenceStatus: z.enum(['verified', 'partially-verified', 'needs-review']),
    sourceFile: z.string().regex(/^src\/pattern_[0-9]+_.*\.ts$/),
    tags: z.array(z.string()).min(1),
    related: z.array(z.number().int().min(1).max(102)).default([]),
    combinesWith: z.array(z.number().int().min(1).max(102)).default([]),
    antiPatterns: z.array(z.string()).default([]),
    references: z.array(z.string()).default([]),
  }),
});

export const collections = { patterns };
