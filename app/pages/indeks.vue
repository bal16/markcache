<script setup lang="ts">
import Footer from '~/components/Footer.vue'

definePageMeta({
  layout: 'docs',
})

useSeoMeta({
  title: 'Indeks',
  description:
    'Indeks semua kategori dan subkategori MarkCache — peta satu halaman untuk loncat langsung ke seksi yang dicari.',
  ogTitle: 'Indeks — MarkCache',
  ogDescription: 'Peta semua kategori dan subkategori dalam satu halaman.',
  twitterTitle: 'Indeks — MarkCache',
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

interface IndeksPage {
  path: string
  title: string
  description?: string
  domain?: string
  body?: { toc?: { links?: Array<{ id?: string; text?: string; depth: number }> } }
}

const { data: pages } = await useAsyncData('indeks', () => {
  return queryCollection('content')
    .where('featured', '=', true)
    .where('draft', '<>', true)
    .order('order', 'ASC')
    .all()
})

const groups = computed(() => {
  const cats = (pages.value ?? []) as IndeksPage[]
  return DOMAIN_ORDER.map((domain) => ({
    domain,
    label: DOMAIN_LABEL[domain] ?? domain,
    items: cats.filter((c) => (c.domain ?? 'utilitas') === domain),
  })).filter((g) => g.items.length > 0)
})

// Subkategori (H2) dari toc — anchor id sama dengan heading di halaman.
function subcategories(page: IndeksPage) {
  return (page.body?.toc?.links ?? [])
    .filter((l) => l.depth === 2 && l.id && l.text)
    .map((l) => ({ id: l.id as string, text: l.text as string }))
}
</script>

<template>
  <div class="container max-w-3xl py-6 lg:py-8">
    <article class="prose prose-sm dark:prose-invert max-w-none prose-headings:scroll-m-20">
      <h1>Indeks</h1>
      <p class="lead text-xl text-muted-foreground m-0 not-prose">
        Peta semua kategori dan subkategori MarkCache — loncat langsung ke
        seksi yang dicari, tanpa buka halaman satu-satu.
      </p>
      <hr class="my-6" />
    </article>

    <section v-if="pages" class="mt-2 space-y-10">
      <div v-for="group in groups" :key="group.domain">
        <h2 class="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
          {{ group.label }}
        </h2>
        <div class="grid gap-4">
          <div
            v-for="cat in group.items"
            :key="cat.path"
            class="rounded-xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 p-5"
          >
            <NuxtLink
              :to="cat.path"
              class="text-base font-semibold text-foreground transition-colors hover:text-primary"
            >
              {{ cat.title }}
            </NuxtLink>
            <div v-if="subcategories(cat).length" class="mt-3 flex flex-wrap gap-1.5">
              <NuxtLink
                v-for="sub in subcategories(cat)"
                :key="sub.id"
                :to="`${cat.path}#${sub.id}`"
                class="text-[12px] px-2.5 py-1 rounded-md bg-black/5 dark:bg-white/10 text-muted-foreground transition-colors hover:bg-primary/15 hover:text-primary"
              >
                {{ sub.text }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
    <p v-else class="text-muted-foreground">Indeks belum tersedia.</p>

    <div class="mt-12">
      <Footer />
    </div>
  </div>
</template>
