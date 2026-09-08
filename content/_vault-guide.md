---
title: "Panduan Vault"
description: "Cara membuka content/ sebagai Obsidian vault."
---

# Panduan Vault `content/`

File ini helper lokal (prefix `_`): tidak ikut build web
(`content.config.ts` exclude `**/_*.md`), hanya dibaca di Obsidian.

## Nama vault tampil `content` — bisa di-alias?

Tidak. Obsidian memakai **nama folder sebagai nama vault**,
tidak ada setting alias/display name untuk vault.

Karena folder wajib bernama `content/` (konvensi `@nuxt/content` untuk routing `app/pages/[...slug].vue`), solusinya di sisi cara buka:

1. **Buka repo sebagai vault (disarankan harian):**

   Open Folder → pilih `markcache/`. Nama vault jadi `markcache`, `content/` tampil sebagai subfolder kategori.

2. **Symlink lokal cantik (tidak di-commit):**

   ```bash
   ln -s ~/workspace/project/markcache/content ~/Documents/project/markcache
   ```

   Buka `~/Documents/project/markcache` di Obsidian → tampil `markcache`, isi tetap sama (satu file, dua pintu).

3. **Terima `content`:** tetap Open `content/` langsung.

   Yang tampil bagus di web bukan nama vault, tapi `title` frontmatter.

## Aturan tulis agar lolos web + Obsidian (ADR-002)

- Link internal: markdown relatif, bukan wikilink kurung-siku-ganda.
  Benar: `[Second](./second/second.md)`, `(/streaming)`.
  Salah: wikilink ganda atau embed seru-plus-ganda.
- Satu folder = satu kategori, `index.md` = halaman kategori.
- Frontmatter minimal: `title, description, category, tags, updated, draft, featured`.
- Config vault yang di-commit hanya `content/.obsidian/app.json`
  (`useMarkdownLinks: true`, `newLinkFormat: relative`).
  `workspace.json`, `cache/`, `graph.json` otomatis diabaikan (lihat `.gitignore`).

Jalankan sebelum commit konten:

```bash
node scripts/contentlint.mjs
node scripts/contentlint.mjs --fix
```
