export async function useNavigationItem() {
  const { data: navigation } = await useAsyncData('navigation', () => {
    // Curation order via the `order` frontmatter field; `domain` is carried
    // along for sidebar grouping (ADR-006, presentation-only).
    return queryCollectionNavigation('content', ['domain', 'order']).order('order', 'ASC')
  })

  // 1 folder = 1 category with index.md. Folders containing only index.md are
  // promoted to standalone items: the page title is used, with no duplicate
  // collapsible parent (the folder name is masked by SidebarItem).
  const normalized = computed(() => {
    const promote = (node: NavNode): NavNode => {
      if (!node) return node
      const original = node.children
      if (!original?.length) return node
      const children = original.map(promote)
      const first = children[0]
      if (first && children.length === 1 && first.path === node.path && !first.children) {
        return first
      }
      return { ...node, children }
    }
    return (navigation.value ?? []).filter(Boolean).map(promote)
  })

  // Domain grouping for the sidebar: a non-clickable heading per domain, all
  // links stay flat (same concept as the landing page). `/directory` (Index) is
  // already a fixed link at the top of the sidebar, so do not duplicate it in
  // the Meta group.
  const groups = computed(() => {
    return DOMAIN_ORDER.map((domain) => ({
      domain,
      label: DOMAIN_LABEL[domain] ?? domain,
      items: normalized.value.filter(
        (n) => n.path !== '/directory' && (n.domain ?? 'utilitas') === domain
      ),
    })).filter((g) => g.items.length > 0)
  })

  return {
    navigation: normalized,
    groups,
  }
}

// ADR-006: top-level groups. Used by the landing page and sidebar (heading per domain).
export const DOMAIN_ORDER = ['hiburan', 'dev', 'utilitas', 'meta'] as const
export const DOMAIN_LABEL: Record<string, string> = {
  hiburan: 'Hiburan',
  dev: 'Developer',
  utilitas: 'Utilitas',
  meta: 'Meta',
}

interface NavNode {
  title: string
  path: string
  domain?: string
  children?: NavNode[]
}
