<script setup lang="ts">
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible'
import { ChevronRight } from 'lucide-vue-next'

interface NavItem {
  title: string
  path: string
  children?: NavItem[]
}

const props = defineProps<{
  item: NavItem
  level?: number
}>()

const formattedTitle = computed(() => {
  if (!props.item.children) return props.item.title

  const segments = props.item.path.split('/').filter(Boolean)
  const folderName = segments[segments.length - 1]
  return folderName ? folderName.charAt(0).toUpperCase() + folderName.slice(1) : props.item.title
})

const paddingLeftClass = computed(() => {
  return props.level ? `padding-left: ${props.level * 12}px` : ''
})
</script>

<template>
  <Collapsible
    v-if="item.children && item.children.length"
    :default-open="true"
    class="flex flex-col gap-2 w-full mt-2 first:mt-0"
  >
    <CollapsibleTrigger
      class="group flex w-full items-center justify-between rounded-md py-1 text-left text-[11px] uppercase tracking-widest font-bold text-muted-foreground hover:text-foreground transition-colors"
      :style="paddingLeftClass"
    >
      <span class="truncate">{{ formattedTitle }}</span>
      <ChevronRight
        class="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90 opacity-50 group-hover:opacity-100"
      />
    </CollapsibleTrigger>

    <CollapsibleContent class="grid gap-1 ml-2 pl-2 border-l border-border/40">
      <SidebarItem
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :level="(level || 0) + 1"
      />
    </CollapsibleContent>
  </Collapsible>

  <NuxtLink
    v-else
    :to="item.path"
    class="block truncate rounded-md py-2 px-3 text-sm text-muted-foreground transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground hover:translate-x-1"
    active-class="border-l-2 border-primary bg-primary/10 text-primary font-medium hover:translate-x-0"
    :style="paddingLeftClass"
  >
    {{ item.title }}
  </NuxtLink>
</template>
