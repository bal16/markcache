import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    preset: 'vercel',
    static: true,
    prerender: {
      routes: ['/api/search.json'],
    },
  },
  compatibilityDate: '2025-07-15',
  ssr: true,
  app: {
    head: {
      // ADR-003 #6: '%s — MarkCache' (perbaiki `MarkCache${title}` tanpa spasi)
      titleTemplate: '%s — MarkCache',
      htmlAttrs: { lang: 'id' },
    },
  },
  devtools: { enabled: true },
  css: ['@/assets/main.css'],
  vite: { plugins: [tailwindcss()] },
  modules: ['shadcn-nuxt', '@nuxt/content', '@nuxtjs/color-mode', '@vite-pwa/nuxt'],
  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
          },
          langs: ['js', 'ts', 'vue', 'json', 'bash', 'yaml', 'html', 'css'],
        },
      },
    },
  },

  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: '@/components/ui',
  },

  colorMode: {
    classSuffix: '',
    fallback: 'dark',
  },

  routeRules: {
    '/**': { prerender: true },
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'MarkCache — Direktori Kurasi Link',
      short_name: 'MarkCache',
      description: 'Direktori kurasi link ala FMHY, ID-first: streaming, downloading, dan lainnya.',
      lang: 'id',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: '#0b1020',
      theme_color: '#0b1020',
      icons: [
        { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        {
          src: '/pwa-512x512-maskable.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    experimental: {
      // Nuxt SSG fetch _payload.json dengan query param; handler ini
      // membuatnya resolve saat offline.
      enableWorkboxPayloadQueryParams: true,
    },
    workbox: {
      // Precache seluruh output statis (HTML per route + aset).
      globPatterns: ['**/*.{js,css,html,ico,png,svg,json,webmanifest}'],
      // Multi-page statis: jangan fallback SPA ke index.html.
      navigateFallback: null,
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      skipWaiting: true,
    },
    devOptions: {
      enabled: true,
    },
  },
})
