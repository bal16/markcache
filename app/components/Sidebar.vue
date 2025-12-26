<script setup lang="ts">
import { ScrollArea } from "~/components/ui/scroll-area";
import SidebarItem from "~/components/SidebarItem.vue"; // Import komponen baru

const { data: navigation } = await useAsyncData("navigation", () => {
  return queryCollectionNavigation("content").order("title", "ASC");
});
</script>

<template>
  <aside class="hidden w-64 shrink-0 border-r bg-muted/10 md:block h-screen sticky top-0">
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
  </aside>
</template>