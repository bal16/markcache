<script setup lang="ts">
import { GITHUB_URL } from "~/const";

</script>
<template>
  <footer class="py-6 md:px-8 md:py-0 border-t">
    <div
      class="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row"
    >
      <p
        class="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left"
      >
        Built by
        <NuxtLink
          :href="GITHUB_URL.split('/').slice(0, 4).join('/')"
          target="_blank"
          rel="noreferrer"
          class="font-medium underline underline-offset-4"
          >MarkCache Team</NuxtLink
        >. The source code is available on
        <NuxtLink
          :href="GITHUB_URL"
          target="_blank"
          rel="noreferrer"
          class="font-medium underline underline-offset-4"
          >GitHub</NuxtLink
        >.
      </p>
    </div>
  </footer>
</template>
