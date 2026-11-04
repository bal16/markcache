<script setup lang="ts">
import { Check, Share2 } from '@lucide/vue'
import { onUnmounted, ref } from 'vue'
import { toast } from 'vue-sonner'
import { Button } from '~/components/ui/button'

const route = useRoute()
const { pageData: page } = await usePageData()

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

async function share() {
  if (import.meta.server) return
  const url = window.location.href
  const title = page.value?.title ?? document.title
  const text = page.value?.description ?? ''

  // Web Share API bila tersedia (mobile/desktop yang mendukung).
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text, url })
      return
    } catch (err) {
      // Pembatalan oleh user tidak perlu fallback copy.
      if ((err as { name?: string } | null)?.name === 'AbortError') return
    }
  }

  // Fallback: salin URL + toast "tautan disalin".
  try {
    await navigator.clipboard.writeText(url)
    copied.value = true
    toast.success('Tautan disalin')
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    window.prompt('Salin tautan:', url)
  }
}

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <Button
    type="button"
    variant="ghost"
    size="sm"
    aria-label="Bagikan halaman ini"
    @click="share"
  >
    <Check v-if="copied" class="h-4 w-4" />
    <Share2 v-else class="h-4 w-4" />
    <span class="hidden sm:inline">{{ copied ? 'Disalin' : 'Bagikan' }}</span>
  </Button>
</template>
