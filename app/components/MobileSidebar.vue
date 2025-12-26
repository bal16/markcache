<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import SidebarItem from "./SidebarItem.vue";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const { data: navigation } = await useAsyncData("navigation", () => {
  return queryCollectionNavigation("content").order("title", "ASC");
});
</script>
<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button variant="ghost">
        <Icon icon="radix-icons:text-align-left" width="15" height="15" /> Menu
      </Button>
    </SheetTrigger>
    <SheetContent side="left">
      <SheetHeader>
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
