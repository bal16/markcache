<script setup lang="ts">
import { ArrowUp } from '@lucide/vue'
import { Button } from '~/components/ui/button'

withDefaults(
  defineProps<{
    // `button` untuk permukaan navigasi (aside/drawer), `link` untuk aksi
    // penutup artikel yang tidak perlu bersaing dengan footer.
    appearance?: 'button' | 'link'
    size?: 'sm' | 'default' | 'lg'
  }>(),
  {
    appearance: 'button',
    size: 'default',
  }
)

function scrollToTop() {
  const topElement = document.getElementById('page-top')
  if (topElement) {
    topElement.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>
<template>
  <Button
    type="button"
    variant="ghost"
    :size="appearance === 'link' ? 'sm' : size"
    :class="[
      'inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground',
      appearance === 'link' &&
        'h-auto px-0 py-0 hover:bg-transparent dark:hover:bg-transparent hover:underline underline-offset-4',
    ]"
    @click.prevent="scrollToTop"
  >
    Kembali ke atas <ArrowUp class="ml-2 h-4 w-4" />
  </Button>
</template>
