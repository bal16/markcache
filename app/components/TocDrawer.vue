<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import GoToTop from './GoToTop.vue'
import TableOfContents from './TableOfContents.vue'
import { Button } from './ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer'

const { pageData: page } = await usePageData()

// Pages without H2 have no ToC. Skip the trigger so the drawer never opens empty.
const toc = computed(() => page.value?.body?.toc)
const hasToc = computed(() => Boolean(toc.value?.links?.length))
</script>
<template>
  <Drawer v-if="hasToc">
    <DrawerTrigger as-child>
      <Button variant="ghost" class="rounded-full px-4 h-10 font-medium tracking-tight text-muted-foreground hover:text-foreground">
        Di halaman ini <Icon icon="radix-icons:view-horizontal" class="w-4 h-4 ml-2" />
      </Button>
    </DrawerTrigger>
    <DrawerContent class="max-h-[85vh]">
      <DrawerHeader class="text-left">
        <DrawerTitle>Di halaman ini</DrawerTitle>
        <DrawerDescription class="sr-only">Navigasi judul bagian di halaman ini.</DrawerDescription>
      </DrawerHeader>
      <div class="overflow-y-auto px-4 pb-6">
        <TableOfContents
          v-if="toc"
          :toc="toc"
          :show-title="false"
        />
        <div class="mt-8 flex items-center justify-start gap-2">
          <ShareButton />
          <GoToTop size="sm" />
        </div>
      </div>
    </DrawerContent>
  </Drawer>
</template>
