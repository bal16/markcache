import { ref, watch, onUnmounted, nextTick, type Ref } from "vue";

export function useTocObserver(links: Ref<any[]>) {
  const activeId = ref<string | null>(null);
  let observer: IntersectionObserver | null = null;

  const initObserver = () => {
    if (typeof IntersectionObserver === "undefined") return;
    if (observer) observer.disconnect();

    const idsToObserve: string[] = [];
    const collectIds = (items: any[]) => {
      items.forEach((item) => {
        idsToObserve.push(item.id);
        if (item.children) collectIds(item.children);
      });
    };
    collectIds(links.value);

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeId.value = entry.target.id;
          }
        });
      },
      {
        rootMargin: "-100px 0px -60% 0px",
        threshold: 0,
      }
    );

    idsToObserve.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer?.observe(el);
    });
  };

  watch(
    links,
    async () => {
      await nextTick();
      initObserver();
    },
    { immediate: true }
  );

  onUnmounted(() => {
    observer?.disconnect();
  });

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // const top = el.getBoundingClientRect().top + window.scrollY - 100;
    // console.log("🚀 ~ scrollToId ~ top:", top);

    // window.scrollTo({ top, behavior: "smooth" });
    el.scrollIntoView({ behavior: "smooth", block: "start" });

    // console.log("🚀 ~ scrollToId ~ currentPosition:", window.scrollY);
    activeId.value = id;
  };

  return {
    activeId,
    scrollToId,
  };
}
