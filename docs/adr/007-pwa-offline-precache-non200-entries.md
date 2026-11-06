# ADR-007: Precache PWA Tidak Boleh Memuat Entri URL Non-200 (Diagnosa Install Gagal)

Status: Accepted
Date: 2026-11-06
Deciders: bal16

## Context

Gejala yang dilaporkan (diuji di Pixel 6a, Chrome 156, Android):

- Di **browser desktop/Chrome tab**, markcache bekerja offline — reload tersaji dari cache.
- Di **PWA (WebAPK Android)** — setelah reinstall penuh — reload saat offline selalu
  memunculkan halaman error Chrome "You're offline", halaman tidak termuat.

Diagnosa on-device (USB debugging + Chrome DevTools Protocol via adb, bukan tebakan):

1. `navigator.serviceWorker.getRegistration()` pada tab situs di HP = **null**, tetap
   null bahkan setelah reload fresh.
2. Panggilan `register('/sw.js')` manual: **OK, `installing=true`** — lalu dalam <5 detik
   registrasi **hilang total** (`getRegistrations()` → 0). Cache `workbox-precache-v2`
   tertinggal **parsial: 11 dari 94 entri** — konsisten dengan install yang dibatalkan.
3. Probe seluruh 94 URL precache manifest dari jaringan HP terhadap live site menemukan
   **10 URL berstatus non-200**, dan yang fatainya dua:
   - `/404` → balas **404** (halaman error memang disajikan dengan status 404 asli).
   - `/200` → **404** (tidak ada route `/200`; `200.html` hanya fallback static Nuxt).
4. Kebijakan workbox: **satu kali respons non-200 dalam precache manifest menggugurkan
   seluruh install.** Jadi SW baru tidak pernah bisa aktif di install fresh.
5. Penjelasan gejala "di browser works": SW lama dari era precache yang masih valid
   tetap `controlling` dan tidak pernah tergantikan (SW pengganti selalu gagal install),
   sehingga offline di browser tampak sehat. Reinstall PWA memhapus SW lama → fresh
   install selalu gagal → dinding "You're offline".

## Decision

1. **404.html dan 200.html dikeluarkan dari precache** (`nuxt.config.ts` →
   `workbox.globIgnores: ['**/mockServiceWorker.js', '**/404.html', '**/200.html']`).
   Invarian yang bertahan mulai saat ini: **setiap URL di precache manifest harus
   ter-resolve HTTP 200** — halaman error Nuxt (`error.vue`) WAJIB dikonsumsi lewat
   navigasi, tidak lewat precache.
2. **`navigateFallback` tetap `null`.** Situs statis multipage; fallback SPA ke index
   akan menyulap URL asing jadi halaman home offline. Halaman yang tidak ada di precache
   memang diperbolehkan gagal ke network (dan menampilkan error offline) — trade-off
   yang dipilih sadar.
3. **`ignoreURLParametersMatching` menambah `^tag$`** — reload offline dengan filter
   kategori `?tag=...` tetap cache-hit precache, tidak dilempar ke network.
4. **Toast konektivitas (PwaFeedback) berbasis ping nyata** (`/api/search.json?ping=<ts>`,
   timeout 4s, retry ≤3× @1.5s) — `navigator.onLine` di Android sering `true` palsu,
   jadi "Kembali online" hanya muncul setelah ping sukses.
5. **Verifikasi kontrak precache harus masuk checklist deploy**: setelah generate,
   download `sw.js` live dan tegas: fetch semua URL entry — satu saja non-200
   dianggap kegagalan build, bukan warning.

## Lifecycle konten baru — apa yang terjadi saat konten/deploy baru rilis

Flow update SW (`registerType: 'autoUpdate'`, `skipWaiting`, `clientsClaim aktif`):

1. **Deploy baru → `sw.js` di-regenerate** dengan revisi (hash content) berbeda untuk
   semua aset yang berubah + URL halaman baru (di-inject dari `content/*.md` yang jadi
   route baru) plus payload (`/_payload.json`) mereka.
2. **Kunjungan online pertama** pengguna lama: browser cek byte-diff `sw.js` → terdeteksi
   berubah → SW baru **install** (unduh precache ~3MB di background) → `skipWaiting` +
   `clientsClaim` → SW baru mengambil alih **langsung di sesi yang sama** →
   `cleanupOutdatedCaches` menghapus cache lama. Update ini silent (tanpa dialog).
3. **Pengguna offline total**: tetap dilayani **snapshot precache terakhir** sampai
   mereka masuk online sedikit saja (sekali terhubung, update jalan otomatis). Konten
   baru hanya terlihat setelah update itu selesai.
4. **Catatan jalur verifikasi**: URL halaman baru akan tersaji offline hanya setelah
   SW baru selesai install di device pengguna. Sebelum itu (SW masih versi lama),
   navigasi offline ke URL baru = cache-miss → network → gagal (tanpa navigateFallback).
   Ini disadari dan diterima (lihat Alternatives).
5. **Konten sama tapi di-edit**: file yang direvise hanya berubah revisi-nya di manifest,
   di-refetch saat update — aman.

## Alternatives Considered

- **`navigateFallback: '/404'` (halaman 404 precached sebagai fallback):** menawarkan
  jaminan "tidak pernah dinding Chrome offline" alà mysc (SPA). Ditolak untuk sekarang:
  URL asing akan tersaji halaman 404 dari cache, dan typo path *online* pun berhenti
  diperbitakankan status 404 asli (semua dibalas 200). Dibaca ulang bila keluhan
  "URL yang dikenal gagal dibuka offline" muncul.
- **`registerType: 'prompt'` seperti mysc:** ditolak — situs direktori yang kontennya
  sering diperbarui lebih cocok update silent; UX prompt tambahan menghambat adopsi
  konten baru.
- **Membuat install resilient (lanjut walaupun ada entri non-200, mis. custom
  `cacheWillUpdate`):** dinilai sekilas dan ditolak — hanya menyembunyikan gejala.
  Akar masalahnya URL invalid di manifest; pembersihan di sumber (globIgnores) adalah
  perbaikan yang benar.
- **Tidak mencache halaman konten (cuma assets):** ditolak — offline-first adalah anggapan
  utama PWA ini (dokumen konten harus bisa dibuka offline).

## Consequences

- Files berubah: `nuxt.config.ts` (globIgnores + tag param), `app/components/
  PwaFeedback.client.vue` (toast ping-based).
- Diperlukan menjaga: calon route baru (halaman baru) harus masuk precache otomatis
  (yang dilakukan module @vite-pwa/nuxt via prerender). Kalau suatu hari halaman baru
  dibuat lewat mekanisme lain (programmatically, bukan file routing), harus dicek
  masuk dokumen manifest sebelum di-gandengkan ke runtime PWA.
- Pemicu review: kebutuhan fallback offline untuk URL asing muncul, atau workbox
  mengubah perilaku instalasi non-200 (upgrade workbox → jalankan ulang verifikasi).
- Resep debug on-device yang bekerja (untuk kasus serupa di masa depan): adb +
  `adb forward tcp:9222 localabstract:chrome_devtools_remote` → CDP; cek
  `getRegistration()`, isi `caches`, lalu probe fetch satu per satu semua URL precache.

## Related

- ADR-003 (Directory MVP architecture — PWA static prerender)
- ADR-005 (Dependencies — @vite-pwa/nuxt versi)
