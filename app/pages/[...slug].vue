<script setup lang="ts">
import GoToTop from "~/components/GoToTop.vue";
import TableOfContents from "~/components/TableOfContents.vue";

const { pageData: page } = await usePageData();

definePageMeta({
  layout: "docs",
});

useSeoMeta({
  title: `MarkCache${page.value?.title}`,
  description: page.value?.description,
});
</script>

<template>
  <div id="page-top" class="container max-w-5xl py-6 lg:py-8 relative">
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-10 p-6 w-full">
      <article
        class="prose prose-sm dark:prose-invert max-w-none min-w-0 prose-headings:scroll-m-20"
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

      <aside class="hidden lg:block h-full">
        <div class="sticky top-20 h-[calc(100vh-10rem)] overflow-y-auto w-62.5">
          <div class="">
            <TableOfContents
              v-if="page?.body?.toc?.links"
              :toc="page.body.toc"
            />
          </div>
          <div class="mt-6 border-t pt-4">
            <GoToTop />
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
