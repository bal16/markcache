# MarkCache

**Direktori link terkurasi ala [FMHY](https://fmhy.net) — ID-first.** Deskripsi
ditulis dalam Bahasa Indonesia, nama tool tetap global, dan layanan/komunitas
Indonesia diprioritaskan. Bukan docs-starter generik; setiap kategori adalah
daftar link terkurasi yang bisa dijelajahi dari [landing](/) → halaman kategori
→ klik keluar, atau dicari dengan `⌘K`.

Kategori aktif: **Streaming, Dev Tools, Dev Hub, Torrenting, Downloading,
AI Tools, Reading, Audio, Agent & MCP, Gratis Mahasiswa, dan Games**. Kategori
baru hanya tampil setelah benar-benar terisi (lihat ADR-001).

## Stack

- [Nuxt 4](https://nuxt.com) + `@nuxt/content` (Markdown, prerender statis)
- shadcn-nuxt + Tailwind CSS v4, dark mode
- Search `⌘K` berbasis Fuse (`/api/search.json`, di-prerender)
- `contentlint` — linter konten kurasi (ADR-002)
- `content/` dibuka sebagai **vault Obsidian** (pola hybrid, ADR-002)

## Development

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Kontribusi konten

Konten adalah Markdown biasa di `content/` — satu folder = satu kategori,
`index.md` = halaman kategori, `## H2` = subkategori, dan tiap link satu bullet:

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
- [ADR-003 — Arsitektur Directory MVP (Reuse, Bukan Rewrite)](docs/adr/003-directory-mvp-architecture.md)
