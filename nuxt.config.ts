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
      // titleTemplate '%s — MarkCache' (perbaiki `MarkCache${title}` tanpa spasi)
      titleTemplate: '%s — MarkCache',
      htmlAttrs: { lang: 'id' },
    },
  },
  devtools: { enabled: true },
  css: ['@/assets/main.css'],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@iconify/vue',
        '@lucide/vue',
        '@vue/devtools-core',
        '@vueuse/core',
        'class-variance-authority',
        'clsx',
        'fuse.js',
        'reka-ui',
        'tailwind-merge',
        'vue-sonner',
        'workbox-window',
      ],
    },
  },
  modules: [
    'shadcn-nuxt',
    '@nuxt/content',
    '@nuxtjs/color-mode',
    '@vite-pwa/nuxt',
    'nuxt-og-image',
  ],
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

  site: {
    // Ganti dengan domain produksi bila berbeda.
    url: 'https://markcache.vercel.app',
  },

  ogImage: {
    zeroRuntime: true,
    defaults: {
      width: 1200,
      height: 630,
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    client: {
      installPrompt: true,
    },
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
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
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
      // - `woff2`: font Fontsource (Geist/Outfit) agar tipografi utuh offline.
      // - `wasm`: sqlite3.wasm (@nuxt/content) untuk queryCollection di client.
      // - `txt`: /__nuxt_content/**/sql_dump.txt (basis data konten client).
      globPatterns: ['**/*.{js,css,html,ico,png,svg,json,webmanifest,woff2,wasm,txt}'],
      // mockServiceWorker.js hanya untuk MSW (testing), bukan bagian aplikasi.
      // 404.html dibalas server dengan status 404, dan 200.html tidak muncul
      // di route /200 — keduanya membuat install precache workbox gagal total
      // (install di-ganggu satu respons non-200 saja), soal tidak dikeluarkan.
      globIgnores: ['**/mockServiceWorker.js', '**/404.html', '**/200.html'],
      // `?tag=` (filter tautan per halaman kategori) — refresh bervariasi
      // query saat offline tetap tersaji dari precache, jangan lempar ke jaringan.
      ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^tag$/],
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
