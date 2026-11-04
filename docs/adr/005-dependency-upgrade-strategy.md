# ADR-005: Strategi Upgrade Dependencies — Major & Minor Bumps

Status: Completed
Date: 2026-11-04
Deciders: bal16

## Context

`pnpm outdated` menunjukkan 23 package outdated, termasuk 4 **major version bump** yang berpotensi breaking changes:

| Package | Current → Target | Jenis | Breaking Risk |
|---------|------------------|-------|---------------|
| `vue-router` | 4.6.4 → **5.4.0** | Major | Rendah (project tidak pakai `unplugin-vue-router`) |
| `@vueuse/core` | 14.1.0 → **15.0.0** | Major | Rendah (butuh Vue 3.5+, sudah terpenuhi) |
| `better-sqlite3` | 12.5.0 → **13.0.3** | Major | Sedang (migrasi ke N-API, butuh Node 18+) |
| `@nuxt/content` | 3.9.0 → **3.16.2** | Minor (tapi banyak API migration) | **Tinggi** — API navigation, surroundings, types, studio |
| `nuxt` | 4.2.2 → **4.6.4** | Minor | Rendah (opt-in TS project references) |
| `reka-ui` | 2.6.1 → **2.11.0** | Minor | Sedang (CSS vars `radix-*` → `reka-*`) |
| `@lucide/vue` | 1.30.0 → **1.67.0** | Minor | Sedang (banyak rename icon) |
| `tailwindcss` + `@tailwindcss/vite` | 4.1.18 → **4.3.4** | Minor | Rendah |

Project menggunakan:

- Nuxt 4 (native file-based routing, **bukan** `unplugin-vue-router`)
- `@nuxt/content` v3 untuk content layer (navigation, queryContent, MDC)
- `reka-ui` + `shadcn-nuxt` untuk UI primitives
- `better-sqlite3` untuk search index / local data (via Fuse.js)
- Vue 3.5.25, Node 20+ di CI/produksi

## Decision

### 1. Tahap 1 — Minor & Patch Updates (Low Risk) — **Hari ini**

Update semua minor/patch **kecuali** 4 major di atas + `@nuxt/content` + `reka-ui`:

- `@lucide/vue`, `fuse.js`, `tailwind-merge`, `tailwindcss`, `@tailwindcss/vite`, `@tailwindcss/typography`, `@vueuse/core` (patch), `oxlint`, `@biomejs/biome`, `lint-staged`, `markdownlint-cli2`, `@iconify/*`, `@nuxtjs/color-mode`, `husky`, `tw-animate-css`, `@fontsource/*`, `class-variance-authority`, `clsx`, `vue`, `vue-router` (patch 4.x)

### 2. Tahap 2 — `reka-ui` 2.11 + `shadcn-nuxt` 2.9 — **Hari ini (setelah Tahap 1)**

- Update `reka-ui` → 2.11.0, `shadcn-nuxt` → 2.9.0
- **Migration wajib**: CSS variables `--radix-*` → `--reka-*`, data attributes `data-radix-*` → `data-reka-*`
- Cek semua komponen custom yang extend Reka UI primitives

### 3. Tahap 3 — `better-sqlite3` v13 — **Hari ini (setelah Tahap 2)**

- Update ke 13.0.3
- Verifikasi build CI (prebuilt N-API binaries, tidak perlu compile from source)
- Tes search/indexing flow yang pakai `better-sqlite3`

### 4. Tahap 4 — `vue-router` v5 + `@vueuse/core` v15 — **Besok**

- `vue-router` 5.4.0: **No breaking changes** untuk Nuxt native routing (hanya import path changes untuk `unplugin-vue-router` users)
- `@vueuse/core` 15.0.0: Vue 3.5+ requirement terpenuhi, cek fungsi yg dipakai di codebase
- Update `nuxt` ke 4.6.4 sekaligus (minor, safe)

### 5. Tahap 5 — `@nuxt/content` v3.16 — **Besok (butuh waktu paling banyak)**

**High risk — butuh audit kode dulu:**

- `fetchContentNavigation()` → `queryCollectionNavigation('collection')`
- `queryContent().findSurround()` → `queryCollectionItemSurroundings()`
- `NavItem` types → `ContentNavigationItem`
- Studio deprecated → migrasi ke `content.preview.api` di `nuxt.config.ts`
- Cek semua file di `app/`, `components/`, `composables/`, `server/` yang import `@nuxt/content`

### 6. Verifikasi Tiap Tahap

```bash
pnpm install && pnpm typecheck && pnpm lint && pnpm build && pnpm generate
```

Jika gagal → rollback tahap tersebut, fix, ulangi.

## Alternatives Considered

- **All-in-one `pnpm up --latest`**: Ditolak. Terlalu banyak breaking changes sekaligus, sulit bisect kalau build gagal.
- **Hanya minor/patch, skip major**: Ditolak. `vue-router` v4, `@vueuse/core` v14, `better-sqlite3` v12 akan EOL/maintenance-only. `@nuxt/content` v3.9 sudah 7 minor behind.
- **Upgrade `@nuxt/content` dulu**: Ditolak. Paling risky, sebaiknya stabilkan foundation (Vue, Router, Nuxt, UI) dulu.

## Consequences

### Positif

- Keamanan: patch CVE di `better-sqlite3`, `oxlint`, `biome`, dll.
- DX: Nuxt 4.6 TS project references, Vue Router 5 readiness, Tailwind 4.3 perf
- Fitur baru: Reka UI 2.11 components, Lucide 1.67 icons, VueUse 15 composables
- Maintenance: stay dalam supported versions

### Negatif / Risiko

- **Waktu engineering**: ~2-3 hari kerja untuk Tahap 5 (`@nuxt/content` migration)
- **CSS breakage**: Reka UI prefix change bisa silent-break custom styles
- **Content query breakage**: `@nuxt/content` API changes akan error runtime kalau tidak di-migrate

### Mitigasi

- Branch `chore/deps-upgrade-2026-11` per tahap, PR per tahap
- Snapshot `pnpm-lock.yaml` sebelum mulai
- Visual regression: `pnpm generate` + cek output `dist/` manual
- Content smoke test: `pnpm dev` → buka halaman docs, navigation, search, MDC components

## Follow-up

- ADR-006: Content Migration Checklist (detail mapping old→new API)
- ADR-007: Reka UI CSS Variable Audit (inventarisasi `--radix-*` usage)
