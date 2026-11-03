<script setup lang="ts">
import { ArrowRight, Clapperboard, Terminal, Wrench } from '@lucide/vue'
import type { Component } from 'vue'
import { Button } from '~/components/ui/button'
import { GITHUB_URL } from '~/const'

useSeoMeta({
  title: 'Direktori link terkurasi, ID-first',
  description:
    'MarkCache — direktori tautan gratis ala FMHY yang dikurasi manual untuk pengguna Indonesia: streaming, anime, hingga dev tools.',
})

const { data: kategori } = await useAsyncData('kategori-featured', () => {
  return queryCollection('content')
    .where('featured', '=', true)
    .where('draft', '<>', true)
    .order('order', 'ASC')
    .select('path', 'title', 'description', 'icon')
    .all()
})

const iconMap: Record<string, Component> = {
  clapperboard: Clapperboard,
  terminal: Terminal,
}

// Kategori yang planned tapi belum terisi — hanya label, biar tidak ada
// halaman kosong (ADR-001 #3).
const segeraHadir = ['Downloading', 'Reading', 'Audio', 'Torrenting', 'AI Tools']
</script>

<template>
  <!-- Noise Overlay -->
  <div class="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-20 mix-blend-overlay" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

  <div class="flex flex-col min-h-[calc(100vh-4rem)] relative z-10">
    <!-- Hero Section -->
    <section class="flex-1 flex flex-col items-center justify-center py-24 text-center space-y-8 px-4">
      <h1 class="font-brand text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-balance">
        MarkCache
      </h1>
      <p class="max-w-2xl text-lg text-muted-foreground sm:text-xl text-balance">
        Direktori tautan gratis ala FMHY — dikurasi manual, ditulis untuk
        pengguna Indonesia. Streaming, anime, sampai dev tools.
      </p>
      <div class="flex gap-4">
        <Button as-child class="px-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(0,112,243,0.3)] transition-all duration-300">
          <NuxtLink to="/streaming">
            Jelajahi Kategori <ArrowRight class="ml-2 h-4 w-4" />
          </NuxtLink>
        </Button>
        <Button variant="outline" as-child class="px-8 border-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300">
          <NuxtLink :href="GITHUB_URL" target="_blank">
            GitHub
          </NuxtLink>
        </Button>
      </div>
    </section>

    <!-- Bento Grid Categories Section -->
    <section class="container mx-auto pb-24 px-4 max-w-5xl">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(150px,auto)]">
        <NuxtLink
          v-for="cat in kategori"
          :key="cat.path"
          :to="cat.path"
          class="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 p-6 transition-all duration-300 hover:border-primary/50 dark:hover:border-primary/50 hover:bg-black/10 dark:hover:bg-white/10 hover:shadow-[0_0_30px_rgba(0,112,243,0.15)] active:scale-[0.98] md:col-span-1"
        >
          <!-- Spotlight background effect -->
          <div class="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

          <div class="relative z-10">
            <component
              :is="iconMap[cat.icon ?? ''] ?? Wrench"
              class="h-8 w-8 text-primary mb-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110"
            />
            <h3 class="text-xl font-semibold tracking-tight text-foreground">{{ cat.title }}</h3>
            <p class="mt-2 text-sm text-muted-foreground">{{ cat.description }}</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Segera hadir: kategori belum terisi, tidak ada halaman kosong -->
      <div class="mt-10 flex flex-wrap items-center gap-3 justify-center">
        <span class="text-sm text-muted-foreground">Segera hadir:</span>
        <span
          v-for="soon in segeraHadir"
          :key="soon"
          class="px-3 py-1 rounded-full text-xs border border-dashed border-border text-muted-foreground/70"
        >
          {{ soon }}
        </span>
      </div>
    </section>
  </div>
</template>
