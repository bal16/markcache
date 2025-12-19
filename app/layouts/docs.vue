<script setup lang="ts">
import Header from "~/components/Header.vue";
import Sidebar from "~/components/Sidebar.vue";
import Footer from "~/components/Footer.vue";
</script>

<template>
  <NuxtLayout name="default">
    <!-- Main Layout: Sidebar (Fixed) + Content (Scrollable) -->
    <div class="flex flex-1 overflow-hidden h-[calc(100vh-3.5rem)]">
      <Sidebar />
      <main class="flex-1 overflow-y-auto">
        <div class="container max-w-5xl py-6 lg:py-8 mx-auto">
          <slot />
        </div>
      </main>
    </div>
  </NuxtLayout>
</template>
