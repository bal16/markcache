import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    preset: "vercel",
    static: true,
  },
  compatibilityDate: "2025-07-15",
  ssr: true,
  devtools: { enabled: true },
  css: ["@/assets/main.css"],
  vite: { plugins: [tailwindcss()] },
  modules: ["shadcn-nuxt", "@nuxt/content", "@nuxtjs/color-mode"],

  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: "@/components/ui",
  },

  colorMode: {
    classSuffix: "",
  },

  routeRules: {
    "/**": { prerender: true },
  },
});
