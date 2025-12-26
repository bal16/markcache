<script lang="ts" setup>
import MobileSidebar from "./MobileSidebar.vue";
import MobileToc from "./MobileToc.vue";
</script>

<template>
  <section
    class="flex flex-row-reverse lg:hidden sticky top-14 z-40 h-12 shrink-0 items-center justify-between gap-x-4 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 md:px-6"
  >
    <div>
      <MobileToc />
    </div>
    <div class="flex md:hidden">
      <MobileSidebar />
    </div>
  </section>
</template>
