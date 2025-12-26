import { ref, computed } from "vue";
import Fuse, { type FuseResultMatch } from "fuse.js";
import { File, Hash } from "lucide-vue-next";
import type { Component } from "vue";

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  type: "file" | "section";
  icon: Component;
  matches?: readonly FuseResultMatch[];
}

export const useCommandSearch = () => {
  const search = ref("");

  const { data: sections } = useAsyncData("search-sections", () =>
    queryCollectionSearchSections("content")
  );

  const fuseInstance = computed(() => {
    if (!sections.value) return null;
    return new Fuse(sections.value, {
      keys: [
        { name: "title", weight: 0.9 },
        { name: "titles", weight: 0.5 },
        { name: "content", weight: 0.1 },
      ],
      threshold: 0.3,
      ignoreLocation: true,
      includeMatches: true,
    });
  });

  const groupedResults = computed(() => {
    if (!search.value || !fuseInstance.value) return null;

    const results = fuseInstance.value.search(search.value).slice(0, 15);
    const files: SearchResult[] = [];
    const parts: SearchResult[] = [];

    results.forEach((res) => {
      const item = res.item;
      if (item.level === 1) {
        files.push({ ...item, type: "file", icon: File } as SearchResult);
      } else {
        parts.push({
          ...item,
          type: "section",
          matches: res.matches,
          subtitle: item.titles.slice(0, -1).join(" > "),
          icon: Hash,
        } as SearchResult);
      }
    });

    return { files, parts, total: files.length + parts.length };
  });

  const showThemeOptions = computed(() => {
    const q = search.value.toLowerCase();
    return (
      !q ||
      ["theme", "mode", "light", "dark", "system", "color"].some((k) =>
        k.includes(q)
      )
    );
  });

  const getHighlightSnippet = (
    content: string,
    matches?: readonly FuseResultMatch[]
  ) => {
    if (!content || !matches) return "";
    const contentMatch = matches.find((m) => m.key === "content");
    const firstIndex = contentMatch?.indices?.[0];

    if (!firstIndex) return `${content.substring(0, 60)}...`;

    const startIdx = firstIndex[0];
    const endIdx = firstIndex[1];
    const contextStart = Math.max(0, startIdx - 20);
    const contextEnd = Math.min(content.length, endIdx + 40);

    let snippet = content.substring(contextStart, contextEnd);
    if (contextStart > 0) snippet = `...${snippet}`;
    if (contextEnd < content.length) snippet = `${snippet}...`;

    return snippet;
  };

  return {
    search,
    groupedResults,
    showThemeOptions,
    getHighlightSnippet,
  };
};
