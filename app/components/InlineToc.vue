<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { Toc } from '@nuxt/content'
import { ref } from 'vue'
import TableOfContents from './TableOfContents.vue'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'

defineProps<{
  toc: Toc
}>()

const open = ref(false)
</script>

<template>
  <!-- ToC inline untuk tablet (md–xl). Di bawah xl sidebar masih tampil,
       jadi ToC tidak perlu drawer; di atas xl ToC pindah ke kolom kanan. -->
  <Collapsible
    v-model:open="open"
    class="not-prose mb-6 hidden rounded-lg border border-border/60 bg-muted/30 md:block xl:hidden"
  >
    <CollapsibleTrigger
      class="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      Di halaman ini
      <Icon
        icon="radix-icons:chevron-down"
        class="h-4 w-4 transition-transform"
        :class="open ? 'rotate-180' : ''"
      />
    </CollapsibleTrigger>
    <CollapsibleContent>
      <div class="max-h-[60vh] overflow-y-auto border-t border-border/60 px-4 py-4">
        <TableOfContents :toc="toc" :show-title="false" />
      </div>
    </CollapsibleContent>
  </Collapsible>
</template>
