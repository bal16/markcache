<script setup lang="ts">
import { Input } from "~/components/ui/input";
import ModeToggle from "~/components/ModeToggle";
</script>
<template>
  <!-- Sticky Header -->
  <header
    class="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-x-4 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 md:px-6"
  >
    <div class="flex items-center gap-2 font-bold tracking-tight">
      <!-- Logo / Title -->
      <NuxtLink to="/" class="flex items-center gap-2 text-lg">
        <span>Markcache</span>
      </NuxtLink>
    </div>

    <!-- Search Bar Area -->
    <div
      class="flex flex-1 items-center justify-end gap-4 md:justify-start md:px-4"
    >
      <div class="w-full max-w-sm">
        <Input
          type="search"
          placeholder="Search..."
          class="h-8 w-full bg-muted/50 text-xs placeholder:text-muted-foreground/70 focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>
    </div>
    <div className="">
      <ModeToggle />
    </div>
  </header>
</template>
