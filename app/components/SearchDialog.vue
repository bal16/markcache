<script setup lang="ts">
import { File } from "lucide-vue-next";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "~/components/ui/command";

const props = defineProps<{
  state: boolean;
}>();

const emit = defineEmits<{
  (e: "update:state", value: boolean): void;
}>();

const router = useRouter();

const { data: results } = await useAsyncData("search", () =>
  queryCollection("content").order("title", "ASC").select("title", "path").all()
);

const handleSelect = (path: string) => {
  if (!path) return;
  emit("update:state", false);
  router.push(path);
};
</script>

<template>
  <!-- forward two-way binding -->
  <CommandDialog
    :open="props.state"
    @update:open="emit('update:state', $event)"
  >
    <CommandInput placeholder="Type a command or search..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Documentation">
        <CommandItem
          v-for="item in results"
          :key="item.path"
          :value="item.title"
          @select="handleSelect(item.path)"
        >
          <div class="flex flex-col gap-0.5">
            <span v-if="item.path" class="text-xs text-muted-foreground">
              {{ item.path }}
            </span>
            <div class="flex items-center">
              <File class="mr-2 h-4 w-4" />
              <span>{{ item.title }}</span>
            </div>
          </div>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandDialog>
</template>
