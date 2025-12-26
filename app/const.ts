interface SearchResult {
  id: string;
  title: string;
  path: string;
  type: "file" | "section";
  subtitle?: string;
}

export const defaultResults: SearchResult[] = [
  {
    id: "/docs",
    title: "Docs",
    path: "/docs",
    type: "file",
    subtitle: "Docs",
  },
  {
    id: "/second/second",
    title: "Example",
    path: "/second/second",
    type: "file",
    subtitle: "second\'s example",
  },
];

export const GITHUB_URL = "https://github.com/bal16/markcache";

