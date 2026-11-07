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
        <NuxtLink
          to="/directory"
          active-class="border-l-2 border-primary bg-primary/10 text-primary font-medium hover:translate-x-0"
          class="block truncate rounded-md py-2 px-3 text-sm font-medium text-foreground transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary hover:translate-x-1"
        >
          Indeks
        </NuxtLink>
        <div class="h-px bg-border/40 my-2" />
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
