<script setup lang="ts">
import { computed } from "vue";
import type { Toc } from "@nuxt/content";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
// import { useTocObserver } from '@/composables/useTocObserver';

const props = defineProps<{
  toc: Toc;
}>();

const links = computed(() => props.toc?.links || []);

const { activeId, scrollToId } = useTocObserver(links);
</script>

<template>
  <nav class="space-y-2">
    <ScrollArea class="h-full">
      <p class="font-medium text-sm mb-4">On This Page</p>

      <ul v-if="links.length" class="space-y-2 text-sm">
        <li v-for="link in links" :key="link.id">
          <a
            :href="`#${link.id}`"
            @click.prevent="scrollToId(link.id)"
            :class="
              cn(
                'block border-l-2 pl-4 transition-colors hover:text-foreground',
                activeId === link.id
                  ? 'border-primary font-medium text-primary'
                  : 'border-transparent text-muted-foreground'
              )
            "
          >
            {{ link.text }}
          </a>

          <ul
            v-if="link.children && link.children.length"
            class="mt-2 space-y-2"
          >
            <li v-for="child in link.children" :key="child.id">
              <a
                :href="`#${child.id}`"
                @click.prevent="scrollToId(child.id)"
                :class="
                  cn(
                    'block border-l-2 pl-8 transition-colors hover:text-foreground',
                    activeId === child.id
                      ? 'border-primary font-medium text-primary'
                      : 'border-transparent text-muted-foreground'
                  )
                "
              >
                {{ child.text }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </ScrollArea>
  </nav>
</template>
