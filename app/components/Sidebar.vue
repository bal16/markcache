<script setup lang="ts">
import { ScrollArea } from "~/components/ui/scroll-area";
import Header from "~/components/Header.vue";

// Fetch the navigation tree from Nuxt Content
const { data: navigation } = await useAsyncData("navigation", () =>
  fetchContentNavigation()
);
</script>

<template>
  <!-- Persistent Sidebar -->
  <aside class="hidden w-64 shrink-0 border-r bg-muted/10 md:block">
    <ScrollArea class="h-full">
      <div class="p-4">
        <nav class="grid gap-4 text-sm">
          <!-- Iterate through navigation tree -->
          <template v-for="item in navigation" :key="item._path">
            <!-- Level 1: Categories (Folders) -->
            <div v-if="item.children" class="flex flex-col gap-1">
              <h4
                class="mb-1 rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {{ item.title }}
              </h4>

              <!-- Level 2: Sub-items -->
              <div class="grid gap-0.5 border-l border-border/40 ml-2 pl-2">
                <template v-for="child in item.children" :key="child._path">
                  <!-- Level 2: Sub-Category (Nested Folder) -->
                  <div v-if="child.children" class="mt-2 first:mt-0">
                    <h5
                      class="mb-1 px-2 text-xs font-medium text-foreground/80"
                    >
                      {{ child.title }}
                    </h5>
                    <div
                      class="grid gap-0.5 border-l border-border/40 ml-2 pl-2"
                    >
                      <!-- Level 3: Deep Links -->
                      <NuxtLink
                        v-for="subchild in child.children"
                        :key="subchild._path"
                        :to="subchild._path"
                        class="group flex h-7 items-center rounded-md px-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        active-class="bg-accent text-accent-foreground font-semibold"
                      >
                        {{ subchild.title }}
                      </NuxtLink>
                    </div>
                  </div>

                  <!-- Level 2: Direct Link -->
                  <NuxtLink
                    v-else
                    :to="child._path"
                    class="group flex h-7 items-center rounded-md px-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    active-class="bg-accent text-accent-foreground font-semibold"
                  >
                    {{ child.title }}
                  </NuxtLink>
                </template>
              </div>
            </div>

            <!-- Level 1: Root Links (Files at root) -->
            <NuxtLink
              v-else
              :to="item._path"
              class="block rounded-md px-2 py-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              active-class="bg-accent text-accent-foreground"
            >
              {{ item.title }}
            </NuxtLink>
          </template>
        </nav>
      </div>
    </ScrollArea>
  </aside>
</template>
