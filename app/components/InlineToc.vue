<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { Toc } from '@nuxt/content'
import TableOfContents from './TableOfContents.vue'

defineProps<{
  toc: Toc
}>()
</script>

<template>
  <!-- ToC inline untuk tablet (md–xl). Di bawah xl sidebar masih tampil,
       jadi ToC tidak perlu drawer; di atas xl ToC pindah ke kolom kanan. -->
  <details
    class="not-prose group mb-6 hidden rounded-lg border border-border/60 bg-muted/30 md:block xl:hidden"
  >
    <summary
      class="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      Di halaman ini
      <Icon
        icon="radix-icons:chevron-down"
        class="h-4 w-4 transition-transform group-open:rotate-180"
      />
    </summary>
    <div class="max-h-[60vh] overflow-y-auto border-t border-border/60 px-4 py-4">
      <TableOfContents :toc="toc" :show-title="false" />
    </div>
  </details>
</template>
