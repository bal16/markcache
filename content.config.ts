import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { defineSitemapSchema } from '@nuxtjs/sitemap/content'

// Schema longgar per ADR-003: semua field baru opsional + default, mutu
// ditegakkan oleh contentlint (scripts/contentlint.mjs), bukan validasi ketat.
export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: {
        include: '**/*.md',
        exclude: ['**/.obsidian/**', '**/_templates/**', '**/_*.md'],
      },
      schema: z.object({
        category: z.string().optional(),
        // ADR-006: kelompok top-level untuk grouping landing.
        // hiburan (streaming/torrenting/downloading) | dev | utilitas | meta
        domain: z.enum(['hiburan', 'dev', 'utilitas', 'meta']).optional().default('utilitas'),
        icon: z.string().optional(),
        tags: z.array(z.string()).optional().default([]),
        updated: z.string().optional(),
        // ADR-007? (metadata kesegaran): tanggal kategori pertama dibuka,
        // backfill dari git history. `updated` = revisi terakhir.
        created: z.string().optional(),
        draft: z.boolean().optional().default(false),
        featured: z.boolean().optional().default(false),
        order: z.number().optional(),
        // Sitemap integration via @nuxtjs/sitemap
        sitemap: defineSitemapSchema({
          name: 'content',
          filter: (entry) => !entry.draft && entry.featured,
        }),
      }),
    }),
  },
})
