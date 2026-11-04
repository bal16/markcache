# ADR-006: Field `domain` untuk Grouping Landing, Struktur Tetap Flat

Status: Accepted
Date: 2026-11-04
Deciders: bal16

## Context

Setelah 6 kategori live (streaming, devtools, devhub, torrenting, downloading,
aitools), muncul observasi bahwa klasifikasi terasa tidak konsisten:

1. **Aksis kategori campur** — Streaming/Torrenting/Downloading menjawab
   pertanyaan "lewat mana aku mengakses konten?" (metode/verb), sedangkan
   Dev Tools/Dev Hub/AI Tools menjawab "aku butuh apa sebagai developer?"
   (subjek/noun). Keduanya tampil sejajar di landing.
2. **Overlap nyata antar kategori** — duplikasi URL antar file terukur
   (unsloth.ai, chat.qwen.ai, aistudio.google, huggingface masing-masing
   muncul di 2 file: aitools ↔ devhub/devtools). `aitools` bahkan punya
   seksi pointer "lihat Dev Hub / Dev Tools" — gejala kategori kurang fit.
3. **Torrenting vs Downloading** adalah metode dari kebutuhan yang sama
   ("aku mau dapat file"), bukan kategori yang benar-benar independen.

Opsi yang dipertimbangkan:

- **Rapikan semantik saja** (merge, rename, aturan penempatan) — murah
  tapi rasa "aksis campur" tetap muncul saat jumlah kategori bertambah.
- **Nesting folder** (`content/hiburan/streaming/`, URL dua level) —
  menggantikan ADR-002 (1 folder = 1 kategori), perlu rewrite routing dan
  semua internal link; overkill untuk 6 kategori.
- **Field `domain` di frontmatter, tanpa pindah file** — grouping tampilan
  saja di landing; struktur folder dan URL tidak berubah.

## Decision

Adopsi **field `domain`**, struktur konten tetap flat:

1. Frontmatter bertambah satu key: `domain: hiburan | dev | utilitas | meta`.
   - `hiburan`: streaming, torrenting, downloading (akses konten hiburan).
   - `dev`: devtools, devhub.
   - `utilitas`: aitools (default bila unset).
   - `meta`: docs.md / halaman non-direktori.
2. Landing digroup per domain (heading kecil: Hiburan / Developer /
   Utilitas); kartu pertama tiap group tetap `col-span-2`.
3. Struktur folder **tidak berubah** — ADR-002 (1 folder = 1 kategori,
   Obsidian-friendly) tetap berlaku dan tidak supersede.
4. Aturan penempatan untuk mengurangi overlap:
   - AI untuk coding/framework → `devhub` (atau `devtools`).
   - AI konsumen (chat web, gambar, TTS, lokal) → `aitools`.
   - Item lintas-kategori boleh duplikat **hanya jika** sudut pandangnya
     beda, dan deskripsinya disesuaikan dengan konteks kategori.
   - Torrenting & Downloading dibiarkan terpisah untuk saat ini (URL sudah
     live, pembaca datang dengan kebutuhan berbeda); merge dievaluasi lagi
     jika salah satu stagnasi tumbuh.
5. Nesting folder ditunda sampai ±12 kategori — saat itu evaluasi ulang.

## Consequences

### Positif

- Landing langsung menyelesaikan rasa klasifikasi campur tanpa risiko
  breaking change (nol perpindahan file, URL stabil, SEO aman).
- Schema tetap longgar (ADR-003): `domain` berekstensi semudah menambah
  anggota enum.
- Obsidian tetap nyaman — satu key frontmatter tambahan.

### Negatif / Trade-off

- `domain` adalah kasus khusus "kategori dari kategori" yang bisa
  berlebihan; disiplinkan: hanya `domain`, jangan tambah level lain.
- Overlap URL antar kategori tidak dihilangkan, hanya dibatasi aturan.

## Related

- [ADR-002](./002-obsidian-friendly-hybrid-content.md) — konvensi folder/kategori tetap berlaku.
- [ADR-003](./003-directory-mvp-architecture.md) — schema Zod longgar, `domain` mengikutinya.
