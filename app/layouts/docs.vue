<script setup lang="ts">
import MobileHeader from '~/components/MobileHeader.vue'
import Sidebar from '~/components/Sidebar.vue'
</script>

<template>
  <NuxtLayout name="default">
    <div class="flex flex-col h-full w-full min-h-0">
      <MobileHeader />
      <!-- Main Layout: Sidebar (Fixed) + Content (Scrollable) -->
      <div class="flex flex-1 overflow-hidden">
        <Sidebar />
        <main class="flex-1 overflow-y-auto">
          <div class="container max-w-5xl py-6 lg:py-8 mx-auto">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </NuxtLayout>
</template>
