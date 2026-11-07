#!/usr/bin/env node
/**
 * gen-index — generate `content/directory.md` from the category pages.
 *
 * Single source of truth remains the category markdown files (frontmatter +
 * H2 subcategories). This script derives the index page so it can never drift:
 * run automatically before `dev`/`build` and in the pre-commit hook.
 *
 * Anchor parity: heading ids are generated with the same algorithm Nuxt MDC
 * uses (`github-slugger` + `-+` collapse + digit prefix), so every link lands
 * on the real heading.
 *
 * Usage: node scripts/gen-index.mjs
 */

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import GithubSlugger from 'github-slugger'
import { parseFrontmatter } from './lib/frontmatter.mjs'

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..')
const CONTENT_DIR = join(ROOT, 'content')
const OUT_FILE = join(CONTENT_DIR, 'directory.md')

// ADR-006: kelompok top-level. Sama dengan landing & sidebar (tampilan-only).
const DOMAIN_ORDER = ['hiburan', 'dev', 'utilitas', 'meta']
const DOMAIN_LABEL = {
  hiburan: 'Hiburan',
  dev: 'Developer',
  utilitas: 'Utilitas',
  meta: 'Meta',
}

/**
 * Recursively collect markdown files under a directory.
 *
 * @param {string} dir Absolute directory.
 * @param {string[]} [out=[]] Accumulator.
 * @returns {string[]} Absolute markdown paths.
 */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) {
      if (entry === 'node_modules' || entry === '.obsidian' || entry === '_templates') continue
      walk(p, out)
    } else if (entry.endsWith('.md')) {
      out.push(p)
    }
  }
  return out
}

/**
 * Site route for a content file (`content/streaming/index.md` → `/streaming`).
 *
 * @param {string} file Absolute file path.
 * @returns {string} Route path.
 */
function routeOf(file) {
  const rel = relative(CONTENT_DIR, file).split(sep).join('/')
  const base = rel.slice(0, -'.md'.length)
  return base.endsWith('/index') ? `/${base.slice(0, -'/index'.length)}` : `/${base}`
}

/**
 * Strip inline markdown so heading text matches MDC's hast `toString`.
 *
 * @param {string} s Raw heading text.
 * @returns {string} Plain text.
 */
function plainText(s) {
  return s
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/[*_~]/g, '')
    .replace(/<[^>]+>/g, '')
    .trim()
}

/**
 * Heading id exactly as Nuxt MDC generates it (see @nuxtjs/mdc compiler).
 *
 * @param {GithubSlugger} slugger Per-document slugger (stateful, keeps suffixes).
 * @param {string} text Plain heading text.
 * @returns {string} Anchor id.
 */
function headingId(slugger, text) {
  return slugger.slug(text).replace(/-+/g, '-').replace(/^-|-$/g, '').replace(/^(\d)/, '_$1')
}

/**
 * H2 subcategories with their anchors, plus the external link count.
 * Every heading (any depth) feeds the slugger so suffix numbering matches.
 *
 * @param {string} body Markdown body.
 * @returns {{ subs: Array<{ text: string, id: string }>, links: number }} Derived data.
 */
function derive(body) {
  const slugger = new GithubSlugger()
  const subs = []
  let links = 0
  let inFence = false
  for (const line of body.split('\n')) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const heading = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/)
    if (heading) {
      const text = plainText(heading[2])
      const id = headingId(slugger, text)
      if (heading[1].length === 2) subs.push({ text, id })
      continue
    }
    links += (line.match(/\]\(https?:\/\//g) ?? []).length
  }
  return { subs, links }
}

/**
 * `created` from an existing generated file (stable across regenerations).
 *
 * @returns {string | null} ISO date or null.
 */
function existingCreated() {
  if (!existsSync(OUT_FILE)) return null
  const { data } = parseFrontmatter(readFileSync(OUT_FILE, 'utf8'))
  const created = data?.created
  return typeof created === 'string' && created ? created : null
}

const today = new Date().toISOString().slice(0, 10)

const pages = walk(CONTENT_DIR)
  .filter((file) => resolve(file) !== OUT_FILE)
  .filter((file) => !/[/\\]_[^/\\]*\.md$/.test(file)) // _vault-guide.md, _map.md, dsb.
  .map((file) => {
    const { data, body } = parseFrontmatter(readFileSync(file, 'utf8'))
    if (!data || data.featured !== true || data.draft === true) return null
    const { subs, links } = derive(body)
    return {
      path: routeOf(file),
      title: String(data.title ?? ''),
      domain: String(data.domain ?? 'utilitas'),
      order: typeof data.order === 'number' ? data.order : 999,
      updated: typeof data.updated === 'string' ? data.updated : '',
      subs,
      links,
    }
  })
  .filter(Boolean)
  .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))

const groups = DOMAIN_ORDER.map((domain) => ({
  domain,
  label: DOMAIN_LABEL[domain] ?? domain,
  items: pages.filter((p) => p.domain === domain),
})).filter((g) => g.items.length > 0)

const totalLinks = pages.reduce((acc, p) => acc + p.links, 0)
// Statistik hero landing hanya menghitung domain non-meta; samakan angkanya.
const contentPages = pages.filter((p) => p.domain !== 'meta')
const contentLinks = contentPages.reduce((acc, p) => acc + p.links, 0)
const updated =
  pages
    .map((p) => p.updated)
    .filter(Boolean)
    .sort()
    .at(-1) ?? today
const created = existingCreated() ?? today

const body = []
body.push('# Index', '')
body.push(
  `Peta ${contentPages.length} kategori dan ${contentLinks} link terkurasi, plus halaman meta — loncat langsung ke seksi yang dicari, tanpa buka halaman satu-satu.`,
  ''
)
for (const group of groups) {
  body.push(`## ${group.label}`, '')
  for (const page of group.items) {
    const parts = [`${page.links} link`]
    if (page.subs.length) {
      parts.push(page.subs.map((s) => `[${s.text}](${page.path}#${s.id})`).join(', '))
    }
    body.push(`- [${page.title}](${page.path}) — ${parts.join(' · ')}`)
  }
  body.push('')
}

const output = `---
title: "Index"
description: "Peta semua kategori dan subkategori MarkCache — loncat langsung ke seksi yang dicari."
category: "meta"
domain: meta
icon: "list"
tags: ["index", "meta"]
updated: "${updated}"
created: "${created}"
draft: false
featured: false
order: 99
---

${body.join('\n')}`

const before = existsSync(OUT_FILE) ? readFileSync(OUT_FILE, 'utf8') : null
if (before === output) {
  console.log(`gen-index: up to date (${pages.length} categories, ${totalLinks} links)`)
} else {
  writeFileSync(OUT_FILE, output)
  console.log(
    `gen-index: wrote content/directory.md (${pages.length} categories, ${totalLinks} links)`
  )
}
