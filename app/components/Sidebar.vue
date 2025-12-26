<script setup lang="ts">
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { ChevronRight } from "lucide-vue-next";
import { truncateString } from "~/lib/utils";

const { data: navigation } = await useAsyncData("navigation", () => {
  return queryCollectionNavigation("content").order("title", "ASC");
});

const getFolderName = (path: string, fallbackTitle: string) => {
  if (!path) return fallbackTitle;

  const segments = path.split("/").filter(Boolean);
  const folderName = segments[segments.length - 1];

  if (folderName) {
    return folderName.charAt(0).toUpperCase() + folderName.slice(1);
  }

  return fallbackTitle;
};
</script>

<template>
  <aside class="hidden w-64 shrink-0 border-r bg-muted/10 md:block">
    <ScrollArea class="h-full">
      <div class="p-4">
        <nav v-if="navigation" class="grid gap-4 text-sm">
          <template v-for="item in navigation" :key="item.path">
            <Collapsible
              v-if="item.children"
              :default-open="true"
              class="flex flex-col gap-1"
            >
              <CollapsibleTrigger
                class="group mb-1 flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-accent/50"
              >
                {{ getFolderName(item.path, item.title) }}

                <ChevronRight
                  class="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-90"
                />
              </CollapsibleTrigger>

              <CollapsibleContent
                class="grid gap-0.5 border-l border-border/40 ml-2 pl-2"
              >
                <template v-for="child in item.children" :key="child.path">
                  <Collapsible
                    v-if="child.children"
                    :default-open="true"
                    class="mt-2 first:mt-0"
                  >
                    <CollapsibleTrigger class="...">
                      {{ truncateString(child.title, 20) }}
                      <ChevronRight class="..." />
                    </CollapsibleTrigger>
                    <CollapsibleContent class="...">
                      <NuxtLink
                        v-for="subchild in child.children"
                        :key="subchild.path"
                        :to="subchild.path"
                        class="..."
                      >
                        {{ truncateString(subchild.title, 20) }}
                      </NuxtLink>
                    </CollapsibleContent>
                  </Collapsible>

                  <NuxtLink
                    v-else
                    :to="child.path"
                    class="group flex h-7 items-center rounded-md px-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    active-class="bg-accent text-accent-foreground font-semibold"
                  >
                    {{ truncateString(child.title, 20) }}
                  </NuxtLink>
                </template>
              </CollapsibleContent>
            </Collapsible>

            <NuxtLink
              v-else
              :to="item.path"
              class="block rounded-md px-2 py-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              active-class="bg-accent text-accent-foreground"
            >
              {{ truncateString(item.title, 20) }}
            </NuxtLink>
          </template>
        </nav>
      </div>
    </ScrollArea>
  </aside>
</template>
