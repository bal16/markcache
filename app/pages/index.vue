<script setup lang="ts">
import { Zap, Layout, Palette, ArrowRight, Github } from "lucide-vue-next";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

useSeoMeta({
  title: "MarkCache - Home",
  description: "Dokumentasi dan konten markdown yang cepat dan efisien.",
});
</script>

<template>
  <div class="flex flex-col min-h-[calc(100vh-4rem)]">
    <!-- Hero Section -->
    <section
      class="flex-1 flex flex-col items-center justify-center py-24 text-center space-y-8 px-4"
    >
      <h1
        class="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
      >
        MarkCache
      </h1>
      <p class="max-w-175 text-lg text-muted-foreground sm:text-xl">
        Kelola dan sajikan konten Markdown Anda dengan performa tinggi dan
        kemudahan integrasi di Nuxt.
      </p>
      <div class="flex gap-4">
        <Button as-child class="px-8">
          <NuxtLink to="/docs">
            Baca Dokumentasi <ArrowRight class="ml-2 h-4 w-4" />
          </NuxtLink>
        </Button>
        <Button variant="outline" as-child class="px-8">
          <NuxtLink to="https://github.com" target="_blank">
            <Github class="mr-2 h-4 w-4" />
            GitHub
          </NuxtLink>
        </Button>
      </div>
    </section>

    <!-- Features Section -->
    <section class="container mx-auto py-12 px-4 md:py-24">
      <div class="grid gap-8 md:grid-cols-3">
        <Card>
          <CardHeader>
            <Zap class="h-10 w-10 text-yellow-500 mb-2" />
            <CardTitle>Performa Tinggi</CardTitle>
            <CardDescription>
              Rendering konten statis yang dioptimalkan untuk kecepatan
              maksimal.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Layout class="h-10 w-10 text-blue-500 mb-2" />
            <CardTitle>Mudah Digunakan</CardTitle>
            <CardDescription>
              Struktur folder yang intuitif dan integrasi otomatis dengan Nuxt
              Content.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Palette class="h-10 w-10 text-purple-500 mb-2" />
            <CardTitle>Kustomisasi Penuh</CardTitle>
            <CardDescription>
              Dukungan penuh untuk komponen Vue di dalam Markdown dan styling
              dengan Tailwind CSS.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>
  </div>
</template>
