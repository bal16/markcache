<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import GoToTop from './GoToTop.vue'
import TableOfContents from './TableOfContents.vue'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

const { pageData: page } = await usePageData()
</script>
<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="ghost" class="rounded-full px-4 h-10 font-medium tracking-tight text-muted-foreground hover:text-foreground">
        On This Page <Icon icon="radix-icons:view-horizontal" class="w-4 h-4 ml-2" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[300px] rounded-3xl bg-background/80 backdrop-blur-2xl border-border/30 shadow-2xl p-6" side="top" :side-offset="20" align="end">
      <TableOfContents
        v-if="page && page.body && page.body.toc"
        :toc="page.body.toc"
      />
      <div class="mt-8 flex justify-start">
        <GoToTop />
      </div>
    </PopoverContent>
  </Popover>
</template>
