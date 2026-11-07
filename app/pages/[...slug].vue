<script setup lang="ts">
import Footer from '~/components/Footer.vue'
import GoToTop from '~/components/GoToTop.vue'
import InlineToc from '~/components/InlineToc.vue'
import TableOfContents from '~/components/TableOfContents.vue'

const route = useRoute()
const { pageData: page } = await usePageData()
const contentBody = ref<HTMLElement | null>(null)

// Absolute dates are formatted at render (SSR/prerender) so they stay stable across days.
const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

function absoluteDate(iso?: string): string | null {
  if (!iso) return null
  const t = Date.parse(iso)
  return Number.isNaN(t) ? null : dateFormatter.format(t)
}

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Halaman tidak ditemukan',
  })
}

definePageMeta({
  layout: 'docs',
})

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

// Client-side per-link filter via ?tag=xxx.
// Lightweight parsing: hide li elements whose text does not contain the tag.
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
    <div class="grid grid-cols-1 xl:grid-cols-[1fr_250px] gap-10 p-6 w-full">
      <!-- Article column: article + footer in one cell so the ToC aside
           stretches to both heights, keeping the footer inside the sticky
           ToC range. -->
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
            <div>
              <p class="lead text-xl text-muted-foreground m-0">
                {{ page.description }}
              </p>
              <p
                v-if="page.updated || page.created"
                class="text-[11px] text-muted-foreground/60 mt-1.5 m-0"
              >
                <template v-if="page.updated">Diperbarui {{ absoluteDate(page.updated) }}</template>
                <template v-if="page.created">
                  <template v-if="page.updated"> · </template>Ditambahkan {{ absoluteDate(page.created) }}
                </template>
              </p>
            </div>
            <ShareButton class="shrink-0" />
          </div>
          <InlineToc
            v-if="page.body?.toc?.links?.length"
            :toc="page.body.toc"
          />
          <hr class="my-6" />
          <div ref="contentBody">
            <ContentRenderer :value="page" />
          </div>
        </template>
      </article>

        <!-- Docs page footer (moved from the layout so it falls inside the
             sticky ToC range; see the comment in app/layouts/docs.vue). -->
        <div class="mt-auto">
          <!-- End-of-reading action, available at every breakpoint. At tablet
               (md–xl) there is no ToC aside or drawer, so this is the only
               back-to-top control. -->
          <div class="flex justify-center pt-8 pb-8 md:justify-end">
            <GoToTop appearance="link" />
          </div>
          <Footer />
        </div>
      </div>

      <aside class="hidden xl:block h-full">
        <div class="sticky top-20 h-[calc(100vh-10rem)] overflow-y-auto w-62.5">
          <div class="">
            <TableOfContents
              v-if="page?.body?.toc?.links"
              :toc="page.body.toc"
            />
          </div>
          <div class="mt-6 border-t pt-4 space-y-2">
            <GoToTop class="w-full justify-start" />
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
