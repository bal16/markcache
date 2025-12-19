<script setup lang="ts">
import { ArrowUp } from "lucide-vue-next";
import TableOfContents from "~/components/TableOfContents.vue";
import { Button } from "~/components/ui/button";

const route = useRoute();
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection("content").path(route.path).first();
});

definePageMeta({
  layout: "docs",
});

useSeoMeta({
  title: `MarkCache${page.value?.title}`,
  description: page.value?.description,
});

function scrollToTop() {
  const topElement = document.getElementById("page-top");
  if (topElement) {
    topElement.scrollIntoView({ behavior: "smooth" });
  }
}
</script>

<template>
  <div id="page-top" class="container max-w-5xl py-6 lg:py-8 border-2 relative">
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-10 p-6 w-full">
      <article
        class="prose prose-sm dark:prose-invert max-w-none min-w-0 prose-headings:scroll-m-20 border-2"
      >
        <template v-if="page">
          <h1>{{ page.title }}</h1>
          <p class="lead text-xl text-muted-foreground mb-8">
            {{ page.description }}
          </p>
          <hr class="my-6" />
          <ContentRenderer :value="page" />
        </template>
        <div v-else>
          <h1>404 Not Found</h1>
        </div>
      </article>

      <aside class="hidden lg:block h-full border-2">
        <div
          class="sticky top-20 h-[calc(100vh-10rem)] overflow-y-auto w-62.5 border-2"
        >
          <div class="">
            <TableOfContents
              v-if="page?.body?.toc?.links"
              :links="page.body.toc.links"
            />
          </div>
          <div class="mt-6 border-t pt-4">
            <Button
              @click.prevent="scrollToTop"
              variant="ghost"
              class="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Back To Top <ArrowUp class="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
