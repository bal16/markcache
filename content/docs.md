---
title: "Docs"
description: "Documentation of MarkCache"
date: "2025-12-19"
tags: ["nuxt", "markdown", "tutorial"]
---

# Markcache Project Documentation

Welcome to the documentation for Markcache — a Nuxt 4 + @nuxt/content file‑based CMS starter with a modern component system (shadcn‑nuxt + Reka UI), Tailwind CSS v4, and dark mode support. This page explains how the project is structured, how to develop locally, and how to add and publish content.

## Overview

- Framework: Nuxt 4 (Vue 3, Vite)
- Content: @nuxt/content (Markdown/MDX pages with front matter)
- UI: shadcn-nuxt components, Reka UI primitives, lucide icons
- Styling: Tailwind CSS v4 + Typography plugin
- Theme: @nuxtjs/color-mode (light/dark), `ModeToggle` component
- Routing: File-based pages plus content-driven routes via `[...slug].vue`

## Quick Start

Prerequisites: Node 18+ and your preferred package manager. This repo uses pnpm.

Install dependencies and start the dev server:

```bash
pnpm install
pnpm dev
```

Build and preview production:

```bash
pnpm build
pnpm preview
```

Generate a static site (SSG):

```bash
pnpm generate
```

## Project Structure

```
app/
	app.vue                 # Global app shell
	assets/main.css         # Tailwind entry + global styles
	components/             # App components (header, sidebar, UI library)
	layouts/                # Nuxt layouts (default, docs)
	lib/utils.ts            # Shared utilities
	pages/                  # Route files (index, [...slug] for content)
content/                  # Markdown content (auto-routed by @nuxt/content)
public/                   # Public assets (robots.txt, MSW worker)
nuxt.config.ts            # Nuxt configuration
content.config.ts         # @nuxt/content collections
```

Notable components:

- `Header.vue`, `Footer.vue`: Site chrome
- `Sidebar.vue`, `TableOfContents.vue`: Docs navigation and on-page TOC
- `SearchDialog.vue`: Command palette‑style search
- `ModeToggle.vue`: Light/dark theme switch
- `components/ui/*`: shadcn‑nuxt generated UI components (Button, Card, Dialog, etc.)

## Nuxt Configuration

Key settings live in [nuxt.config.ts](../nuxt.config.ts):

- Modules: `shadcn-nuxt`, `@nuxt/content`, `@nuxtjs/color-mode`
- CSS: `@/assets/main.css`
- Vite plugins: Tailwind CSS v4
- Color mode class strategy with no suffix (e.g., `class="dark"` on `html`)

Content configuration lives in [content.config.ts](../content.config.ts):

- Declares a `page` collection sourcing all `**/*.md` under `/content`

## Content Authoring

Create Markdown files under `/content`. File path defines the route. Examples:

- `/content/docs.md` → `/docs`
- `/content/first/index.md` → `/first`
- `/content/second/third.md` → `/second/third`

Front matter (YAML) controls metadata:

```md
---
title: "My Article"
description: "Short summary for SEO and previews."
date: "2025-12-19"
tags: ["nuxt", "content"]
---

# My Article

Write your content here.
```

The catch‑all page [app/pages/[...slug].vue](../app/pages/%5B...slug%5D.vue) renders any Markdown found by @nuxt/content using the `docs` layout where applicable.

## Layouts

- `default.vue`: Base layout used by the homepage and other pages
- `docs.vue`: Documentation layout with sidebar and table of contents

Select a layout in your page front matter or rely on route‑level defaults.

## Styling

Tailwind CSS v4 is configured via the Vite plugin. Global styles are in [app/assets/main.css](../app/assets/main.css). The Typography plugin is available for rich prose formatting out of the box.

## Theming

`@nuxtjs/color-mode` enables dark/light switching with class strategy. Use the `ModeToggle` component in the header to switch themes; the preference is persisted for users.

## Search

`SearchDialog.vue` provides a command palette UI to search content. It leverages the shadcn/Command components. You can open it from the header to quickly jump between docs.

## Useful Scripts

- `pnpm dev`: Start dev server at http://localhost:3000
- `pnpm build`: Production build
- `pnpm preview`: Preview built app locally
- `pnpm generate`: Generate a static site
- `postinstall`: `nuxt prepare` (Nuxt type generation)

## Deployment

You can deploy either as SSR or as a static site:

- Static (recommended for docs): run `pnpm generate` and deploy the generated `.output/public` (or the dist configured by Nuxt) to any static host (e.g., Netlify, Vercel, GitHub Pages).
- SSR: run `pnpm build` then start with your platform’s adapter/runtime.

Refer to Nuxt’s deployment guide for provider‑specific steps.

## Adding New UI Components

The UI library is managed by `shadcn-nuxt`. Components live under `app/components/ui`. You can generate additional components using shadcn‑nuxt commands (see the shadcn‑nuxt docs) and then import/use them in your views.

## Conventions & Tips

- Keep titles concise and unique; they appear in lists/TOC.
- Use front matter `description` for SEO and previews.
- Prefer nested folders with `index.md` for clean URLs (e.g., `/guide` instead of `/guide/index`).
- Add `tags` to categorize and enable future filtering.

## Troubleshooting

- If styles look off, confirm Tailwind is applied (see `assets/main.css`) and that Vite plugin is active in `nuxt.config.ts`.
- If a content page doesn’t render, check the file path under `/content` and ensure valid YAML front matter.
- If dark mode doesn’t toggle, verify `@nuxtjs/color-mode` is loaded and `ModeToggle` is mounted.

---

Have questions or want enhancements added? Open an issue or start a discussion in the repository. Happy writing!
