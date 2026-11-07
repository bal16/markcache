/**
 * Shared YAML-subset frontmatter parser (ADR-002 flat subset).
 *
 * Satu sumber untuk `contentlint.mjs` (validasi) dan `gen-index.mjs`
 * (generator), supaya aturan parsing tidak pernah menyimpang.
 */

/**
 * Parsed frontmatter outcome.
 * @typedef {object} FrontmatterResult
 * @property {Record<string, unknown> | null} data Parsed key/value map, null on error.
 * @property {string} body Markdown body after the closing fence.
 * @property {string | null} rawFm Raw frontmatter block (without fences), null on error.
 * @property {string | null} error Machine-readable failure reason, null on success.
 */

/**
 * Split a file into YAML frontmatter and markdown body.
 * Understands only the flat subset ADR-002 allows (scalars, inline lists,
 * `#` comment lines); nested blocks are reported as errors, not parsed.
 *
 * @param {string} text Full file content.
 * @returns {FrontmatterResult} Parsed data (or an error descriptor).
 */
export function parseFrontmatter(text) {
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
export function parseScalar(v) {
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
