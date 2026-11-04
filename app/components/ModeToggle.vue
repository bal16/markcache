<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { Button } from '@/components/ui/button'

const colorMode = useColorMode()
const buttonRef = ref<any>(null)

async function toggle(originEl?: any) {
  const next = colorMode.value === 'dark' ? 'light' : 'dark'

  // Tentukan titik origin untuk circular reveal
  const el = originEl || buttonRef.value
  if (typeof document !== 'undefined') {
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    const node = (el as any)?.$el || el
    if (node && typeof node.getBoundingClientRect === 'function') {
      const rect = node.getBoundingClientRect()
      x = rect.left + rect.width / 2
      y = rect.top + rect.height / 2
    }
    document.documentElement.style.setProperty('--vt-x', `${x}px`)
    document.documentElement.style.setProperty('--vt-y', `${y}px`)
  }

  if (
    typeof document !== 'undefined' &&
    typeof (document as any).startViewTransition === 'function'
  ) {
    const transition = (document as any).startViewTransition(async () => {
      colorMode.preference = next
      await nextTick()
    })
    try {
      await transition.finished
    } catch {
      // ignore
    }
  } else {
    colorMode.preference = next
  }
}

onMounted(() => {
  // Default ikut device, lalu dikunci ke dark/light (tidak ada state 'system')
  if (colorMode.preference === 'system') {
    colorMode.preference = colorMode.value
  }

  const handler = (e: KeyboardEvent) => {
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
    if (e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey && e.key.toLowerCase() === 'd') {
      e.preventDefault()
      toggle(buttonRef.value)
    }
  }
  window.addEventListener('keydown', handler)
  onUnmounted(() => window.removeEventListener('keydown', handler))
})
</script>

<template>
  <Button
    ref="buttonRef"
    variant="ghost"
    size="icon"
    class="relative"
    aria-label="Toggle theme"
    @click="toggle($event.currentTarget as HTMLElement)"
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
