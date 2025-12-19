<script setup lang="ts">
import Header from "~/components/Header.vue";
import Sidebar from "~/components/Sidebar.vue";
</script>

<template>
  <div class="flex min-h-screen flex-col bg-background text-foreground">
    <!-- Header Component -->
    <Header />
    <slot />
  </div>
</template>
