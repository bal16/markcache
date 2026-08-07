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

const { navigation } = await useNavigationItem()
</script>
<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button variant="ghost" class="rounded-full px-4 h-10 font-medium tracking-tight text-muted-foreground hover:text-foreground">
        <Icon icon="radix-icons:hamburger-menu" class="w-4 h-4 mr-2" /> Menu
      </Button>
    </SheetTrigger>
    <SheetContent side="left" class="w-[300px] bg-background/80 backdrop-blur-2xl border-r-border/30">
      <SheetHeader class="sr-only">
        <SheetTitle></SheetTitle>
        <SheetDescription></SheetDescription>
      </SheetHeader>
      <ScrollArea class="h-full">
        <div class="p-4 grid gap-2">
          <template v-if="navigation">
            <SidebarItem
              v-for="item in navigation"
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
