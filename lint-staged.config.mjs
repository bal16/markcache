// lint-staged config (replaces the "lint-staged" key previously in package.json).
//
// Cost policy: the pre-commit hook stays <1s for both content-only and code
// commits. Type checking is deliberately NOT part of pre-commit: `vue-tsc`
// takes ~5-7s on any source change (it rechecks every SFC, so incremental
// builds don't help). `pnpm typecheck` runs once per push instead, in
// .husky/pre-push.

export default {
  '*': ['biome check --write --no-errors-on-unmatched'],
  '*.md': ['markdownlint-cli2 --fix'],
  '*.{js,ts,vue}': ['oxlint'],
}
