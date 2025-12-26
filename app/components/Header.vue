<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

import { Button } from "~/components/ui/button";
import ModeToggle from "~/components/ModeToggle.vue";
import CommandDialog from "./SearchDialog.vue";

const open = ref(false);

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    open.value = !open.value;
  }
};

onMounted(() => document.addEventListener("keydown", handleKeydown));
onUnmounted(() => document.removeEventListener("keydown", handleKeydown));
</script>
<template>
  <!-- Sticky Header -->
  <header
    class="sticky top-0 z-40 flex h-14 shrink-0 justify-between items-center gap-x-4 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 md:px-6"
  >
    <div class="flex items-center gap-2 font-bold tracking-tight">
      <NuxtLink to="/" class="flex items-center gap-2 text-lg">
        <span>Markcache</span>
      </NuxtLink>
    </div>

    <div class="flex items-center justify-end min-w-1/2 gap-4 md:px-4">
      <div class="w-full max-w-sm relative text-end">
        <Button
          @click="open = true"
          variant="ghost"
          class="inline-flex h-8 md:w-44 items-center justify-between rounded-md border border-input bg-muted/50 px-3 py-2 text-xs text-muted-foreground ring-offset-background whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span class="hidden md:inline">Search...</span>
          <kbd
            class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
          >
            <span class="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>
      <div class="">
        <ModeToggle />
      </div>
    </div>
    <CommandDialog v-model:state="open" />
  </header>
</template>
