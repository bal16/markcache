<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { onMounted, onUnmounted } from 'vue'
import { Button } from '@/components/ui/button'

const colorMode = useColorMode()

function toggle() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

onMounted(() => {
  // Default ikut device, lalu dikunci ke dark/light (tidak ada state 'system')
  if (colorMode.preference === 'system') {
    colorMode.preference = colorMode.value
  }

  const handler = (e: KeyboardEvent) => {
    // Jangan trigger di input/form/contenteditable
    const target = e.target as HTMLElement | null
    if (
      target &&
      (target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable)
    ) {
      return
    }
    // Hanya Shift+D, tanpa modifier lain
    if (e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey && e.key.toLowerCase() === 'd') {
      e.preventDefault()
      toggle()
    }
  }
  window.addEventListener('keydown', handler)
  onUnmounted(() => window.removeEventListener('keydown', handler))
})
</script>

<template>
  <Button
    variant="ghost"
    size="icon"
    class="relative"
    aria-label="Toggle theme"
    @click="toggle"
  >
    <Icon
      icon="radix-icons:sun"
      class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
    />
    <Icon
      icon="radix-icons:moon"
      class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
    />
    <span class="sr-only">Toggle theme</span>
  </Button>
</template>
