<script setup lang="ts">
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { ChevronRight } from "lucide-vue-next";

interface NavItem {
  title: string;
  path: string;
  children?: NavItem[];
}

const props = defineProps<{
  item: NavItem;
  level?: number; 
}>();

const formattedTitle = computed(() => {
  if (!props.item.children) return props.item.title;

  const segments = props.item.path.split("/").filter(Boolean);
  const folderName = segments[segments.length - 1];
  return folderName
    ? folderName.charAt(0).toUpperCase() + folderName.slice(1)
    : props.item.title;
});

const paddingLeftClass = computed(() => {
  return props.level ? `padding-left: ${props.level * 12}px` : "";
});
</script>

<template>
  <Collapsible
    v-if="item.children && item.children.length"
    :default-open="true"
    class="flex flex-col gap-1 w-full"
  >
    <CollapsibleTrigger
      class="group flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs font-semibold text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground transition-colors"
      :style="paddingLeftClass"
    >
      <span class="truncate">{{ formattedTitle }}</span>
      <ChevronRight
        class="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90"
      />
    </CollapsibleTrigger>

    <CollapsibleContent class="grid gap-1">
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
    class="block truncate rounded-md py-1.5 px-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    active-class="bg-accent text-accent-foreground font-medium"
    :style="paddingLeftClass"
  >
    {{ item.title }}
  </NuxtLink>
</template>
