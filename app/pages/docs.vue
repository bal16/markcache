<script setup lang="ts">
const { data: markdownPage } = await useAsyncData(() =>
  queryCollection("content").path("/").first()
);

useSeoMeta({
  title: markdownPage.value?.title,
  description: markdownPage.value?.description,
});
</script>

<template>
  <article class="prose">
    <ContentRenderer v-if="markdownPage" :value="markdownPage" />
    <div v-else>MarkdownPage not found</div>
  </article>
</template>
