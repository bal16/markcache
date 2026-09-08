# ADR-004: Kebijakan Biaya Pre-Commit (Typecheck Kondisional, Tanpa CI Dulu)

Status: Accepted
Date: 2026-09-08
Deciders: bal16

## Context

Hook pre-commit (`.husky/pre-commit`) terasa lambat. Pengukuran di repo ini:

- `pnpm typecheck` (`nuxi typecheck`): **~7 detik di setiap commit**, tanpa kecuali.
- `pnpm exec lint-staged` (kosong): ~0.3 detik; dengan 9 file staged: ~0.4 detik.
- Husky v9 sendiri overhead ≈ nol (file hook = shell script langsung).
- Head-to-head task identik (`biome check --write` + `oxlint`, 9 file):
  lint-staged ~0.43 detik vs lefthook ~0.35 detik (paralel) — selisih ~80ms.

Upaya caching typecheck (ditolak oleh data):

- `.nuxt/*.tsbuildinfo` sudah ada (incremental aktif), namun `vue-tsc -b --noEmit`
  langsung tetap ~5.2–5.5 detik pada run kedua tanpa perubahan.
- `nuxi typecheck` = ~5.3 detik vue-tsc (recheck setiap SFC `.vue`, tidak bisa
  di-incremental-kan secara praktis) + ~1.5 detik tahap `loadNuxt+buildNuxt`
  yang me-regenerasi `.nuxt/tsconfig*` (lihat `typecheck-*.mjs` di `@nuxt/cli`).
- Kesimpulan: durasi typecheck tidak bisa dikompres; yang bisa dihemat adalah
  *frekuensinya*. Mayoritas commit ke depan adalah `content/*.md` (kurasi),
  yang tidak bisa merusak tipe.

## Decision

1. **Typecheck kondisional, bukan unconditional, bukan hapus total.**
   `lint-staged.config.mjs` (menggantikan key `lint-staged` di `package.json`):
   pola `*.{js,mjs,cjs,ts,mts,cts,vue}` memakai function task `() => 'pnpm typecheck'`
   (bentuk fungsi agar nama file staged tidak di-append sebagai argumen).
   `.husky/pre-commit` tinggal satu baris: `pnpm exec lint-staged`.
   Terverifikasi: staged kode → typecheck jalan + lolos (~8.4 detik);
   staged markdown-only (`TODO.md`) → typecheck tidak jalan sama sekali (~0.47 detik).
2. **Tetap husky + lint-staged, tidak migrasi ke lefthook.**
   Selisih ~80ms di bawah ambang terasa; migrasi menambah dependensi biner dan
   langkah `install` per kontributor tanpa untung yang sepadan. Tinjau ulang
   bila hook memiliki 5+ task berat.
3. **CI minimal DITUNDA (keputusan eksplisit: "sementara tidak dulu").**
   Repo belum punya `.github/workflows/`, sehingga hook lokal saat ini adalah
   satu-satunya jaring typecheck. Lubang yang disadari dan diterima:
   `git commit --no-verify`, kontributor tanpa hook terinstall, edit via web,
   dan merge yang pecah tanpa sinyal. Alasan penundaan: fokus ke Directory MVP
   (ADR-003) dulu; jaring kedua menyusul saat kolaborasi eksternal dimulai.
4. **`contentlint` belum masuk hook.** Script ada (`scripts/contentlint.mjs`,
   `pnpm contentlint[:fix]`) tetapi saat ini error pada 4 file placeholder lorem;
   memasukkannya ke hook sekarang akan memblokir semua commit. Masuk hook/CI
   setelah arsip konten placeholder (ADR-001) selesai.

## Alternatives Considered

- **Typecheck tetap unconditional:** ditolak. Menghukum commit kecil sama beratnya
  dengan refactor besar; membunuh ritme commit atomik konten.
- **Hapus typecheck dari hook total:** ditolak. Masih dibutuhkan sebagai jaring
  saat file kode ikut di-stage.
- **Migrasi ke lefthook sekarang:** ditolak (lihat Decision 2).
- **CI minimal sekarang (`typecheck` + `contentlint` + `build`):** ditunda,
  bukan ditolak — direkomendasikan sebagai tindak lanjut pertama saat kontributor
  eksternal masuk atau PR pertama dari web muncul.

## Consequences

- File yang berubah: `lint-staged.config.mjs` (baru), `package.json`
  (hapus key `lint-staged`, tambah script `contentlint`), `.husky/pre-commit`
  (satu baris).
- Kontrak ke depan: setiap pola hook baru harus menjaga commit konten-only <1 detik;
  task >2 detik wajib kondisional-berbasis-staged-files atau pindah ke CI.
- Pemicu peninjauan ulang ADR ini: CI pertama dipasang, hook memiliki 5+ task,
  atau ada insiden main-pecah-tanpa-sinyal.
