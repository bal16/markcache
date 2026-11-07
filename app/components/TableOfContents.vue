<script setup lang="ts">
import type { Toc } from '@nuxt/content'
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { ScrollArea } from './ui/scroll-area'

// import { useTocObserver } from '@/composables/useTocObserver';

const props = withDefaults(
  defineProps<{
    toc: Toc
    showTitle?: boolean
  }>(),
  { showTitle: true }
)

function normalizeLinks(list: any[]): any[] {
  return (list || []).filter(Boolean).map((l) => ({
    ...l,
    children: Array.isArray(l?.children) ? normalizeLinks(l.children) : [],
  }))
}

const links = computed(() => normalizeLinks(props.toc?.links || []))

const { activeId, scrollToId } = useTocObserver(links)
</script>

<template>
  <nav class="space-y-2">
    <ScrollArea class="h-full">
      <p v-if="showTitle" class="font-medium text-sm mb-4">Di halaman ini</p>

      <ul v-if="links.length" class="space-y-2 text-sm">
        <li v-for="(link, i) in links" :key="link?.id ?? i">
          <template v-if="link">
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
              <li v-for="(child, ci) in link.children" :key="child?.id ?? ci">
                <template v-if="child">
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
                </template>
              </li>
            </ul>
          </template>
        </li>
      </ul>
    </ScrollArea>
  </nav>
</template>
