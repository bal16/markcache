<script setup lang="ts">
import Footer from '~/components/Footer.vue'
import GoToTop from '~/components/GoToTop.vue'
import TableOfContents from '~/components/TableOfContents.vue'

const route = useRoute()
const { pageData: page } = await usePageData()
const contentBody = ref<HTMLElement | null>(null)

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Halaman tidak ditemukan',
  })
}

definePageMeta({
  layout: 'docs',
})

// SEO dasar: titleTemplate '%s — MarkCache' dipasang di
// nuxt.config, jadi di sini cukup kirim title halaman yang reaktif.
useSeoMeta({
  title: () => page.value?.title ?? 'Tidak ditemukan',
  description: () =>
    page.value?.description ?? 'Direktori tautan gratis terkurasi untuk pengguna Indonesia.',
  ogTitle: () => page.value?.title,
  ogDescription: () => page.value?.description,
  ogImageAlt: () =>
    `${page.value?.title ?? 'MarkCache'} — direktori link terkurasi untuk pengguna Indonesia`,
  twitterTitle: () => page.value?.title,
  twitterDescription: () => page.value?.description,
})

defineOgImage('MarkCache.satori', {
  title: page.value?.title ?? 'Tidak ditemukan',
  description:
    page.value?.description ?? 'Direktori tautan gratis terkurasi untuk pengguna Indonesia.',
})

// Filter per-link client-side via ?tag=xxx.
// Parsing ringan: li yang text-nya tak mengandung tag disembunyikan.
const activeTag = ref<string | null>(null)

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function applyTagFilter() {
  const tag = typeof route.query.tag === 'string' ? route.query.tag : ''
  activeTag.value = tag || null
  if (import.meta.server) return
  const items = document.querySelectorAll<HTMLElement>('#page-top article li')
  const pattern = tag ? new RegExp(`\\b${escapeRe(tag)}\\b`, 'i') : null
  items.forEach((el) => {
    el.style.display = !pattern || pattern.test(el.textContent ?? '') ? '' : 'none'
  })
}

function applyExternalLinkTargets() {
  contentBody.value?.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((link) => {
    const href = link.getAttribute('href') ?? ''
    if (!/^https?:\/\//i.test(href)) return
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
  })
}

watch(
  () => route.query.tag,
  async () => {
    await nextTick()
    applyTagFilter()
  }
)

onMounted(() => {
  applyTagFilter()
  applyExternalLinkTargets()
})

watch(
  () => page.value?.path,
  async () => {
    await nextTick()
    applyExternalLinkTargets()
  }
)
</script>

<template>
  <div id="page-top" class="container max-w-5xl py-6 lg:py-8 relative">
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-10 p-6 w-full">
      <!-- Kolom artikel: artikel + footer dalam 1 sel agar aside (ToC)
           melar setinggi keduanya — rentang sticky ToC mencakup footer. -->
      <div class="flex flex-col min-w-0">
        <article
          class="prose prose-sm dark:prose-invert max-w-none min-w-0 prose-headings:scroll-m-20"
        >
        <div
          v-if="activeTag"
          class="not-prose flex items-center gap-2 mb-6 px-4 py-2 rounded-lg border border-primary/40 bg-primary/5 text-sm"
        >
          <span>Memfilter tautan dengan tag <code>{{ activeTag }}</code></span>
          <NuxtLink :to="route.path" class="text-primary underline underline-offset-2 ml-auto">
            bersihkan
          </NuxtLink>
        </div>
        <template v-if="page">
          <h1>{{ page.title }}</h1>
          <div class="not-prose flex items-center justify-between gap-4 mb-8">
            <p class="lead text-xl text-muted-foreground m-0">
              {{ page.description }}
            </p>
            <ShareButton class="shrink-0" />
          </div>
          <hr class="my-6" />
          <div ref="contentBody">
            <ContentRenderer :value="page" />
          </div>
        </template>
      </article>

        <!-- Footer halaman docs (dipindah dari layout agar masuk rentang
             sticky ToC — lihat komentar di app/layouts/docs.vue). -->
        <div class="mt-auto">
          <Footer />
        </div>
      </div>

      <aside class="hidden lg:block h-full">
        <div class="sticky top-20 h-[calc(100vh-10rem)] overflow-y-auto w-62.5">
          <div class="">
            <TableOfContents
              v-if="page?.body?.toc?.links"
              :toc="page.body.toc"
            />
          </div>
          <div class="mt-6 border-t pt-4 space-y-2">
            <ShareButton class="w-full justify-start" />
            <GoToTop />
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
