# ADR-008: Typecheck Dipindah dari Pre-Commit ke Pre-Push

Status: Accepted
Date: 2026-11-07
Deciders: bal16
Supersedes: ADR-004

## Context

ADR-004 memilih typecheck kondisional di pre-commit: hanya berjalan saat file
kode di-stage. Pengukuran ulang di repo ini menunjukkan biaya itu masih terlalu
tinggi untuk ritme commit:

- Pre-commit dengan 1 file `.vue`: **~7,1 detik**.
- Pre-commit konten `.md` saja: ~0,76 detik.
- `pnpm typecheck` (`nuxi typecheck` → `vue-tsc`): **~6,5 detik**.
- Biome, oxlint, dan markdownlint berjalan paralel; total wall time ketiganya
  ~0,8 detik.

Upaya mempercepat typecheck (semua ditolak oleh data):

- **Incremental TypeScript.** `typescript.tsConfig.compilerOptions.incremental`
  membuat run tanpa perubahan turun ke ~0,5 detik (`vue-tsc -b --noEmit`), tetapi
  begitu satu file `.vue` diedit, `vue-tsc` tetap me-recheck semua SFC: ~5,4 detik.
  Commit nyata selalu mengubah file, jadi incremental tidak menolong pre-commit.
- **Typecheck per-file.** Tsconfig sementara yang hanya memuat file berubah tetap
  butuh ~2,6–4,2 detik karena memuat tipe Nuxt; tidak cukup cepat dan berisiko
  melewatkan error lintas file.
- **Golar (native/tsgo).** Versi `0.1.11`, membundel TypeScript 7.0 (breaking
  changes vs TS 5.9), dan masih ada perbedaan hasil dengan `vue-tsc`
  (issue #37, #6 di `auvred/golar`). Belum layak jadi checker utama; layak
  di-spike terpisah.

Kesimpulan: durasi typecheck per commit tidak bisa dikompres secara berarti.
Yang bisa dihemat adalah **frekuensinya**.

## Decision

1. **Hapus typecheck dari pre-commit.** `lint-staged.config.mjs` hanya
   menjalankan `biome check --write`, `oxlint`, dan `markdownlint-cli2 --fix`.
   Commit kode maupun konten harus selesai <1 detik.
2. **Jalankan typecheck sekali per push.** `.husky/pre-push` berisi
   `pnpm typecheck`, sehingga error tipe tetap tertangkap sebelum sampai ke
   remote.
3. **Script `pnpm typecheck` tidak berubah** (`nuxi typecheck`), jadi CI dan
   pemakaian manual tetap sama.
4. **CI minimal tetap ditunda** sesuai ADR-004. Sampai CI dipasang, pre-push
   adalah satu-satunya jaring typecheck otomatis.

## Alternatives Considered

- **Pertahankan typecheck kondisional di pre-commit (ADR-004):** ditolak.
  Commit yang menyentuh kode tetap 5–7 detik, bertentangan dengan target commit
  instan.
- **Incremental + `vue-tsc` langsung tanpa `nuxi`:** ditolak untuk pre-commit
  karena tetap ~5,4 detik setelah edit; bisa ditinjau ulang kalau pre-push
  terasa lambat pada push berulang tanpa perubahan.
- **Golar sebagai checker utama:** ditolak untuk sekarang (lihat Context).
  Boleh dicoba sebagai spike time-boxed dengan `vue-tsc` tetap sebagai pembanding.
- **Hapus typecheck total:** ditolak. Pre-push mempertahankan jaring tanpa
  membebani commit.

## Consequences

- Pre-commit kode turun dari ~7,1 detik menjadi **~0,4 detik** (terukur 387 ms
  dengan 1 file `.vue`).
- Pre-push menambah ~6,5–7,5 detik sekali per push.
- Lubang yang disadari dan diterima: `git push --no-verify`, kontributor tanpa
  hook terinstall, edit via web, dan merge yang pecah tanpa sinyal. Sama seperti
  ADR-004, lubang ini mengecil saat CI dipasang.
- File yang berubah: `lint-staged.config.mjs`, `.husky/pre-push` (baru),
  status ADR-004.
- Pemicu peninjauan ulang: CI dipasang, Golar mencapai paritas dengan `vue-tsc`,
  atau pre-push mulai terasa mengganggu.
