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
</script>
<template>
  <Drawer>
    <DrawerTrigger as-child>
      <Button variant="ghost" class="rounded-full px-4 h-10 font-medium tracking-tight text-muted-foreground hover:text-foreground">
        Di halaman ini <Icon icon="radix-icons:view-horizontal" class="w-4 h-4 ml-2" />
      </Button>
    </DrawerTrigger>
    <DrawerContent class="max-h-[85vh]">
      <DrawerHeader class="text-left">
        <DrawerTitle>Di halaman ini</DrawerTitle>
        <DrawerDescription>Navigasi judul bagian di halaman ini.</DrawerDescription>
      </DrawerHeader>
      <div class="overflow-y-auto px-4 pb-6">
        <TableOfContents
          v-if="page && page.body && page.body.toc"
          :toc="page.body.toc"
        />
        <div class="mt-8 flex justify-start gap-2">
          <ShareButton />
          <GoToTop />
        </div>
      </div>
    </DrawerContent>
  </Drawer>
</template>
