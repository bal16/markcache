<script setup lang="ts">
import { ScrollArea } from './ui/scroll-area';

defineProps<{
  links: Array<{ id: string; text: string; children?: Array<{ id: string; text: string }> }>
}>()

const activeId = ref<string | null>(null)

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      })
    },
    {
      rootMargin: '-100px 0px -66% 0px',
      threshold: 1.0 
    }
  )

  document.querySelectorAll('article h2, article h3').forEach((section) => {
    observer.observe(section)
  })
  
  onUnmounted(() => {
    observer.disconnect()
  })
})

const onClick = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeId.value = id
  }
}
</script>

<template>
  <nav class="space-y-2">
    <ScrollArea class="h-full">
    <p class="font-medium text-sm mb-4">On This Page</p>
    <ul class="space-y-2 text-sm">
      <li v-for="link in links" :key="link.id">
        <a 
          :href="`#${link.id}`" 
          @click.prevent="onClick(link.id)"
          class="block border-l-2 pl-4 transition-colors hover:text-foreground"
          :class="[
            activeId === link.id 
              ? 'border-primary font-medium text-primary' 
              : 'border-transparent text-muted-foreground'
          ]"
        >
          {{ link.text }}
        </a>

        <ul v-if="link.children" class="mt-2 space-y-2">
          <li v-for="child in link.children" :key="child.id">
            <a 
              :href="`#${child.id}`"
              @click.prevent="onClick(child.id)"
              class="block border-l-2 pl-8 transition-colors hover:text-foreground"
              :class="[
                activeId === child.id 
                  ? 'border-primary font-medium text-primary' 
                  : 'border-transparent text-muted-foreground'
              ]"
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