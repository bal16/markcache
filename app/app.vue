<script setup lang="ts">
import 'vue-sonner/style.css'
import PwaFeedback from '~/components/PwaFeedback.client.vue'
import { Toaster } from '~/components/ui/sonner'
</script>

<template>
  <NuxtPwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster position="bottom-center" rich-colors close-button />
  <PwaFeedback />
</template>
