#!/usr/bin/env node
/**
 * contentlint — linter + formatter for MarkCache curated content.
 *
 * Enforces ADR-002 (Obsidian-friendly hybrid):
 *   frontmatter minimal + body konvensional (H2 = subkategori,
 *   `- [Nama](url) — deskripsi \`tag\``), tanpa wikilink/embed/Dataview/MDX.
 *
 * Usage:
 *   node scripts/contentlint.mjs [--fix] [--strict] [file...]
 *   - no file args  → lints everything under content/
 *   - --fix         → apply safe formatter fixes in place
 *   - --strict      → warnings also fail (exit 1)
 *
 * Zero dependencies (works with plain node).
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..')
const CONTENT_DIR = join(ROOT, 'content')
const args = process.argv.slice(2)
const FIX = args.includes('--fix')
const STRICT = args.includes('--strict')
const targets = args.filter((a) => !a.startsWith('--'))

// ---------------------------------------------------------------- rules
//
// Each rule below is a compiled pattern for one ADR-002 convention.
// Error rules fail the run (exit 1); the rest are warnings (fail only with --strict).

/**
 * Frontmatter keys that must be present (missing key = error).
 * @type {string[]}
 */
const REQUIRED_KEYS = ['title', 'description']
/**
 * Frontmatter keys recommended by ADR-002 (missing key = warning, to allow
 * gradual migration of legacy files that only carry title/description/date/tags).
 * @type {string[]}
 */
const RECOMMENDED_KEYS = ['category', 'tags', 'updated', 'draft', 'featured']

/** Age in days after which `updated` is reported stale (warning). @type {number} */
const STALE_DAYS = 180
/**
 * A well-formed resource bullet: `- [Name](url) — desc`.
 * Groups: 1 = `- [Name](url)` prefix, 2 = name, 3 = url, 4 = description + tags.
 * The separator accepts em-dash (canonical), `--`, en-dash, or `-`.
 * @type {RegExp}
 */
const RESOURCE_RE = /^(\s*-\s+)\[([^\]]+)\]\(([^)]+)\)\s*(?:—|--|–|-)\s*(.*)$/
/** A link bullet without any description part (warning, not error). @type {RegExp} */
const BARE_LINK_BULLET_RE = /^\s*-\s*\[[^\]]+\]\([^)]+\)\s*$/
/** Obsidian wikilink or embed (`[[x]]`, `![[x]]`) — forbidden in v1. @type {RegExp} */
const WIKILINK_RE = /(!?)\[\[.+?\]\]/
/**
 * Dataview fence opener (` ```dataview ` line). Tested against the raw body
 * (not prose-only): a dataview block IS a fence, so stripping fences first
 * would erase the evidence. No `g` flag — `RegExp.test` must stay stateless.
 * @type {RegExp}
 */
const DATAVIEW_RE = /^\s*```\s*dataview/im
/** Nuxt/MDX directive (`::name`, `:::`) — forbidden in v1. @type {RegExp} */
const MDX_DIRECTIVE_RE = /^:::|^::[a-zA-Z]/m
/** Placeholder text that must never reach the published site. @type {RegExp} */
const LOREM_RE = /lorem ipsum/i
/** Uppercase frontmatter key (`Title:`) — keys must be lowercase. @type {RegExp} */
const UPPERCASE_FM_KEY_RE = /^[A-Z][A-Za-z0-9_-]*\s*:/m

/**
 * Parsed frontmatter outcome.
 * @typedef {object} FrontmatterResult
 * @property {Record<string, unknown> | null} data Parsed key/value map, null on error.
 * @property {string} body Markdown body after the closing fence.
 * @property {string | null} rawFm Raw frontmatter block (without fences), null on error.
 * @property {string | null} error Machine-readable failure reason, null on success.
 */

/**
 * Per-file lint outcome.
 * @typedef {object} LintResult
 * @property {string} rel Repo-relative file path used in reports.
 * @property {string[]} errors Fail the run (exit 1).
 * @property {string[]} warnings Advisory; fail the run only with `--strict`.
 * @property {boolean} fixed Reserved for future in-place lint fixes (always false today).
 */

/**
 * A text segment split on fenced code blocks.
 * @typedef {object} FenceSegment
 * @property {boolean} code True for ``` fenced blocks (byte-identical, never touched).
 * @property {string} text Segment content.
 */

// ---------------------------------------------------------------- helpers

/**
 * Recursively collect every `.md` file under a directory.
 * Skips `node_modules` and Obsidian vault state (`.obsidian`).
 *
 * @param {string} dir Absolute directory to walk.
 * @param {string[]} [out=[]] Accumulator (for recursion).
 * @returns {string[]} Absolute paths of discovered markdown files.
 */
function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) {
      if (e === 'node_modules' || e === '.obsidian') continue
      walk(p, out)
    } else if (e.endsWith('.md')) {
      out.push(p)
    }
  }
  return out
}

/**
 * Split a file into YAML frontmatter and markdown body.
 * Understands only the flat subset ADR-002 allows (scalars, inline lists,
 * `#` comment lines); nested blocks are reported as errors, not parsed.
 *
 * @param {string} text Full file content.
 * @returns {FrontmatterResult} Parsed data (or an error descriptor).
 */
function parseFrontmatter(text) {
  if (!text.startsWith('---'))
    return { data: null, body: text, rawFm: null, error: 'missing frontmatter' }
  const close = text.indexOf('\n---', 3)
  if (close === -1) return { data: null, body: text, rawFm: null, error: 'unclosed frontmatter' }
  const rawFm = text.slice(3, close).replace(/^\n/, '')
  const body = text.slice(close + 4).replace(/^\n/, '')
  const data = {}
  try {
    for (const line of rawFm.split('\n')) {
      if (!line.trim() || line.trim().startsWith('#')) continue
      const m = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/)
      if (!m) return { data: null, body, rawFm, error: `bad frontmatter line: ${line.trim()}` }
      data[m[1]] = parseScalar(m[2].trim())
    }
  } catch (e) {
    return { data: null, body, rawFm, error: String(e) }
  }
  return { data, body, rawFm, error: null }
}

/**
 * Coerce one frontmatter scalar to a JS value: inline list (`[a, "b"]`),
 * quoted string, boolean, null (`null`/`~`/empty), number, else raw string.
 *
 * @param {string} v Raw scalar text (already trimmed).
 * @returns {unknown} Coerced value.
 */
function parseScalar(v) {
  if (v.startsWith('[') && v.endsWith(']')) {
    const inner = v.slice(1, -1).trim()
    if (!inner) return []
    return inner.split(',').map((s) => parseScalar(s.trim()))
  }
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1)
  }
  if (v === 'true') return true
  if (v === 'false') return false
  if (v === 'null' || v === '~' || v === '') return null
  const n = Number(v)
  if (v !== '' && !Number.isNaN(n)) return n
  return v
}

/**
 * Whether a link URL points outside the vault (and the site).
 *
 * @param {string} url Raw link target from markdown.
 * @returns {boolean} True for `http(s)://` URLs.
 */
function isExternal(url) {
  return /^https?:\/\//i.test(url)
}

/**
 * Whether a link URL is an internal vault link (resolvable to a file).
 * Anchors (`#...`) and `mailto:` links are neither external nor internal.
 *
 * @param {string} url Raw link target from markdown.
 * @returns {boolean} True for relative/root-absolute non-external links.
 */
function isInternalLink(url) {
  return !isExternal(url) && !url.startsWith('#') && !url.startsWith('mailto:')
}

/**
 * Check that a relative (or root-absolute) markdown link resolves to a real
 * file: the path itself, the path + `.md`, or the path + `/index.md`
 * (folder-note convention). Query strings and `#anchors` are stripped first.
 *
 * @param {string} fromFile Absolute path of the file containing the link.
 * @param {string} url Raw link target from markdown.
 * @returns {boolean} True when at least one candidate exists on disk.
 */
function internalTargetExists(fromFile, url) {
  const clean = url.split('#')[0].split('?')[0].trim()
  if (!clean || clean.startsWith('/')) {
    // root-absolute: map to content dir
    if (!clean || clean === '/') return true
    const base = join(CONTENT_DIR, clean.replace(/^\//, ''))
    return [base, `${base}.md`, join(base, 'index.md')].some(existsFile)
  }
  const base = resolve(dirname(fromFile), clean)
  return [base, `${base}.md`, join(base, 'index.md')].some(existsFile)
}

/**
 * Filesystem existence probe that returns false (instead of throwing) for
 * missing paths, so link checks stay total functions.
 *
 * @param {string} p Candidate absolute path.
 * @returns {boolean} True when `p` is an existing file.
 */
function existsFile(p) {
  try {
    return statSync(p).isFile()
  } catch {
    return false
  }
}

/**
 * Age of a frontmatter date relative to now, for the staleness rule.
 *
 * @param {string} dateStr Value of `updated` (or legacy `date`).
 * @returns {number | null} Age in days, or null when unparseable.
 */
function daysSince(dateStr) {
  const t = Date.parse(dateStr)
  if (Number.isNaN(t)) return null
  return (Date.now() - t) / 86400000
}

/**
 * Split text into fenced-code and prose segments so rules never touch
 * examples inside ``` blocks (e.g. a frontmatter sample containing `---`,
 * or a `#comment` / `- [x](y)` snippet).
 *
 * @param {string} text Markdown body (or any markdown text).
 * @returns {FenceSegment[]} Alternating prose/code segments; odd indices are code.
 */
function splitFences(text) {
  const parts = text.split(/(```[\s\S]*?(?:```|$))/g)
  return parts.map((text, i) => ({ code: i % 2 === 1, text }))
}

/**
 * Project markdown to its prose only, dropping fenced code blocks.
 * Used for whole-text lint checks (lorem, wikilink, MDX) so documenting a
 * forbidden syntax inside an example is not itself a violation.
 * Note: the dataview check intentionally does NOT use this (a dataview block
 * IS a fence — stripping would erase the evidence; see lintFile).
 *
 * @param {string} text Markdown body.
 * @returns {string} Body with fenced blocks removed.
 */
function proseOnly(text) {
  return splitFences(text)
    .filter((p) => !p.code)
    .map((p) => p.text)
    .join('')
}

// ---------------------------------------------------------------- lint one file

/**
 * Lint one markdown file against every ADR-002 rule.
 * Files whose name starts with `_` (`_map.md`, `_templates/*`) are helpers:
 * frontmatter requirements are skipped, only body + format rules apply.
 * Fenced examples are skipped with original line numbers preserved.
 *
 * @param {string} file Absolute file path.
 * @returns {LintResult} Errors and warnings (empty arrays = clean).
 */
function lintFile(file) {
  const rel = relative(ROOT, file)
  const errors = []
  const warnings = []
  const text = readFileSync(file, 'utf8')
  const isHelper = /(^|\/)_[^/]*\.md$/.test(rel) // _map.md, _templates/*: format-only

  const { data, body, error } = parseFrontmatter(text)
  if (error) {
    errors.push(`frontmatter: ${error}`)
    return { rel, errors, warnings, fixed: false }
  }

  if (!isHelper) {
    for (const k of REQUIRED_KEYS) {
      if (data[k] === undefined || data[k] === null || data[k] === '') {
        errors.push(`frontmatter: missing required key "${k}"`)
      }
    }
    for (const k of RECOMMENDED_KEYS) {
      if (data[k] === undefined)
        warnings.push(`frontmatter: missing recommended key "${k}" (ADR-002)`)
    }
    if (UPPERCASE_FM_KEY_RE.test(text.split('---')[1] ?? '')) {
      errors.push('frontmatter: keys must be lowercase (ADR-002)')
    }
    if (typeof data.title === 'string' && data.title.length > 80) {
      warnings.push('frontmatter: title > 80 chars, keep concise')
    }
    const updated = data.updated ?? data.date
    if (updated === undefined) {
      warnings.push('frontmatter: missing "updated" (or legacy "date")')
    } else if (typeof updated !== 'string' || daysSince(updated) === null) {
      warnings.push(`frontmatter: "updated" is not a valid date: ${JSON.stringify(updated)}`)
    } else if (daysSince(updated) > STALE_DAYS) {
      warnings.push(`frontmatter: "updated" is stale (> ${STALE_DAYS}d): ${updated}`)
    }
  }

  // Body rules (prose only — never touch ``` examples)
  const prose = proseOnly(body)
  if (LOREM_RE.test(prose)) errors.push('body: contains "lorem ipsum" placeholder')
  const wl = prose.match(WIKILINK_RE)
  if (wl)
    errors.push(
      `body: wikilink/embed "${wl[0].slice(0, 40)}" forbidden in v1, use relative markdown links (ADR-002)`
    )
  if (DATAVIEW_RE.test(body))
    errors.push('body: dataview block forbidden inside content/ (ADR-002)')
  if (MDX_DIRECTIVE_RE.test(prose))
    errors.push('body: MDX directive (::card etc.) forbidden in v1, use plain bullets (ADR-002)')

  // Per-line checks, fence-aware (``` examples skipped, real numbers kept).
  const rawLines = body.split('\n')
  const fenceMask = []
  {
    let inFence = false
    for (const line of rawLines) {
      if (/^\s*```/.test(line)) {
        inFence = !inFence
        fenceMask.push(true)
      } else {
        fenceMask.push(inFence)
      }
    }
  }
  const lines = rawLines.filter((_, i) => !fenceMask[i])
  const h1 = lines.filter((l) => /^#\s/.test(l))
  if (!isHelper) {
    if (h1.length === 0) warnings.push('body: no H1 found')
    if (h1.length > 1) warnings.push(`body: ${h1.length} H1s found, keep one`)
    if (!lines.some((l) => /^##\s/.test(l))) {
      warnings.push('body: no H2 subsection found (H2 = subkategori per ADR-002)')
    }
  }

  rawLines.forEach((line, i) => {
    if (fenceMask[i]) return
    const n = i + 1
    if (BARE_LINK_BULLET_RE.test(line)) {
      warnings.push(`line ${n}: resource bullet has no description (add "— desc")`)
    }
    const rm = line.match(/^(\s*-\s+)\[([^\]]*)\]\(([^)]*)\)(.*)$/)
    if (rm && !RESOURCE_RE.test(line)) {
      // A link bullet that doesn't follow the convention
      if (!rm[2]) errors.push(`line ${n}: resource bullet has empty link text`)
      else if (!rm[3]) errors.push(`line ${n}: resource bullet has empty URL`)
      else if (!isExternal(rm[3]) && !isInternalLink(rm[3])) {
        errors.push(`line ${n}: resource URL not http(s)/relative: "${rm[3]}"`)
      } else {
        warnings.push(`line ${n}: resource bullet should use "— desc" separator (ADR-002)`)
      }
    }
    const ok = line.match(RESOURCE_RE)
    if (ok) {
      const [, , name, url, rest] = ok
      if (!name.trim()) errors.push(`line ${n}: resource has empty name`)
      if (!/^https?:\/\/[^\s)]+/i.test(url) && !isInternalLink(url)) {
        errors.push(`line ${n}: resource URL invalid: "${url}"`)
      }
      if (!rest.trim()) warnings.push(`line ${n}: resource "${name}" has no description`)
    }
    // Internal link existence (any markdown link, not just bullets)
    for (const m of line.matchAll(/\[([^\]]*)\]\(([^)]+)\)/g)) {
      const url = m[2]
      if (isInternalLink(url) && !internalTargetExists(file, url)) {
        warnings.push(`line ${n}: internal link target not found: "${url}"`)
      }
    }
  })

  return { rel, errors, warnings, fixed: false }
}

// ---------------------------------------------------------------- formatter (safe fixes)

/**
 * Apply safe formatter fixes to one prose segment (never called on code or
 * frontmatter): heading spacing, resource separator normalization, trailing
 * whitespace trim, blank-line collapse. Every rewrite is idempotent.
 *
 * @param {string} text One prose segment.
 * @returns {string} Formatted segment.
 */
function formatProse(text) {
  let out = text
  // Ensure heading hash has a space: "#Title" -> "# Title"
  out = out.replace(/^(#{1,6})([^\s#])/gm, '$1 $2')
  // Normalize resource separator on the SAME line only (spaces/tabs, never
  // newlines — \s would merge a bare bullet with the next line's bullet).
  // The '-' form must not be followed by '[' (that is the next bullet, not a desc).
  out = out.replace(/^(\s*-\s+\[[^\]]+\]\([^)]+\))[ \t]*(--|–|-(?![ \t]*\[))[ \t]+/gm, '$1 — ')
  // Trim trailing whitespace per line
  out = out.replace(/[ \t]+$/gm, '')
  // Collapse 3+ consecutive blank lines to max one empty line
  out = out.replace(/\n{3,}/g, '\n\n')
  return out
}

/**
 * Format a whole file: frontmatter is passed through untouched, the body is
 * formatted per-segment (``` blocks byte-identical), then a blank line after
 * the closing fence and a single trailing newline are enforced.
 *
 * @param {string} text Full file content.
 * @returns {string} Formatted content (equal to input when already clean).
 */
function formatText(text) {
  // Split frontmatter (same boundaries as the parser) so prose rules never
  // touch it; format body per-segment, leaving ``` blocks byte-identical.
  let fm = ''
  let body = text
  if (text.startsWith('---')) {
    const close = text.indexOf('\n---', 3)
    if (close !== -1) {
      const end = close + 4
      fm = text.slice(0, end)
      body = text.slice(end)
    }
  }
  let bodyOut = splitFences(body)
    .map((p) => (p.code ? p.text : formatProse(p.text)))
    .join('')
  // Ensure blank line between frontmatter close and body content.
  if (fm && /^\n[^\n]/.test(bodyOut)) bodyOut = `\n${bodyOut}`
  let out = fm + bodyOut
  // Ensure single trailing newline
  out = out.replace(/\s+$/, '') + '\n'
  return out
}

// ---------------------------------------------------------------- main

const files = (targets.length ? targets.map((t) => resolve(ROOT, t)) : walk(CONTENT_DIR)).filter(
  (f) => f.endsWith('.md') && existsFile(f)
)

if (files.length === 0) {
  console.log('contentlint: no markdown files found.')
  process.exit(0)
}

let errorCount = 0
let warnCount = 0
let fixedCount = 0

for (const file of files) {
  if (FIX) {
    const before = readFileSync(file, 'utf8')
    const after = formatText(before)
    if (after !== before) {
      writeFileSync(file, after)
      fixedCount++
    }
  }
  const { rel, errors, warnings } = lintFile(file)
  for (const e of errors) {
    errorCount++
    console.log(`error  ${rel}: ${e}`)
  }
  for (const w of warnings) {
    warnCount++
    console.log(`warn   ${rel}: ${w}`)
  }
}

if (FIX && fixedCount > 0) console.log(`\ncontentlint: formatted ${fixedCount} file(s).`)
console.log(
  `\ncontentlint: ${files.length} file(s), ${errorCount} error(s), ${warnCount} warning(s).${FIX ? '' : ' (run with --fix to auto-format)'}`
)

if (errorCount > 0 || (STRICT && warnCount > 0)) process.exit(1)
