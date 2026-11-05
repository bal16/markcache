<script setup lang="ts">
import { ArrowLeft, Home } from '@lucide/vue'
import type { NuxtError } from '#app'
import Footer from '~/components/Footer.vue'
import Header from '~/components/Header.vue'
import { Button } from '~/components/ui/button'

const props = defineProps<{ error: NuxtError }>()

const isNotFound = computed(() => props.error.statusCode === 404)

useSeoMeta({
  title: () => (isNotFound.value ? 'Halaman tidak ditemukan' : 'Terjadi kesalahan'),
  robots: 'noindex, nofollow',
})

function goHome() {
  clearError({ redirect: '/' })
}

function goBack() {
  clearError()
  window.history.back()
}
</script>

<template>
  <div class="grid min-h-screen grid-rows-[auto_1fr_auto] bg-background text-foreground">
    <Header />

    <main class="container mx-auto flex w-full max-w-3xl items-center justify-center px-6 py-24">
      <section class="w-full max-w-xl text-center">
        <p class="font-mono text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {{ error.statusCode }}
        </p>
        <h1 class="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          {{ isNotFound ? 'Halaman tidak ditemukan' : 'Terjadi kesalahan' }}
        </h1>
        <p class="mx-auto mt-5 max-w-md text-muted-foreground">
          {{
            isNotFound
              ? 'Alamat yang kamu buka tidak tersedia atau sudah dipindahkan.'
              : 'Sesuatu tidak berjalan seperti biasanya. Coba kembali ke beranda.'
          }}
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <Button @click="goHome">
            <Home class="mr-2 h-4 w-4" />
            Ke beranda
          </Button>
          <Button variant="outline" @click="goBack">
            <ArrowLeft class="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>