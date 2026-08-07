<script setup lang="ts">
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '~/components/ui/command'

const props = defineProps<{ state: boolean }>()
const emit = defineEmits<{ (e: 'update:state', value: boolean): void }>()

const { search, commandGroups, isReady } = useSearchEngine()

const handleSelect = (execute: () => void) => {
  emit('update:state', false)
  execute()
}
</script>

<template>
  <CommandDialog
    :open="props.state"
    @update:open="emit('update:state', $event)"
  >
    <CommandInput
      v-model="search"
      placeholder="Type to search documentation or commands..."
    />

    <CommandList>
      <div
        v-if="!search"
        class="py-14 text-center text-sm text-muted-foreground"
      >
        <p>Type something to search documentation...</p>
        <p class="mt-2 text-xs opacity-70">
          Type <kbd class="px-1.5 py-0.5 rounded-md bg-muted border font-mono text-[10px]">&gt;</kbd> to see available commands
        </p>
      </div>

      <CommandEmpty
        v-if="search && commandGroups.length === 0 && isReady"
      >
        No results found.
      </CommandEmpty>

      <template v-for="(group, index) in commandGroups" :key="group.heading">
        <CommandSeparator v-if="index > 0" />
        <CommandGroup :heading="group.heading">
          <CommandItem
            v-for="item in group.items"
            :key="item.id"
            :value="search + ' ' + item.title + ' ' + item.description"
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
          <span class="ml-1">Navigate</span>
        </div>
        <div class="flex items-center gap-1">
          <kbd class="flex h-5 px-1.5 items-center justify-center rounded border bg-background font-sans text-[10px] shadow-sm">Enter</kbd>
          <span class="ml-1">Select</span>
        </div>
      </div>
      <div class="flex items-center gap-1">
        <kbd class="flex h-5 px-1.5 items-center justify-center rounded border bg-background font-sans text-[10px] shadow-sm">Esc</kbd>
        <span class="ml-1">Close</span>
      </div>
    </div>
  </CommandDialog>
</template>
