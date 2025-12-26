<script lang="ts" setup>
import TableOfContents from "./TableOfContents.vue";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const route = useRoute();
const { data: page } = await useAsyncData(route.path, async () => {
  return await queryCollection("content").path(route.path).first();
});
</script>
<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="ghost"> On This Page </Button>
    </PopoverTrigger>
    <PopoverContent class="w-80" side="bottom" align="end">
      <TableOfContents
        v-if="page && page.body && page.body.toc"
        :toc="page.body.toc"
      />
    </PopoverContent>
  </Popover>
</template>
