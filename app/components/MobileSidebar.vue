<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import SidebarItem from './SidebarItem.vue'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'

const { groups } = await useNavigationItem()
</script>
<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button variant="ghost" class="rounded-full px-4 h-10 font-medium tracking-tight text-muted-foreground hover:text-foreground">
        <Icon icon="radix-icons:hamburger-menu" class="w-4 h-4 mr-2" /> Menu
      </Button>
    </SheetTrigger>
    <SheetContent side="left" class="w-75 bg-background/80 backdrop-blur-2xl border-r-border/30" :close-button="false">
      <SheetHeader class="sr-only">
        <SheetTitle></SheetTitle>
        <SheetDescription></SheetDescription>
      </SheetHeader>
      <ScrollArea class="h-full">
        <div class="p-4 grid gap-0.5">
          <NuxtLink
            to="/directory"
            active-class="border-l-2 border-primary bg-primary/10 text-primary font-medium hover:translate-x-0"
            class="block truncate rounded-md py-1.5 px-3 text-sm font-medium text-foreground transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary hover:translate-x-1"
          >
            Index
          </NuxtLink>
          <div class="h-px bg-border/40 my-3" />
          <template v-for="group in groups" :key="group.domain">
            <!-- Heading non-klik per domain; semua link di bawahnya tetap flat. -->
            <p class="mb-1 mt-5 pl-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70 select-none">
              {{ group.label }}
            </p>
            <SidebarItem
              v-for="item in group.items"
              :key="item.path"
              :item="item"
              :level="0"
            />
          </template>
        </div>
      </ScrollArea>
    </SheetContent>
  </Sheet>
</template>
