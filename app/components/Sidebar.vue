<script setup lang="ts">
import SidebarItem from '~/components/SidebarItem.vue'
import { ScrollArea } from '~/components/ui/scroll-area'

const { groups } = await useNavigationItem()
</script>

<template>
  <aside
    class="hidden w-64 shrink-0 border-r border-border/50 bg-background/80 backdrop-blur-md md:block h-[calc(100vh-3.5rem)] sticky top-14 z-40 transition-colors duration-300"
  >
    <ScrollArea class="h-full">
      <div class="p-6 grid gap-0.5">
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
  </aside>
</template>
