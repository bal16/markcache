<script setup lang="ts">
import Header from "~/components/Header.vue";
import Footer from "~/components/Footer.vue";
</script>

<template>
  <div
    class="grid min-h-screen grid-rows-[auto_1fr_auto] bg-background text-foreground"
  >
    <!-- Header Component -->
    <Header />
    <slot />
    <Footer />
  </div>
</template>
