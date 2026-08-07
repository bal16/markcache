<script lang="ts" setup>
import MobileSidebar from './MobileSidebar.vue'
import MobileToc from './MobileToc.vue'
</script>

<template>
  <section
    class="flex lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 h-14 shrink-0 items-center justify-center gap-x-1 rounded-full border border-border/50 bg-background/70 px-2 shadow-2xl backdrop-blur-xl supports-backdrop-filter:bg-background/50"
  >
    <div class="flex md:hidden">
      <MobileSidebar />
    </div>
    <div class="h-6 w-[1px] bg-border/50 mx-1 md:hidden"></div>
    <div class="flex">
      <MobileToc />
    </div>
  </section>
</template>
