<script lang="ts" setup>
import MobileSidebar from './MobileSidebar.vue'
import MobileToc from './MobileToc.vue'

const { pageData: page } = await usePageData()

// Halaman tanpa H2 tidak punya ToC; jangan sisakan pembatas atau pill kosong.
const hasToc = computed(() => Boolean(page.value?.body?.toc?.links?.length))
</script>

<template>
  <!-- Bar navigasi mobile hanya untuk <md. Di md–xl sidebar masih tampil dan
       ToC dipindah ke blok inline di atas artikel; di xl ToC jadi sticky. -->
  <section
    class="flex md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 h-14 shrink-0 items-center justify-center gap-x-1 rounded-full border border-border/50 bg-background/70 px-2 shadow-2xl backdrop-blur-xl supports-backdrop-filter:bg-background/50"
  >
    <div class="flex">
      <MobileSidebar />
    </div>
    <template v-if="hasToc">
      <div class="h-6 w-px bg-border/50 mx-1"></div>
      <div class="flex">
        <MobileToc />
      </div>
    </template>
  </section>
</template>
