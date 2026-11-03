---
title: "Dev Tools"
description: "Perangkat developer gratis dan open-source — git, docker, database, AI, hosting, security."
category: "devtools"
icon: "terminal"
tags: ["developer", "tools", "oss"]
updated: "2026-11-03"
draft: false
featured: true
order: 2
---

# Dev Tools

> Subset dari `developer-tools.md` FMHY ditulis ulang: yang masuk cuma alat
> yang sering terbukti membantu di pekerjaan harian, deskripsi Indonesia.

## Git & GitHub

- [Git](https://git-scm.com/) — version control standar dunia. `cli` ⭐
- [lazygit](https://github.com/jesseduffield/lazygit) — TUI git ramah untuk branching/merge. `tui` ⭐
- [gitui](https://github.com/gitui-org/gitui) — TUI git sangat cepat, Rust. `tui`
- [GitHub Desktop](https://github.com/apps/desktop) — client GUI resmi. `gui`
- [refined-github](https://github.com/refined-github/refined-github) — ekstensi menaikkan kualitas UI GitHub. `ext` ⭐
- [Conventional Commits](https://www.conventionalcommits.org/) — konvensi pesan commit yang mudah dituruti. `manajemen`
- [act](https://nektosact.com/) — jalankan GitHub Actions secara lokal. `ci`
- [Download Directory](https://download-directory.github.io/) — unduh sub-folder repo GitHub. `unduh`
- [Star History](https://star-history.com/) — grafik historis bintang repo. `analisis`

## Docker & Container

- [Docker](https://www.docker.com/) — runtime container standar. `container` ⭐
- [Podman](https://podman.io/) — Docker alternatif rootless dan daemon-less. `container` ⭐
- [Portainer](https://portainer.io/) — panel web manaj container. `gui`
- [DockGE](https://dockge.kuma.pet/) — manajer compose stack, ringan. `gui`
- [Composerize](https://www.composerize.com/) — konversi `docker run` ke compose. `web`
- [lazydocker](https://github.com/jesseduffield/lazydocker) — TUI manajer container/image/volume. `tui`
- [Dozzle](https://dozzle.dev/) — pemeriksa log container real-time. `log`
- [Dive](https://github.com/wagoodman/dive) — bedah isi dan ukuran layer image. `audit`

## Database & API

- [DB Browser for SQLite](https://sqlitebrowser.org/) — GUI SQLite paling populer, multi-OS. `gui` ⭐
- [DuckDB](https://duckdb.org/) — SQL analitik embedded, pas untuk file parquet/CSV. `oss`
- [Beekeeper Studio](https://www.beekeeperstudio.io/) — editor SQL yang nyaman, open-source. `gui`
- [DBeaver](https://dbeaver.io/) — GUI database universal, banyak driver. `gui`
- [NocoDB](https://github.com/nocodb/nocodb) — Airtable versi open-source, bisa self-host. `selfhost`
- [ChartDB](https://chartdb.io/) — visualisasi skema database jadi diagram. `visualisasi`
- [Public APIs](https://github.com/public-apis/public-apis) — index besar API publik gratis. `index`

## Terminal & CLI

- [ripgrep](https://github.com/BurntSushi/ripgrep) — pengganti grep, sangat cepat dan menghormati .gitignore. `cli` ⭐
- [bat](https://github.com/sharkdp/bat) — `cat` dengan syntax highlight. `cli`
- [zoxide](https://github.com/ajeetdsouza/zoxide) — `cd` pintar yang belajar rilis perpindahan. `cli`
- [Atuin](https://atuin.sh/) — ribuan shell history tetap tersinkron dan bisa dicari. `cli`
- [Oh My Posh](https://ohmyposh.dev/) — theming prompt terminal lintas shell. `cli`
- [pueue](https://github.com/Nukesor/pueue) — antre perintah shell berjalan lama. `cli`
- [VHS](https://github.com/charmbracelet/vhs) — rekam GIF terminal dari script, cocok untuk dokumentasi. `docs`

## AI & Machine Learning

- [Hugging Face](https://huggingface.co/) — hub model, dataset, dan Spaces. `ai` ⭐
- [Unsloth](https://unsloth.ai/) — fine-tune LLM dengan RAM/VRAM kecil. `ai`
- [Google AI Studio](https://aistudio.google.com/app/apps) — playground + API Gemini, gratis. `ai`
- [Qwen Chat](https://chat.qwen.ai/) — chat AI gratis dengan mode coding. `ai`
- [v0](https://v0.app/) — teks ke UI React siap pakai. `ai`
- [Bolt.new](https://bolt.new/) — AI membentuk dan menjalankan web app selesai di browser. `ai`
- [Repomix](https://repomix.com/) — kumpul repo menjadi satu prompt siap LLM. `ai`
- [CodeRabbit](https://www.coderabbit.ai/) — review PR otomatis oleh AI. `review`
- [MCP Market](https://mcpmarket.com/) — index server MCP untuk agent AI. `ai`

## Hosting & Deploy

- [Cloudflare Pages](https://www.cloudflare.com/products/pages/) — hosting situs statis, unlimited bandwidth. `statis` ⭐
- [Cloudflare Workers](https://www.cloudflare.com/products/workers/) — edge runtime, 100 ribu request/hari gratis. `statis`
- [Vercel](https://vercel.com/) — hosting app/framework modern, 100 GB bandwidth/bulan. `statis`
- [Netlify](https://www.netlify.com/) — deploy situs statis dengan CICD bawaan. `statis`
- [surge](https://surge.sh/) — deploy dari CLI sekali perintah. `statis`
- [GitHub Pages](https://docs.github.com/en/pages) — hosting statis dari repo, 100 GB bandwidth. `statis`
- [Coolify](https://coolify.io/) — alternatif Heroku/Vercel self-host untuk VPS sendiri. `selfhost` ⭐
- [Render](https://render.com/) — deploy backend dan database terkelola. `backend`

## Security

- [Nmap](https://nmap.org/) — pemeriksa port dan jaringan klasik. `audit` ⭐
- [Nuclei](https://docs.projectdiscovery.io/opensource/nuclei/overview) — vuln scanning berbasis template dari ProjectDiscovery. `audit`
- [NVD](https://nvd.nist.gov/) — database resmi CVE/NIST. `database`
- [Crowdsec](https://crowdsec.net/) — IDS/IPS crowdsourced dengan blocklist komunitas. `oss`
- [MDN Observatory](https://developer.mozilla.org/en-US/observatory) — tes header keamanan HTTP situs. `audit`
- [Sniffnet](https://sniffnet.app/) — monitor trafik jaringan dengan GUI modern. `gui`
- [Canarytokens](https://canarytokens.org/generate) — alarm dini saat server atau file disentuh tanpa izin. `ops`

Referensi lengkap: [FMHY Developer Tools](https://fmhy.net/developer-tools).
