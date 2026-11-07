<script lang="ts" setup>
import NavDrawer from './NavDrawer.vue'
import TocDrawer from './TocDrawer.vue'

const { pageData: page } = await usePageData()

// Pages without H2 have no ToC; do not leave a divider or an empty pill.
const hasToc = computed(() => Boolean(page.value?.body?.toc?.links?.length))
</script>

<template>
  <!-- Mobile action dock for <md only. At md–xl the sidebar is still visible
       and the ToC moves to the inline block above the article; at xl the ToC
       becomes sticky. -->
  <section
    class="flex md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 h-14 shrink-0 items-center justify-center gap-x-1 rounded-full border border-border/50 bg-background/70 px-2 shadow-2xl backdrop-blur-xl supports-backdrop-filter:bg-background/50"
  >
    <div class="flex">
      <NavDrawer />
    </div>
    <template v-if="hasToc">
      <div class="h-6 w-px bg-border/50 mx-1"></div>
      <div class="flex">
        <TocDrawer />
      </div>
    </template>
  </section>
</template>
