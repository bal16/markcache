<script setup lang="ts">
import 'vue-sonner/style.css'
import PwaFeedback from '~/components/PwaFeedback.client.vue'
import { Toaster } from '~/components/ui/sonner'

const siteUrl = 'https://markcache.vercel.app'
const route = useRoute()
const canonicalUrl = computed(() => new URL(route.path, siteUrl).toString())

useSeoMeta({
  ogType: 'website',
  ogUrl: () => canonicalUrl.value,
  ogSiteName: 'MarkCache',
  ogLocale: 'id_ID',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'MarkCache, direktori tautan terkurasi untuk pengguna Indonesia',
  twitterCard: 'summary_large_image',
  twitterImageAlt: 'MarkCache, direktori tautan terkurasi untuk pengguna Indonesia',
})

useHead({
  link: [
    { rel: 'canonical', href: () => canonicalUrl.value },
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
  ],
  script: [
    {
      key: 'website-jsonld',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: 'MarkCache',
        description:
          'MarkCache, direktori tautan gratis ala FMHY yang dikurasi manual untuk pengguna Indonesia. Dari streaming dan anime sampai dev tools.',
        inLanguage: 'id',
      }),
    },
  ],
})
</script>

<template>
  <NuxtPwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster position="bottom-center" close-button close-button-position="top-right" />
  <PwaFeedback />
</template>
