<script setup lang="ts">
import Header from '~/components/Header.vue'
import MobileDock from '~/components/MobileDock.vue'
import Sidebar from '~/components/Sidebar.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen bg-background text-foreground">
    <Header />
    <div class="flex flex-col w-full flex-1 min-h-0">
      <MobileDock />
      <!-- Main Layout: Sidebar (Fixed) + Content (Scrollable) -->
      <!-- Footer halaman docs dirender oleh masing-masing halaman
           (di dalam kolom artikel) agar rentang sticky ToC mencakup footer. -->
      <div class="flex w-full items-start flex-1">
        <Sidebar />
        <main class="flex-1 min-w-0 flex flex-col min-h-[calc(100vh-3.5rem)] pb-24 md:pb-0">
          <div class="container max-w-5xl py-6 lg:py-8 mx-auto flex-1">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
