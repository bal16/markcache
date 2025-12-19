<script setup lang="ts">
import { File, Hash } from "lucide-vue-next";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "~/components/ui/command";
import { defaultResults } from "~/const";

const props = defineProps<{
  state: boolean;
}>();

const emit = defineEmits<{
  (e: "update:state", value: boolean): void;
}>();

const router = useRouter();
const search = ref("");

const { data: sections } = await useAsyncData("search", () =>
  queryCollectionSearchSections("content")
);

const filteredResults = computed(() => {
  if (!search.value) return defaultResults;
  if (!sections.value) return [];

  const query = search.value.toLowerCase();
  return sections.value
    .filter((section) => {
      return (
        section.title?.toLowerCase().includes(query) ||
        section.content?.toLowerCase().includes(query)
      );
    })
    .map((section) => ({
      id: section.id,
      title: section.title,
      path: section.id,
      type: "section" as const,
      subtitle: section.titles?.join(" > "),
    }));
});

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
    <CommandInput v-model="search" placeholder="Type a command or search..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Results">
        <CommandItem
          v-for="item in filteredResults"
          :key="item.id"
          :value="item.title + ' ' + search"
          @select="handleSelect(item.path)"
        >
          <div class="flex flex-col gap-0.5">
            <span v-if="item.subtitle" class="text-xs text-muted-foreground">
              {{ item.subtitle }}
            </span>
            <div class="flex items-center">
              <File v-if="item.type === 'file'" class="mr-2 h-4 w-4" />
              <Hash v-else class="mr-2 h-4 w-4" />
              <span>{{ item.title }}</span>
            </div>
          </div>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandDialog>
</template>
