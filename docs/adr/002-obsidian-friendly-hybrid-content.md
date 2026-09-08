# ADR-002: Konten Obsidian-Friendly, Pola Hybrid

Status: Accepted
Date: 2026-09-08
Deciders: bal16

## Context

Kontribusi diputuskan `solo-curated + open-contrib`: pemilik mengkurasi lokal,
kontributor eksternal bisa PR. Syarat pemilik: `content/` bisa dibuka sebagai
**Obsidian vault** (baca/tulis nyaman di Obsidian, bukan cuma di web).

Koleksi saat ini (`content.config.ts`):

```ts
content: defineCollection({ type: 'page', source: '**/*.md' })
```

Tanpa schema. Frontmatter semua file identik
(`title, description, date, tags: ["nuxt","markdown","tutorial"]`), body lorem.
Tidak ada konvensi kategori/subkategori/link.

Tegangan desain:

- Obsidian nyaman dengan: GFM polos, YAML frontmatter standar, bullet list link
  di body, folder = kategori, `index.md` per folder.
- Nuxt Content nyaman dengan: frontmatter terstruktur
  (`links: [{title, url, description, tags, badge}]`) yang mudah di-query/filter.

## Decision

Pakai **pola hybrid, Obsidian-first**:

1. **Frontmatter minimal + standar** (key lowercase, tipe longgar):
   `title, description, category, icon, tags[], updated, draft, featured`.
   Contoh: `category: "streaming"`, `tags: ["video", "streaming"]`,
   `updated: "2026-09-08"`, `draft: false`.
2. **Body konvensional, bukan komponen MDX**:
   `H2 = subkategori`, tiap resource satu bullet:
   `- [Nama](https://example.com) — deskripsi singkat. \`tag1\` ⭐`
   Tidak memakai `::card`,`::alert`, atau sintaks Nuxt-only lain di`content/`
   pada v1, agar tetap terbaca sebagai vault Obsidian biasa.
3. **Satu folder = satu kategori**, `index.md` sebagai halaman kategori.
   Contoh: `content/streaming/index.md` → `/streaming`.
4. **Validasi berat pindah ke linter** (`contentlint`), bukan schema Zod ketat —
   schema hanya menjamin field terbaca, linter yang menegakkan mutu
   (contoh: `updated` segar, tidak ada lorem, format bullet dipatuhi).
5. **Dilarang di v1**: `[[wikilink]]`, `!embed`, Dataview/DataviewJS di dalam
   `content/`. Alasan: `@nuxt/content` tidak me-resolve wikilink secara native;
   campurannya akan pecah di salah satu sisi. Pakai relative markdown link biasa.

Contoh file kategori:

```md
---
title: "Streaming"
description: "Nonton & download film/series."
category: "streaming"
icon: "clapperboard"
tags: ["video", "streaming"]
updated: "2026-09-08"
draft: false
featured: true
---

## Film & Series

- [Contoh A](https://example.com) — streaming 1080p, tanpa daftar. `gratis` ⭐
- [Contoh B](https://example.com/b) — perlu VPN di ID. `vpn`
```

## Alternatives Considered

- **`links[]` terstruktur penuh di frontmatter:** ditolak untuk v1. Enak di-query
  (`queryCollection` + filter facet), tapi di Obsidian menjadi tembok YAML yang
  tidak nyaman dibaca/diedit, menaikkan friksi kontributor non-teknis.
- **MDX components (`::resource-card`):** ditolak untuk v1. Kaya di web, rusak di
  Obsidian (render sebagai teks mentah). Bisa dipertimbangkan lagi di v2 sebagai
  progressive enhancement via remark plugin yang mem-parsing bullet konvensional
  (hasil web kaya, sumber tetap polos).
- **Koleksi `data` YAML terpisah untuk link:** ditolak untuk v1. Menambah
  sinkronisasi ganda (YAML + narasi MD) dan membingungkan kontributor.

## Consequences

- Perlu script `contentlint` + hook `lint-staged` (menjawab
  `TODO.md: formatter or linter for content?`): cek frontmatter wajib, larangan
  lorem/wikilink/Dataview, format bullet, freshness `updated`.
- Perlu remark/Prose enhancement di renderer (`[...slug].vue`): external icon,
  favicon, badge `⭐/vpn/gratis` — tanpa mengubah sumber markdown.
- Perlu template Obsidian: `content/_templates/kategori.md`, pengaturan vault
  minimal; `.obsidian/` disetujui masuk repo secara allowlist (bukan ignore total).
- Migrasi: arsip placeholder lama, tulis 1 kategori nyata mengikuti pola ini
  sebagai referensi (`content/streaming/index.md`).
- Konsekuensi query: filter per-link (mis. `?tag=vpn`) dikerjakan client-side
  dengan parsing ringan di v1; index server-side menyusul di ADR-003.
