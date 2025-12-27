<script lang="ts" setup>
import { ArrowUp } from "lucide-vue-next";
import { Button } from "~/components/ui/button";

function scrollToTop() {
  const topElement = document.getElementById("page-top");
  if (topElement) {
    topElement.scrollIntoView({ behavior: "smooth" });
  }
}
</script>
<template>
  <Button
    @click.prevent="scrollToTop"
    variant="ghost"
    class="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
  >
    Back To Top <ArrowUp class="ml-2 h-4 w-4" />
  </Button>
</template>
