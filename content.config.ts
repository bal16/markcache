import { defineCollection, defineContentConfig } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: {
        include: '**/*.md',
        exclude: ['**/.obsidian/**', '**/_templates/**', '**/_*.md'],
      },
    }),
  },
})
