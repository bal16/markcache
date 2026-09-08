# ADR-001: Arah Produk — Direktori Kurasi ala FMHY, ID-First

Status: Accepted
Date: 2026-09-08
Deciders: bal16

## Context

MarkCache saat ini adalah template docs generik:

- Landing `app/pages/index.vue` memakai `categories[]` hardcoded (Getting Started,
  Architecture, API Reference, Components, Deployment) yang semuanya `link: '/docs'`.
- Isi `content/first/index.md`, `content/second/*`, `content/forth.md` masih `lorem ipsum`.
- `README.md` masih `Nuxt Minimal Starter` generik.
- `TODO.md` mencatat `Content: copy from fmhy (fmhy.net) and copy only needed`
  dan `enhancement: rebrand usage of app`.

Modal yang sudah ada: Nuxt 4 + `@nuxt/content` + prerender statis (`nuxt.config.ts`),
command palette search `⌘K` (`app/components/SearchDialog.vue` + Fuse di
`app/composables/useSearchEngine.ts`), dark mode, layout docs
(`app/layouts/docs.vue` + `Sidebar` + `TableOfContents`).

Referensi arah baru: FMHY (`https://fmhy.net`) — halaman `/` berupa grid kategori
(Streaming, Listening, Gaming, Reading, Downloading, Torrenting, dst.),
tiap kategori adalah halaman daftar link terkurasi `[{name, url, desc, badge}]`.

## Decision

1. MarkCache menjadi **situs direktori/kurasi link ala FMHY**, bukan template docs generik.
2. Positioning **ID-first, EN-second**: deskripsi Indonesia, nama tool tetap Inggris,
   prioritaskan tambahan link/komunitas/layanan lokal Indonesia. FMHY EN-global
   adalah pelengkap, bukan lawan breadth.
3. **Mulai 1 vertikal dulu sebagai tracer-bullet** (usulan: streaming/downloading).
   Kategori lain boleh tampil di grid landing tapi bertanda `draft: true` /
   "segera hadir" sampai benar-benar terisi. Tidak ada lagi kategori kosong
   berisi lorem.
4. Konten mengikuti prinsip `TODO.md`: subset FMHY yang dibutuhkan saja, ditulis
   ulang/diseleksi, bukan mirror penuh.

## Alternatives Considered

- **Mirror FMHY penuh (EN):** ditolak. Kalah breadth dan kecepatan update dari
  komunitas FMHY yang besar; tidak ada diferensiasi.
- **Tetap docs-starter generik:** ditolak. Tidak menjawab `rebrand usage of app`;
  pasar template docs sudah jenuh (VitePress, Docus, Starlight).
- **Banyak vertikal sekaligus di hari-1:** ditolak. Risiko kembali ke lorem
  placeholder; satu vertikal nyata lebih meyakinkan daripada 12 kategori kosong.

## Consequences

- Hapus/arsip konten placeholder (`content/first`, `content/second`, `content/forth.md`).
- Landing `app/pages/index.vue` berubah dari hardcoded menjadi query koleksi
  (hanya `draft: false` yang tampil).
- `README.md`, SEO title/meta (`TODO.md: SEO current title and meta not correct`),
  dan tagline hero ditulis ulang mengikuti positioning baru.
- Perlu definisi kualitas kurasi: kapan link layak masuk, kapan dicabut
  (domain mati, paywall total, scam) — diatur di ADR-002 (linter) dan panduan kontribusi.
- Ukuran sukses MVP: 1 kategori nyata bisa dijelajah dari `/` → halaman kategori
  → klik link keluar → ketemu via `⌘K`.
