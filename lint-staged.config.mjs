// lint-staged config (replaces the "lint-staged" key previously in package.json).
//
// Cost policy: the pre-commit hook must stay <1s for content-only commits
// (the dominant case for a curated directory). Full `pnpm typecheck`
// (~7s, uncacheable — vue-tsc rechecks every SFC despite tsbuildinfo)
// runs ONLY when code files are staged, and unconditionally in CI.

export default {
  '*': ['biome check --write --no-errors-on-unmatched'],
  '*.md': ['markdownlint-cli2 --fix'],
  '*.{js,ts,vue}': ['oxlint --deny correctness -A no-unused-vars -A no-empty-function'],
  '*.{js,mjs,cjs,ts,mts,cts,vue}': () => 'pnpm typecheck',
}
