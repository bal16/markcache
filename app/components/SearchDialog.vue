<script setup lang="ts">
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '~/components/ui/command'

const props = defineProps<{ state: boolean }>()
const emit = defineEmits<(e: 'update:state', value: boolean) => void>()

const { search, commandGroups, isReady } = useSearchEngine()

import { watch } from 'vue'

const handleSelect = (execute: () => void) => {
  emit('update:state', false)
  execute()
}

watch(
  () => props.state,
  (isOpen) => {
    if (!isOpen) {
      setTimeout(() => {
        search.value = ''
      }, 200)
    }
  }
)
</script>

<template>
  <CommandDialog
    :open="props.state"
    :filter-function="() => true"
    @update:open="emit('update:state', $event)"
  >
    <CommandInput
      v-model="search"
      placeholder="Cari link, kategori, atau perintah..."
    />

    <CommandList class="max-h-[360px] md:max-h-[420px]">
      <CommandEmpty
        v-if="search && commandGroups.length === 0 && isReady"
      >
        Tidak ada hasil ditemukan.
      </CommandEmpty>

      <template v-for="(group, index) in commandGroups" :key="group.heading">
        <CommandSeparator v-if="index > 0" />
        <CommandGroup :heading="group.heading">
          <CommandItem
            v-for="item in group.items"
            :key="item.id"
            :value="item.id + ' ' + item.title + (item.description ? ' ' + item.description : '')"
            @select="handleSelect(item.execute)"
            class="cursor-pointer"
          >
            <div class="flex flex-col gap-0.5 w-full">
              <div class="flex items-center">
                <component
                  :is="item.icon"
                  class="mr-2 h-4 w-4 text-muted-foreground shrink-0"
                />
                <span class="font-medium">{{ item.title }}</span>
              </div>
              <span
                v-if="item.description"
                class="text-xs text-muted-foreground ml-6 line-clamp-1 break-all"
              >
                {{ item.description }}
              </span>
            </div>
          </CommandItem>
        </CommandGroup>
      </template>
    </CommandList>

    <div class="border-t border-border/50 bg-muted/30 p-3 flex items-center justify-between text-xs text-muted-foreground backdrop-blur-sm">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1">
          <kbd class="flex h-5 w-5 items-center justify-center rounded border bg-background font-sans text-[10px] shadow-sm">↑</kbd>
          <kbd class="flex h-5 w-5 items-center justify-center rounded border bg-background font-sans text-[10px] shadow-sm">↓</kbd>
          <span class="ml-1">Navigasi</span>
        </div>
        <div class="flex items-center gap-1">
          <kbd class="flex h-5 px-1.5 items-center justify-center rounded border bg-background font-sans text-[10px] shadow-sm">Enter</kbd>
          <span class="ml-1">Pilih</span>
        </div>
        <div class="hidden sm:flex items-center gap-1 opacity-70">
          <kbd class="flex h-5 w-5 items-center justify-center rounded border bg-background font-mono text-[10px] shadow-sm">&gt;</kbd>
          <span class="ml-1">Perintah</span>
        </div>
      </div>
      <div class="flex items-center gap-1">
        <kbd class="flex h-5 px-1.5 items-center justify-center rounded border bg-background font-sans text-[10px] shadow-sm">Esc</kbd>
        <span class="ml-1">Tutup</span>
      </div>
    </div>
  </CommandDialog>
</template>
