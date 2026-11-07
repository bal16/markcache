<script setup lang="ts">
import Footer from '~/components/Footer.vue'

definePageMeta({
  layout: 'docs',
})

useSeoMeta({
  title: 'Index',
  description:
    'Index semua kategori dan subkategori MarkCache — peta satu halaman untuk loncat langsung ke seksi yang dicari.',
  ogTitle: 'Index — MarkCache',
  ogDescription: 'Peta semua kategori dan subkategori dalam satu halaman.',
  twitterTitle: 'Index — MarkCache',
  twitterDescription: 'Peta semua kategori dan subkategori dalam satu halaman.',
})

// Grouping domain sama dengan landing (ADR-006, tampilan-only).
const DOMAIN_ORDER = ['hiburan', 'dev', 'utilitas', 'meta'] as const
const DOMAIN_LABEL: Record<string, string> = {
  hiburan: 'Hiburan',
  dev: 'Developer',
  utilitas: 'Utilitas',
  meta: 'Meta',
}

interface IndexPage {
  path: string
  title: string
  description?: string
  domain?: string
  body?: { toc?: { links?: Array<{ id?: string; text?: string; depth: number }> } }
}

const { data: pages } = await useAsyncData('directory', () => {
  return queryCollection('content')
    .where('featured', '=', true)
    .where('draft', '<>', true)
    .order('order', 'ASC')
    .all()
})

const groups = computed(() => {
  const cats = (pages.value ?? []) as IndexPage[]
  return DOMAIN_ORDER.map((domain) => ({
    domain,
    label: DOMAIN_LABEL[domain] ?? domain,
    items: cats.filter((c) => (c.domain ?? 'utilitas') === domain),
  })).filter((g) => g.items.length > 0)
})

// Subkategori (H2) dari toc — anchor id sama dengan heading di halaman.
function subcategories(page: IndexPage) {
  return (page.body?.toc?.links ?? [])
    .filter((l) => l.depth === 2 && l.id && l.text)
    .map((l) => ({ id: l.id as string, text: l.text as string }))
}
</script>

<template>
  <div class="container max-w-3xl px-6 py-12 lg:py-16 relative">
    <article class="prose prose-sm dark:prose-invert max-w-none prose-headings:scroll-m-20">
      <h1>Index</h1>
      <div class="not-prose mb-8">
        <p class="lead text-xl text-muted-foreground m-0">
          Peta semua kategori dan subkategori MarkCache — loncat langsung ke
          seksi yang dicari, tanpa buka halaman satu-satu.
        </p>
      </div>
      <hr class="my-6" />
      <section v-if="pages">
        <div v-for="group in groups" :key="group.domain">
          <h2>{{ group.label }}</h2>
          <ul>
            <li v-for="cat in group.items" :key="cat.path">
              <NuxtLink :to="cat.path">{{ cat.title }}</NuxtLink>
              <ul v-if="subcategories(cat).length">
                <li v-for="sub in subcategories(cat)" :key="sub.id">
                  <NuxtLink :to="`${cat.path}#${sub.id}`">{{ sub.text }}</NuxtLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </section>
    </article>

    <div class="mt-12">
      <Footer />
    </div>
  </div>
</template>
