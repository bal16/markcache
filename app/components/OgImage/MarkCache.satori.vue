<script setup lang="ts">
const {
  title = 'MarkCache',
  description = 'Direktori tautan gratis terkurasi untuk pengguna Indonesia.',
} = defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <div class="h-full w-full flex flex-col justify-between bg-[#0b1020] text-slate-100 p-16">
    <div class="flex items-center gap-3">
      <div class="h-10 w-10 rounded-lg bg-sky-500 flex items-center justify-center font-black text-xl text-white">
        M
      </div>
      <span class="text-2xl font-semibold tracking-tight">MarkCache</span>
    </div>

    <div class="flex flex-col gap-6">
      <h1 class="text-[64px] leading-tight font-black text-balance">
        {{ title }}
      </h1>
      <p class="text-[28px] leading-snug text-slate-300 max-w-[900px]">
        {{ description }}
      </p>
    </div>

    <div class="flex items-center justify-between text-xl text-slate-400">
      <span>Direktori kurasi link ala FMHY — ID-first</span>
      <span>markcache.vercel.app</span>
    </div>
  </div>
</template>