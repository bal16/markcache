<script setup lang="ts">
import { Sun, Moon, Laptop } from "lucide-vue-next";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "~/components/ui/command";

const props = defineProps<{ state: boolean }>();
const emit = defineEmits<{ (e: "update:state", value: boolean): void }>();

const router = useRouter();
const colorMode = useColorMode();

const { search, groupedResults, showThemeOptions, getHighlightSnippet } =
  useCommandSearch();

const handleSelect = (path: string) => {
  emit("update:state", false);
  router.push(path);
};

const handleThemeChange = (theme: "light" | "dark" | "system") => {
  colorMode.preference = theme;
  // emit("update:state", false);
};
</script>

<template>
  <CommandDialog
    :open="props.state"
    @update:open="emit('update:state', $event)"
  >
    <CommandInput
      v-model="search"
      placeholder="Type to search documentation..."
    />

    <CommandList>
      <div
        v-if="!search"
        class="py-6 text-center text-sm text-muted-foreground"
      >
        Type something to search...
      </div>

      <CommandEmpty
        v-if="search && groupedResults?.total === 0 && !showThemeOptions"
      >
        No results found.
      </CommandEmpty>

      <CommandGroup v-if="groupedResults?.files.length" heading="Pages">
        <CommandItem
          v-for="item in groupedResults.files"
          :key="item.id"
          :value="item.title"
          @select="handleSelect(item.id)"
          class="cursor-pointer"
        >
          <component :is="item.icon" class="mr-2 h-4 w-4 opacity-70" />
          <span class="font-medium">{{ item.title }}</span>
        </CommandItem>
      </CommandGroup>

      <CommandSeparator
        v-if="groupedResults?.files.length && groupedResults?.parts.length"
      />

      <CommandGroup v-if="groupedResults?.parts.length" heading="Sections">
        <CommandItem
          v-for="item in groupedResults.parts"
          :key="item.id"
          :value="item.title + item.content"
          @select="handleSelect(item.id)"
          class="cursor-pointer"
        >
          <div class="flex flex-col gap-0.5">
            <span
              v-if="item.subtitle"
              class="text-[10px] uppercase tracking-wider text-muted-foreground"
            >
              {{ item.subtitle }}
            </span>
            <div class="flex items-center">
              <component
                :is="item.icon"
                class="mr-2 h-4 w-4 text-muted-foreground shrink-0"
              />
              <span class="font-medium">{{ item.title }}</span>
            </div>
            <span
              class="text-xs text-muted-foreground ml-6 line-clamp-1 break-all"
            >
              {{ getHighlightSnippet(item.content, item.matches) }}
            </span>
          </div>
        </CommandItem>
      </CommandGroup>

      <CommandSeparator v-if="showThemeOptions && groupedResults?.total" />
      <CommandGroup v-if="showThemeOptions" heading="Theme">
        <CommandItem
          value="light"
          @select="handleThemeChange('light')"
          class="cursor-pointer"
        >
          <Sun class="mr-2 h-4 w-4" /> <span>Light Mode</span>
        </CommandItem>
        <CommandItem
          value="dark"
          @select="handleThemeChange('dark')"
          class="cursor-pointer"
        >
          <Moon class="mr-2 h-4 w-4" /> <span>Dark Mode</span>
        </CommandItem>
        <CommandItem
          value="system"
          @select="handleThemeChange('system')"
          class="cursor-pointer"
        >
          <Laptop class="mr-2 h-4 w-4" /> <span>System</span>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandDialog>
</template>
