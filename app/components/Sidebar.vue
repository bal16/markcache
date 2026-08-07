<script setup lang="ts">
import SidebarItem from '~/components/SidebarItem.vue'
import { ScrollArea } from '~/components/ui/scroll-area'

const { navigation } = await useNavigationItem()
</script>

<template>
  <aside
    class="hidden w-64 shrink-0 border-r border-border/50 bg-background/80 backdrop-blur-md md:block h-[calc(100vh-3.5rem)] sticky top-14 z-40 transition-colors duration-300"
  >
    <ScrollArea class="h-full">
      <div class="p-6 grid gap-2">
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
