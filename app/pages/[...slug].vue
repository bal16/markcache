<script setup lang="ts">
const route = useRoute();
const slugParam = route.params.slug as string | string[];
const slugPath = Array.isArray(slugParam) ? slugParam.join("/") : slugParam;

// Ambil konten berdasarkan path /docs/<slug>
const { data: markdownPage } = await useAsyncData(() =>
  queryCollection("content").path(`/${slugPath}`).first()
);

definePageMeta({
  layout: "docs",
});

useSeoMeta({
  title: markdownPage.value?.title,
  description: markdownPage.value?.description,
});
</script>

<template>
  <article
    class="prose mx-auto my-8 max-w-4xl px-4 dark:prose-invert sm:px-6 lg:px-8"
  >
    <ContentRenderer v-if="markdownPage" :value="markdownPage" />
    <div v-else>Page not found</div>
  </article>
</template>
