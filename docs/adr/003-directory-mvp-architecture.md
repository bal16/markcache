# ADR-003: Arsitektur Directory MVP (Reuse, Bukan Rewrite)

Status: Accepted
Date: 2026-09-08
Deciders: bal16

## Context

Scope MVP yang dipilih: **Directory MVP** — schema + 1 kategori nyata + grid +
filter + search.

Arsitektur saat ini (hasil pemetaan repo):

- Routing: `app/pages/index.vue` (`/`, landing statis) + `app/pages/[...slug].vue`
  (catch-all renderer, `layout: 'docs'`, data via `app/composables/usePageData.ts`
  → `queryCollection('content').path(route.path).first()`).
- Navigasi: `app/composables/useNavigationItem.ts` →
  `queryCollectionNavigation('content').order('title', 'ASC')`, dirender
  `Sidebar.vue / MobileSidebar.vue / SidebarItem.vue` sebagai pohon filesystem.
- Search: `server/api/search.json.get.ts` (`queryCollectionSearchSections` +
  aksi tema) → prerender `/api/search.json`; klien
  `app/composables/useSearchEngine.ts` (Fuse: `title^0.9, titles^0.5, content^0.1`,
  `threshold 0.3`, top 15) → grup Pages/Sections/Actions di `SearchDialog.vue`.
- SEO bermasalah (`TODO.md`): `[...slug].vue` memakai
  `` `MarkCache${page.value?.title}` `` (tanpa spasi, non-reaktif); tanpa
  `titleTemplate`, `og:*`, `canonical`, sitemap.
- `TODO.md` juga mencatat: `ui: minor fixes especially in mobile`,
  `Feat: save content in object storage?`.

## Decision

**Reuse maksimal, tambah seperlunya, tunda sisanya.**

1. **Schema longgar, linter ketat.** Tambah schema Zod minimal di
   `content.config.ts` untuk field ADR-002
   (`category, icon, tags, updated, draft, featured`) dengan semua field baru
   opsional + default, agar konten lama tidak pecah saat migrasi. Mutu
   ditegakkan `contentlint` (ADR-002), bukan validasi build yang galak.
2. **Satu koleksi dulu.** Tidak ada koleksi kedua (`pages` + `directory`) di MVP.
   Alasan: pola hybrid ADR-002 membuat satu koleksi `page` cukup; koleksi ganda
   menambah kompleksitas query/search tanpa manfaat MVP.
3. **Landing jadi query, bukan hardcoded.** `app/pages/index.vue` membaca koleksi
   (`draft = false`), hanya kategori `featured` yang tampil penuh. Hapus fallback
   "semua link ke `/docs`".
4. **Sidebar diurutkan kurasi.** Ganti `order('title','ASC')` menjadi
   `featured/order` (tambah field `order` opsional atau `navigationMeta`);
   tampilkan `icon + count`. Pertahankan komponen `Sidebar*` yang ada.
5. **Search diperluas ke link.** `search.json.get.ts` mem-flatten bullet-link
   body (`title + url + desc`) menjadi entri Fuse berikut bobot
   `tags/category`; klien tambah grup `Links (↗)` + aksi `open external / copy link`.
   Filter `?tag=` dikerjakan client-side (`useDirectoryFilter`) di halaman
   kategori pada MVP; facet server-side ditunda.
6. **SEO diperbaiki seperlunya.** `titleTemplate: '%s — MarkCache'`,
   `description` reaktif + fallback, `og:/twitter:/canonical` dasar.
   Sitemap module menyusul setelah URL kategori stabil.
7. **Ditunda eksplisit:** object storage (tidak dibutuhkan untuk link-list
   statis), koleksi kedua, impor otomatis, sitemap penuh, polish mobile besar
   (hanya bug visible).

Urutan kerja: kontrak konten + `contentlint` → 1 kategori nyata →
landing query → sidebar order → search link → SEO dasar.

## Alternatives Considered

- **Rewrite routing (`/c/[slug]`, `/t/[tag]` khusus):** ditolak untuk MVP.
  Catch-all `[...slug].vue` + folder-per-kategori sudah menghasilkan URL bersih
  (`/streaming`); rute khusus menambah permukaan uji tanpa nilai kurasi baru.
- **DB/CMS + object storage sekarang:** ditolak. Link-list statis tidak butuh
  upload biner; prerender + Git PR (solo + open-contrib) lebih murah dan
  auditabel. Tinjau ulang hanya jika ada kebutuhan thumbnail/upload pengguna.
- **Schema Zod ketat + build gagal bila konten cacat:** ditolak untuk MVP.
  Menghambat kontribusi dan migrasi; linter peringatan + 1 contoh emas lebih efektif.
- **Facet/filter server-side penuh:** ditunda. Client-side cukup untuk 1 vertikal;
  pindah ke server saat jumlah link > ratusan atau butuh SEO per-tag.

## Consequences

- File yang akan berubah (MVP): `content.config.ts`, `content/**` (arsip
  placeholder + 1 kategori nyata), `app/pages/index.vue`,
  `app/composables/useNavigationItem.ts`, `Sidebar*.vue`,
  `server/api/search.json.get.ts`, `app/composables/useSearchEngine.ts`,
  `SearchDialog.vue`, `app/pages/[...slug].vue` (SEO), `package.json`
  (script `contentlint`), `README.md` (positioning baru).
- Kriteria selesai MVP: `/` menampilkan grid kategori nyata; `/streaming`
  menampilkan subkategori + link terkurasi; `⌘K` menemukan link per nama/tag;
  `?tag=vpn` memfilter; `pnpm build && preview` + `lint` hijau.
- Risiko: parsing bullet-link rapuh bila kontributor menyimpang format →
  mitigasi via `contentlint` + template + 1 contoh emas, bukan parser toleran.
- ADR ini disupersede bila: jumlah kategori/link menuntut koleksi kedua,
  facet server-side, atau kebutuhan storage biner muncul.
