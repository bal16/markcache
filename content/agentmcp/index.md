---
title: "Agent & MCP"
description: "Server MCP, koleksi skill, dan registry untuk coding agent. Dipilih dari alat yang benar-benar dipakai harian dan sudah dicoba sendiri."
category: "agentmcp"
domain: dev
icon: "puzzle"
tags: ["mcp", "agent", "ai"]
updated: "2026-11-25"
created: "2026-11-06"
draft: false
featured: true
order: 9
---

# Agent & MCP

> Isi untuk coding agent kamu: MCP server berguna, koleksi skill, dan registry.
> Fokus yang benar-benar dipakai harian, bukan daftar 500 server tanpa review.

## Registry & Direktori

- [awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) — direktori MCP terbesar (97 ribu+ bintang), dikelompokkan per kategori. `mcp` ⭐
- [MCP Registry Resmi](https://registry.modelcontextprotocol.io/) — registry resmi protokol MCP; sumber kebenaran siapa server siapa. `mcp` ⭐
- [awesome-mcp-clients](https://github.com/punkpeye/awesome-mcp-clients/) — daftar client MCP untuk beragam host agent. `mcp`
- [awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) — direktori skill agent terkurasi, dibagi per topik. `skill` ⭐
- [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) — direktori skill agent terbesar (1.000+ skill) dari tim dev resmi maupun komunitas, kompatibel lintas agent. `skill` ⭐
- [glama.ai MCP Directory](https://glama.ai/mcp/servers) — indeks MCP dengan rating dan status pemasangan. `mcp`

## MCP Harian

- [Context7](https://context7.com/) — arahkan docs library terkini langsung ke LLM; versi terbaru, bukan data latihan. `docs` ⭐
- [Claude Mem](https://github.com/thedotmack/claude-mem) — lapis memori persist antar sesi coding agent: keputusan, konteks, riwayat. `memori` ⭐
- [Browser Use](https://github.com/browser-use/browser-use) — kendalikan browser lewat agent: navigasi, form, scraping. `browser` ⭐
- [Playwright MCP](https://github.com/microsoft/playwright-mcp) — automasi browser resmi Microsoft; testing & QA yang bisa diaudit. `browser`
- [Firecrawl MCP](https://github.com/firecrawl/firecrawl-mcp-server) — crawl, scrape, dan extract data web terstruktur untuk agent. `scrape`
- [Terse](https://github.com/inth3shadows/terse) — proxy kompresi output tool MCP; merapikan konteks dari keluaran tool yang panjang. `optimasi`
- [FigCraft](https://github.com/storytold/figcraft) — aplikasi desain UI open-source berbasis Rust dengan MCP server bawaan untuk manipulasi canvas, auto-layout, dan komponen lokal. `desain` `mcp` ⭐

## Klien Agent

- [OpenCode](https://opencode.ai/) — coding agent open-source: CLI/TUI lintas provider, bukan terkunci di satu vendor. `agent` ⭐
- [Oh My Pi](https://github.com/can1357/oh-my-pi) — coding agent terminal dengan LSP terintegrasi, *hash-anchored patching*, subagent paralel di worktree, dan REPL multi-bahasa. `agent` ⭐
- [Antigravity CLI (agy)](https://github.com/google-antigravity/antigravity-cli) — CLI/TUI coding agent Google Antigravity dengan orkestrasi multi-step dan subagent, ringan untuk sesi SSH. `agent` ⭐

## Skills

- [Superpowers](https://github.com/obra/superpowers) — metodologi dev lengkap untuk agent: TDD, debugging, git worktree, penyelesaian konflik merge. `skill` ⭐
- [anthropics/skills](https://github.com/anthropics/skills) — skill resmi Anthropic: dokumen, komponen, hingga otomasi kantor. `skill` ⭐
- [agentskills.io](https://agentskills.io/) — standar terbuka Agent Skills; format yang dibaca Claude Code dan OpenCode. `standar`
- [rossark-motion-skill](https://github.com/rossark0/rossark-motion-skill) — ubah SVG statis jadi animasi 60 fps yang natural untuk React Native & SwiftUI. `animasi` ⭐
- [bahasa-skills](https://github.com/alvinindra/bahasa-skills) — panduan menulis bahasa Indonesia sesuai EYD V & KBBI, bebas gaya AI kaku. `menulis` ⭐
- [emilkowalski/skills](https://github.com/emilkowalski/skills) — panduan *design engineering* & mikro-animasi UI agar komponen tidak terasa generik. `ui` ⭐
- [impeccable](https://github.com/pbakaus/impeccable) — panduan tipografi, kosakata desain, dan detektor *AI slop* agar UI tidak terlihat generik. `ui` `desain` ⭐
- [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) — koleksi *design intelligence* lokal (palet warna, pasangan font, layout, chart) untuk agent UI/UX. `ui` `ux` ⭐
- [taste-skill](https://github.com/Leonxlnx/taste-skill) — kerangka *anti-slop* untuk frontend dengan variasi gaya visual dan *gate* verifikasi hasil. `ui` `desain`
- [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) — kumpulan skill resmi Vercel termasuk *Web Design Guidelines* (100+ aturan UX & pola komponen). `ui` `ux` ⭐
- [oil-ui](https://github.com/oil-oil/oil-ui) — dorong agent mengeksplorasi beberapa arah visual UI secara paralel dan menyempurnakannya lewat inspeksi visual. `ui` `desain`
- [ux-ui-agent-skills](https://github.com/plugin87/ux-ui-agent-skills) — skill *design system* dengan token DTCG dan standar aksesibilitas WCAG 2.2 (AA–AAA). `ui` `a11y`
- [uxuiprinciples/agent-skills](https://github.com/uxuiprinciples/agent-skills) — prinsip UX fundamental, protokol evaluasi, dan checklist audit antarmuka dalam format `SKILL.md`. `ux` `desain`
- [figma/mcp-server-guide](https://github.com/figma/mcp-server-guide) — panduan & skill resmi Figma MCP (`design-to-code`, `generate-design`); alurnya mudah diporting ke Figcraft MCP. `figma` `desain`
- [openai/skills](https://github.com/openai/skills) — katalog skill terstruktur (`figma-generate-design`, `figma-generate-library`) untuk variabel desain, library komponen, dan verifikasi visual. `figma` `desain`
- [figma-console-mcp-skills](https://github.com/southleft/figma-console-mcp-skills) — kumpulan `SKILL.md` untuk ekspor token, audit aksesibilitas, dan analisis komponen berbasis MCP. `figma` `ui`
- [figma-to-code-skill](https://github.com/applyagency/figma-to-code-skill) — konversi desain ke kode dengan loop validasi visual berulang hingga presisi piksel. `figma` `ui`
- [blader/humanizer](https://github.com/blader/humanizer) — bersihkan pola tulisan khas AI agar teks bahasa Inggris terdengar natural. `menulis`
- [theclaymethod/unslop](https://github.com/theclaymethod/unslop) — audit & tulis ulang teks buatan AI agar terdengar manusiawi, lengkap dengan profil gaya tulisan sendiri. `menulis` ⭐
- [heydamir/unslop](https://github.com/heydamir/unslop) — rapikan UI hasil *vibecoding* (gradasi ungu generik, spacing berantakan, label emoji) secara bertahap. `ui` ⭐
- [peteromallet/desloppify](https://github.com/peteromallet/desloppify) — scanner & skill refactoring untuk membersihkan *dead code*, duplikasi, dan *bloat* di repo hasil AI. `kode` ⭐
- [nutlope/hallmark](https://github.com/nutlope/hallmark) — skill review desain anti-slop dengan pengecekan lintas *viewport* dan perbandingan *before/after*. `ui`
- [dharmawan-id/anti-ai-slop](https://github.com/dharmawan-id/anti-ai-slop) — standar anti-slop dwibahasa (Inggris & Indonesia) dalam format skill, CLI, dan server MCP. `menulis`
- [marketingskills](https://github.com/coreyhaines31/marketingskills) — playbook SEO teknis, CRO, dan *copywriting* siap pakai untuk agent. `marketing`
- [vercel-labs/skills](https://github.com/vercel-labs/skills) — CLI terbuka (`npx skills`) untuk mencari dan memasang skill lintas agent. `tooling`
- [supabase/agent-skills](https://github.com/supabase/agent-skills) — best practice resmi Postgres, desain skema, dan SQL aman untuk Supabase. `database`
- [cloudflare/skills](https://github.com/cloudflare/skills) — skill resmi untuk membangun di Cloudflare Workers & Agents SDK. `infra`
- [awesome-gamedev-agent-skills](https://github.com/gamedev-skills/awesome-gamedev-agent-skills) — koleksi skill gamedev lintas engine (Godot, Unity, Three.js, Phaser) dan QA aset 2D. `gamedev` ⭐
- [agent-skill-pixel-art](https://github.com/ervareza/agent-skill-pixel-art) — generate & audit pixel art *engine-ready* (grid, palet retro, sprite sheet). `gamedev` `pixel-art`
- [pixel-art (ARIS)](https://github.com/wanshuiyin/Auto-claude-code-research-in-sleep/tree/main/skills/pixel-art) — buat ilustrasi pixel art berbasis vektor SVG murni tanpa API eksternal. `svg` `pixel-art`

## Server Resmi (modelcontextprotocol)

Repositori resmi proyek protokol MCP, titik awal sebelum mencari server dari komunitas.

- [Filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) — operasi file lokal dengan kontrol akses. `fs` ⭐
- [Fetch](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) — ambil konten web dan konversi untuk konsumsi LLM. `web`
- [Git](https://github.com/modelcontextprotocol/servers/tree/main/src/git) — baca, cari, dan manipulasi repo Git via agent. `git`
- [Memory](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) — graf pengetahuan persist untuk context jangka panjang. `memori`
- [Sequential Thinking](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking) — tool problem-solving bertahap untuk reasoning agent. `pikir`

## Komunitas

- [r/mcp](https://www.reddit.com/r/mcp/) — subreddit diskusi server & client MCP, aktif tiap minggu. `komunitas`
