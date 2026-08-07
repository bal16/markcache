<script setup lang="ts">
import Footer from '~/components/Footer.vue'
import Header from '~/components/Header.vue'
import MobileHeader from '~/components/MobileHeader.vue'
import Sidebar from '~/components/Sidebar.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen bg-background text-foreground">
    <Header />
    <div class="flex flex-col w-full flex-1 min-h-0">
      <MobileHeader />
      <!-- Main Layout: Sidebar (Fixed) + Content (Scrollable) -->
      <div class="flex w-full items-start flex-1">
        <Sidebar />
        <main class="flex-1 min-w-0 flex flex-col min-h-[calc(100vh-3.5rem)] pb-24 lg:pb-0">
          <div class="container max-w-5xl py-6 lg:py-8 mx-auto flex-1">
            <slot />
          </div>
          <!-- Custom docs footer inside the main content area -->
          <div class="mt-auto border-t border-border/50 bg-muted/20">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
