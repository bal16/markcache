---
title: "Tentang & Kontribusi"
description: "Kenapa MarkCache ada, prinsip kurasi yang dipakai, dan cara menambah atau melaporkan link lewat vault Obsidian maupun PR."
category: "meta"
domain: meta
icon: "book-open"
tags: ["kontribusi", "meta"]
updated: "2026-11-07"
created: "2025-12-19"
draft: false
featured: true
order: 9
---

# Tentang MarkCache

MarkCache adalah situs **direktori link terkurasi ala [FMHY](https://fmhy.net)**,
dengan positioning ID-first: deskripsi ditulis dalam Bahasa Indonesia, nama
tool tetap mengikuti nama global, dan link/layanan/ komunitas Indonesia
diprioritaskan.

## Prinsip kurasi

- Link layak masuk jika: domain aktif, gratis, deskripsi satu kalimat jelas,
  dan tidak dobel dengan link lain di halaman yang sama.
- Link dicabut jika: domain mati, paywall total (tanpa tier gratis), atau
  scam/bisa merugikan pengunjung.
- Kategori kosong tidak pernah tampil: yang belum terisi diperlihatkan
  sebagai "segera hadir" di landing.

## Lapor link mati

Tidak perlu clone repo — buka [New issue](https://github.com/bal16/markcache/issues/new/choose)
dan pilih formulir **Lapor Link Mati**: tulis URL-nya, halaman MarkCache di
mana link itu berada, dan gejalanya. Alternatif aktif (bila kamu tahu) sangat
membantu kurasi. Laporan lewat issue ini lebih cepat ditindak daripada lapor
di mana pun, karena terstruktur dan mudah dicari.

## Cara kontribusi

1. Buka repo di editor, atau `content/` langsung sebagai vault Obsidian
   (lihat `content/_vault-guide.md`).
2. Untuk kategori baru, salin `content/_templates/kategori.md` menjadi
   `content/<nama-kategori>/index.md`.
3. Isi body: satu `## Subkategori` per topik, tiap resource satu bullet
   `- [Nama](https://example.com) — deskripsi singkat. \`tag\``.
4. Jalankan linter sebelum commit:

   ```bash
   node scripts/contentlint.mjs --fix
   ```

5. Kirim PR — checklist format akan muncul otomatis. Pemilik repo akan
   mereview sebelum merge (pola solo-curated + open-contrib).

## Aturan format (v1)

Satu folder = satu kategori, `index.md` = halaman kategori. Frontmatter
minimal: `title, description, category, tags, updated, draft, featured`.
Dilarang memakai wikilink kurung-siku-ganda, embed seru-plus-siku, Dataview,
atau komponen MDX di dalam `content/` supaya file tetap bisa dibuka enak di
Obsidian.

## Stack

Nuxt 4 + `@nuxt/content`, prerender statis, search `⌘K` berbasis Fuse,
dark mode, dan linter konten khusus (`contentlint`).
