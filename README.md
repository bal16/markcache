![MarkCache](https://shieldcn.dev/header/glow.svg?title=MarkCache&subtitle=Direktori+link+terkurasi+ala+FMHY%2C+fokus+ID-first&logo=lu:Bookmark&theme=emerald)

![Nuxt](https://shieldcn.dev/badge/Nuxt-4-00DC82.svg?logo=nuxt)
![Vue](https://shieldcn.dev/badge/Vue-3-4FC08D.svg?logo=vuedotjs)
![TypeScript](https://shieldcn.dev/badge/TypeScript-5-3178C6.svg?logo=typescript)
![Tailwind CSS](https://shieldcn.dev/badge/Tailwind-v4-06B6D4.svg?logo=tailwindcss)
![shadcn/vue](https://shieldcn.dev/badge/shadcn%2Fvue-000000.svg?logo=shadcnui)

**Direktori link terkurasi ala [FMHY](https://fmhy.net), dengan fokus ID-first.** Deskripsi ditulis dalam Bahasa Indonesia dan nama tool tetap global. Layanan serta
komunitas Indonesia diprioritaskan. Bukan docs-starter generik: setiap kategori adalah daftar link
terkurasi yang bisa dijelajahi dari [landing](/) ke halaman kategori, lalu klik keluar,
atau dicari dengan `⌘K`.

Kategori aktif: **Streaming, Dev Tools, Dev Hub, Torrenting, Downloading, AI Tools,
Reading, Audio, Agent & MCP, Student Deals, dan Games**. Kategori baru hanya tampil
setelah benar-benar terisi (lihat ADR-001).

## Stack

- [Nuxt 4](https://nuxt.com) + `@nuxt/content` (Markdown, prerender statis)
- shadcn-nuxt + Tailwind CSS v4, dark mode
- Search `⌘K` berbasis Fuse (`/api/search.json`, di-prerender)
- `contentlint`: linter konten kurasi (ADR-002)
- `content/` dibuka sebagai **vault Obsidian** (pola hybrid, ADR-002)

## Development

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Kontribusi konten

Konten adalah Markdown biasa di `content/`: satu folder = satu kategori, `index.md` =
halaman kategori, `## H2` = subkategori, dan tiap link satu bullet:

```md
- [Nama Tool](https://example.com) — deskripsi singkat Indonesia. `tag` ⭐
```

1. Salin `content/_templates/kategori.md` untuk kategori baru.
2. Lint sebelum commit:

```bash
pnpm contentlint:fix   # format + aturan ADR-002
pnpm lint:md           # markdownlint
pnpm lint              # oxlint
```

Alat lain:

```bash
pnpm build             # build + prerender
pnpm preview           # preview hasil build
```

Keputusan arsitektur dicatat di [`docs/adr/`](docs/adr/):

- [ADR-001 — Arah Produk: Direktori Kurasi ala FMHY, ID-First](docs/adr/001-product-direction-fmhy-id-first.md)
- [ADR-002 — Konten Obsidian-Friendly, Pola Hybrid](docs/adr/002-obsidian-friendly-hybrid-content.md)
- [ADR-003 — Arsitektur Directory MVP (Reuse, Bukan Rewrite)](docs/adr/003-directory-mvp-architecture.md)<|end|><|start|>-start to=edit<|channel|>analysis <|constrain|>xml<|message|><rfl:parameter name="path">
/home/bal/workspace/project/markcache/README.md
