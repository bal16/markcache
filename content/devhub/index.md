---
title: "Dev Hub"
description: "Panduan memilih stack: 5 sampai 8 pilihan terkuat per slot, dari framework dan library sampai auth, database, serta deploy."
category: "devhub"
domain: dev
icon: "blocks"
tags: ["developer", "framework", "library"]
updated: "2026-11-10"
created: "2026-11-03"
draft: false
featured: true
order: 3
---

# Dev Hub

> Indeks opini untuk memilih stack: 5 sampai 8 pilihan terkuat per slot.
> Kurasi dari FMHY `developer-tools.md`, awesome list, dan praktik repo ini
> sendiri. Alat harian (git, docker, terminal, hosting) ada di
> [Dev Tools](/devtools). Stack berubah cepat, jadi yang masuk di sini adalah
> pilihan yang bertahan lama.

## Meta-Framework

- [Next.js](https://nextjs.org) — meta-framework React paling besar; app router dan server components. `react` ⭐
- [Nuxt](https://nuxt.com) — meta-framework Vue; dipakai situs ini sendiri. `vue` ⭐
- [TanStack Start](https://tanstack.com/start/latest) — full-stack React dari tim TanStack, di atas Router dan Query. `react`
- [Astro](https://astro.build) — arsitektur konten-first, ideal untuk situs marketing dan blog. `konten`
- [SvelteKit](https://svelte.dev/docs/kit) — bundel paling kecil, sintaks paling ringkas. `svelte`

## PHP Framework

- [Laravel](https://laravel.com) — PHP framework paling populer; ekosistem lengkap dari Eloquent sampai Horizon. `php` ⭐
- [CodeIgniter](https://codeigniter.com) — PHP framework ringan, historis populer di komunitas Indonesia. `php` `indonesia`

## UI Framework

- [Vue](https://vuejs.org) — progresif, dokumentasi terbaik di kelasnya. `vue` ⭐
- [React](https://react.dev) — ukuran komunitas paling besar. `react`
- [Svelte](https://svelte.dev) — kompilator tanpa virtual DOM. `svelte`
- [Solid](https://www.solidjs.com/) — reaktivitas fine-grained, performa DOM nyata. `reaktif`

## CSS & Komponen UI

- [Tailwind CSS](https://tailwindcss.com) — utility-first; dipakai situs ini. `css` ⭐
- [shadcn/ui](https://ui.shadcn.com) — komponen Tailwind yang di-copy ke repo, bukan dependensi. `ui` ⭐
- [shadcn-vue](https://www.shadcn-vue.com/) — adaptasi shadcn untuk Vue dan Nuxt berbasis primitif Reka UI. `ui` ⭐
- [Solid UI](https://www.solid-ui.com/) — port komponen bergaya shadcn dan Tremor untuk ekosistem SolidJS. `ui`
- [Reka UI](https://reka-ui.com/) — primitif a11y, fondasi shadcn untuk Vue. `ui`
- [Pico.css](https://picocss.com/) — classless CSS untuk halaman yang tak butuh framework. `css`

## UI Animasi & Interaksi

- [Motion](https://motion.dev/) — engine animasi modern untuk JavaScript, React, dan Vue; penerus mandiri Framer Motion. `animasi` ⭐
- [Animate UI](https://animate-ui.com/) — koleksi komponen beranimasi berbasis Tailwind dan Motion, dipasang melalui baris perintah shadcn. `ui` ⭐
- [Smooth UI](https://smoothui.dev/) — komponen antarmuka interaktif dengan transisi berbasis fisika pegas dan sentuhan mikro. `ui`
- [Magic UI](https://magicui.design/) — pustaka komponen visual dan efek latar bergerak untuk halaman depan produk web. `ui`
- [Motion Primitives](https://motion-primitives.com/) — blok animasi siap pakai yang dapat disalin langsung ke dalam proyek Tailwind dan Motion. `komponen`

## Ikon & Aset Grafis

- [Lucide](https://lucide.dev/) — koleksi ikon vektor SVG dengan gaya visual seragam, menjadi standar bawaan pustaka shadcn. `ikon` ⭐
- [Iconify](https://iconify.design/) — satu kerangka kerja komponen untuk mengakses ratusan paket ikon terbuka lintas framework. `ikon` ⭐
- [svgl](https://svgl.app/) — katalog logo vektor SVG terkurasi untuk berbagai perangkat lunak dan layanan teknologi. `svg`

## Keluarga TanStack

- [TanStack Query](https://tanstack.com/query/latest) — standar de-facto data fetching dan cache di React/Vue. `state` ⭐
- [TanStack Router](https://tanstack.com/router/latest) — router type-safe untuk React. `router`
- [TanStack Table](https://tanstack.com/table/latest) — tabel dan grid headless. `ui`
- [TanStack Form](https://tanstack.com/form/latest) — form headless type-safe. `form`

## Backend & API

- [Hono](https://hono.dev) — web framework kecil dan sangat cepat, jalan di semua runtime (Node, Bun, Workers). `backend` ⭐
- [NestJS](https://nestjs.com) — backend Node terstruktur ala enterprise: dependency injection, modul, guard. `backend`
- [Fastify](https://fastify.dev/) — server HTTP Node cepat dengan validasi skema. `backend`
- [Nitro](https://nitro.build) — server engine lintas-platform yang mem-drive Nuxt. `deploy`

## Database & BaaS

- [Supabase](https://supabase.com/) — Postgres BaaS lengkap: auth, storage, realtime; 2 project aktif di tier gratis. `baas` ⭐
- [Neon](https://neon.com/) — Postgres serverless dengan branching ala Git; scale-to-zero, cold start cepat. 10 project gratis. `postgres` ⭐
- [Drizzle](https://orm.drizzle.team/) — ORM SQL TypeScript yang ringan; jodoh dengan Neon. `orm`
- [Prisma](https://www.prisma.io/) — ORM TypeScript paling populer dengan DX paling hangat. `orm`
- [Turso](https://turso.tech/) — SQLite terdistribusi di edge, replikasi global. `sqlite`

## Auth

- [better-auth](https://better-auth.com/) — library auth TypeScript self-host, agnostik framework. `auth` ⭐
- [Auth.js](https://authjs.dev/) — auth standar untuk Next.js dan ekosistem JS. `auth`
- [Clerk](https://clerk.com/) — auth terkelola yang tetap cepat saat aplikasi membesar. `saas`

## Data & State

- [Zod](https://zod.dev) — validasi schema TypeScript, bebas dipakai lintas library. `validasi` ⭐
- [Pinia](https://pinia.vuejs.org) — store resmi Vue. `state`
- [Zustand](https://zustand.docs.pmnd.rs) — store React paling minimalis. `state`

## Deploy

- [Vercel](https://vercel.com/) — rumah Next.js dan Nuxt; preview deployment tiap PR. `deploy` ⭐
- [Cloudflare Workers](https://workers.cloudflare.com) — edge runtime, gratis hingga 100 ribu request/hari. `edge`
- [Netlify](https://www.netlify.com/) — hosting statis dengan CICD bawaan. `deploy`

> Perbandingan lengkap kapasitas hosting gratis ada di bagian Hosting & Deploy di
> [Dev Tools](/devtools#hosting-deploy).

## Python

- [FastAPI](https://fastapi.tiangolo.com/) — API Python modern dengan type hint asli. `api` ⭐
- [uv](https://docs.astral.sh/uv/) — manajer project Python yang sangat cepat. `tooling` ⭐
- [Ruff](https://docs.astral.sh/ruff/) — linter + formatter Python dalam satu tool. `tooling`
- [Pydantic](https://docs.pydantic.dev/) — validasi data berdasarkan type hint Python. `validasi`
- [Automate the Boring Stuff](https://automatetheboringstuff.com/) — buku Python praktikal, gratis dibaca. `belajar`

## Belajar & Referensi

- [roadmap.sh](https://roadmap.sh) — roadmap belajar visual per peran developer. `belajar` ⭐
- [free-for.dev](https://free-for.dev/) — indeks besar layanan dengan tier gratis, diselenggarakan lewat repo publik. `gratis` ⭐
- [QuickRef.ME](https://quickref.me/) — cheat sheet interaktif per bahasa. `referensi`
- [30 Seconds of Code](https://www.30secondsofcode.org/) — snippet JS/Python/React siap pakai. `snippet`
- [awesome-cheatsheets](https://lecoupa.github.io/awesome-cheatsheets/) — rangkuman bahasa dan framework dari sekian kontributor. `referensi`
